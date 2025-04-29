import os
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import json
import spacy
import numpy as np

class ActionEvaluateCandidate(Action):
    def name(self) -> Text:
        return "action_evaluate_candidate"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Récupérer les informations du candidat
        experience_years = tracker.get_slot("experience_years")
        skills = tracker.get_slot("skills")
        education_level = tracker.get_slot("education_level")
        education_field = tracker.get_slot("education_field")
        motivation = tracker.get_slot("motivation")
        
        # Charger les critères du poste
        job_criteria = self._load_job_criteria()
        
        # Évaluation de base
        score = 0
        
        # Évaluer l'expérience
        if experience_years:
            try:
                exp_years = float(experience_years)
                if exp_years >= job_criteria.get("min_experience", 0):
                    score += 25  # 25 points pour l'expérience minimale
                    # Points supplémentaires pour chaque année au-delà du minimum
                    extra_years = exp_years - job_criteria.get("min_experience", 0)
                    if extra_years > 0:
                        score += min(extra_years * 5, 15)  # Max 15 points pour l'expérience supplémentaire
            except:
                pass
                
        # Évaluer les compétences
        if skills:
            required_skills = job_criteria.get("required_skills", [])
            preferred_skills = job_criteria.get("preferred_skills", [])
            
            # Analyser les compétences avec spaCy pour une correspondance sémantique
            nlp = spacy.load("fr_core_news_md")
            
            skills_score = 0
            for skill in skills:
                skill_doc = nlp(skill.lower())
                
                # Vérifier la correspondance avec les compétences requises
                for req_skill in required_skills:
                    req_skill_doc = nlp(req_skill.lower())
                    similarity = skill_doc.similarity(req_skill_doc)
                    if similarity > 0.8:  # Seuil de similarité élevé
                        skills_score += 5  # 5 points par compétence requise
                
                # Vérifier la correspondance avec les compétences préférées
                for pref_skill in preferred_skills:
                    pref_skill_doc = nlp(pref_skill.lower())
                    similarity = skill_doc.similarity(pref_skill_doc)
                    if similarity > 0.8:  # Seuil de similarité élevé
                        skills_score += 3  # 3 points par compétence préférée
                        
            # Plafonner le score des compétences à 30
            score += min(skills_score, 30)
        
        # Évaluer l'éducation
        if education_level and education_field:
            education_scores = {
                "bac": 5,
                "bts": 10,
                "licence": 15,
                "master": 20,
                "doctorat": 25
            }
            
            # Score basé sur le niveau d'éducation
            for level, level_score in education_scores.items():
                if level in education_level.lower():
                    score += level_score
                    break
                    
            # Score supplémentaire si le domaine correspond
            nlp = spacy.load("fr_core_news_md")
            field_doc = nlp(education_field.lower())
            required_field_doc = nlp(job_criteria.get("education_field", "").lower())
            
            field_similarity = field_doc.similarity(required_field_doc)
            if field_similarity > 0.7:
                score += 10
        
        # Évaluer la motivation (analyse de sentiment simplifiée)
        if motivation:
            # Utiliser spaCy pour une analyse de sentiment basique
            nlp = spacy.load("fr_core_news_md")
            doc = nlp(motivation)
            
            # Mots clés positifs liés à la motivation
            positive_keywords = ["passionné", "enthousiaste", "motivé", "intéressé", "déterminé", "engagé", "curieux"]
            
            # Compter les mots positifs
            positive_count = 0
            for token in doc:
                if token.lemma_.lower() in positive_keywords:
                    positive_count += 1
                    
            # Attribuer des points en fonction du nombre de mots positifs
            motivation_score = min(positive_count * 3, 15)  # Max 15 points
            score += motivation_score
        
        # Calculer le score final (sur 100)
        final_score = min(score, 100)
        
        # Déterminer le statut du candidat
        status = "Rejeté"
        if final_score >= 70:
            status = "Fortement recommandé"
        elif final_score >= 50:
            status = "Recommandé"
        elif final_score >= 30:
            status = "À considérer"
            
        # Sauvegarder l'évaluation
        self._save_evaluation(tracker.sender_id, {
            "score": final_score,
            "status": status,
            "details": {
                "experience_score": min((25 + min(float(experience_years or 0) - job_criteria.get("min_experience", 0), 3) * 5), 40),
                "skills_score": min(skills_score if 'skills_score' in locals() else 0, 30),
                "education_score": min((level_score if 'level_score' in locals() else 0) + (10 if 'field_similarity' in locals() and field_similarity > 0.7 else 0), 30),
                "motivation_score": motivation_score if 'motivation_score' in locals() else 0
            }
        })
        
        return []
    
    def _load_job_criteria(self):
        """Charger les critères du poste depuis un fichier JSON"""
        try:
            with open("data/job_criteria.json", "r") as f:
                return json.load(f)
        except:
            # Critères par défaut
            return {
                "min_experience": 2,
                "required_skills": ["Python", "Machine Learning", "Deep Learning"],
                "preferred_skills": ["TensorFlow", "PyTorch", "NLP"],
                "education_field": "Informatique ou Data Science"
            }
    
    def _save_evaluation(self, user_id, evaluation):
        """Sauvegarder l'évaluation du candidat"""
        os.makedirs("evaluations", exist_ok=True)
        with open(f"evaluations/{user_id}.json", "w") as f:
            json.dump(evaluation, f)

class ActionSaveConversation(Action):
    """Action pour sauvegarder la conversation à des fins d'analyse"""
    
    def name(self) -> Text:
        return "action_save_conversation"
        
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
            
        # Récupérer l'historique de la conversation
        conversation = []
        for event in tracker.events:
            if event.get("event") == "user":
                conversation.append({"speaker": "user", "text": event.get("text")})
            elif event.get("event") == "bot":
                conversation.append({"speaker": "bot", "text": event.get("text")})
        
        # Sauvegarder la conversation
        os.makedirs("conversations", exist_ok=True)
        with open(f"conversations/{tracker.sender_id}.json", "w") as f:
            json.dump(conversation, f)
            
        return []

class ActionAnalyzeAnswers(Action):
    """Action pour analyser les réponses du candidat"""
    
    def name(self) -> Text:
        return "action_analyze_answers"
        
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
            
        # Récupérer les réponses aux questions clés
        motivation_answer = None
        experience_answers = []
        
        for event in tracker.events:
            if event.get("event") == "user":
                text = event.get("text", "")
                intent = tracker.latest_message.get("intent", {}).get("name", "")
                
                if intent == "provide_motivation":
                    motivation_answer = text
                elif intent == "provide_experience":
                    experience_answers.append(text)
        
        # Analyse des réponses (version simplifiée)
        analysis = {}
        
        # Analyser la motivation
        if motivation_answer:
            # Analyse de sentiment simplifiée
            nlp = spacy.load("fr_core_news_md")
            doc = nlp(motivation_answer)
            
            # Mots clés liés à la personnalité
            personality_traits = {
                "créatif": 0,
                "organisé": 0,
                "analytique": 0,
                "communicatif": 0,
                "leader": 0,
                "adaptable": 0
            }
            
            # Analyser les traits de personnalité basés sur les mots
            for token in doc:
                for trait in personality_traits:
                    if token.lemma_.lower() == trait or token.similarity(nlp(trait)) > 0.8:
                        personality_traits[trait] += 1
            
            # Déterminer les traits dominants
            dominant_traits = [trait for trait, count in personality_traits.items() if count > 0]
            analysis["personality"] = dominant_traits
        
        # Sauvegarder l'analyse
        os.makedirs("analyses", exist_ok=True)
        with open(f"analyses/{tracker.sender_id}.json", "w") as f:
            json.dump(analysis, f)
            
        return []
