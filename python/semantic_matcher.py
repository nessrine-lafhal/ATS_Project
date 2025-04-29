import os
import re
import numpy as np
from typing import Dict, List, Any
from sklearn.metrics.pairwise import cosine_similarity
import torch

# Importations conditionnelles pour gérer le mode de secours
try:
    import spacy
    from transformers import AutoTokenizer, AutoModel
    DEPENDENCIES_INSTALLED = True
except ImportError:
    DEPENDENCIES_INSTALLED = False
    print("Les dépendances requises ne sont pas installées. Mode de simulation activé.")

class SemanticMatcher:
    def __init__(self):
        self.nlp = None
        self.tokenizer = None
        self.model = None
        
        if DEPENDENCIES_INSTALLED:
            try:
                # Charger le modèle spaCy
                self.nlp = spacy.load("fr_core_news_lg")
                
                # Charger le modèle BERT pour l'extraction de features
                self.tokenizer = AutoTokenizer.from_pretrained("camembert-base")
                self.model = AutoModel.from_pretrained("camembert-base")
                print("Modèles de NLP chargés avec succès.")
            except Exception as e:
                print(f"Erreur lors du chargement des modèles NLP: {e}")
    
    def match_resume_to_job(self, cv_analysis: Dict[str, Any], job_description: str) -> float:
        """
        Calculer un score de correspondance entre un CV et une offre d'emploi
        """
        # Extraire les compétences du CV
        cv_skills = cv_analysis.get("skills", [])
        
        # Extraire les compétences de l'offre d'emploi
        job_skills = self._extract_skills_from_job(job_description)
        
        # Calculer le score de correspondance des compétences
        skills_score = self._calculate_skills_match(cv_skills, job_skills)
        
        # Calculer la similarité sémantique entre le CV et l'offre d'emploi
        semantic_score = self._calculate_semantic_similarity(cv_analysis.get("embedding"), job_description)
        
        # Calculer le score d'expérience
        experience_score = self._calculate_experience_match(cv_analysis.get("experience", []), job_description)
        
        # Combiner les scores (avec des poids)
        final_score = 0.4 * skills_score + 0.4 * semantic_score + 0.2 * experience_score
        
        return final_score
    
    def _extract_skills_from_job(self, job_description: str) -> List[str]:
        """
        Extraire les compétences requises d'une offre d'emploi
        """
        if not DEPENDENCIES_INSTALLED or self.nlp is None:
            # Mode de simulation
            return ["python", "javascript", "react", "node.js"]
            
        # Analyser le texte avec spaCy
        doc = self.nlp(job_description)
        
        # Rechercher des phrases comme "compétences requises", "vous maîtrisez", etc.
        skills_section = ""
        skills_matches = re.search(r'(?i)(compétences requises|profil recherché|vous maîtrisez|compétences techniques|vous savez|vous connaissez).*?(?=\n\s*\n|\Z)', job_description, re.DOTALL)
        if skills_matches:
            skills_section = skills_matches.group(0)
        
        # Liste de compétences techniques courantes
        tech_skills = [
            "python", "java", "c++", "javascript", "html", "css", "sql", "php", 
            "docker", "kubernetes", "aws", "azure", "gcp", "linux", "git", "agile", 
            "scrum", "machine learning", "deep learning", "data analysis", "nlp", 
            "react", "angular", "vue", "node.js", "django", "flask", "spring",
            "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy"
        ]
        
        # Liste des compétences non techniques courantes
        soft_skills = [
            "communication", "leadership", "travail d'équipe", "résolution de problèmes",
            "adaptabilité", "créativité", "gestion du temps", "organisation", "négociation",
            "présentation", "autonomie", "prise de décision", "esprit critique"
        ]
        
        # Rechercher les compétences dans le texte complet et la section spécifique
        skills_found = []
        
        # Chercher dans la section de compétences si elle existe
        text_to_search = skills_section if skills_section else job_description
        text_lower = text_to_search.lower()
        
        # Rechercher les compétences techniques
        for skill in tech_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                skills_found.append(skill)
        
        # Rechercher les compétences non techniques
        for skill in soft_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                skills_found.append(skill)
        
        return skills_found
    
    def _calculate_skills_match(self, cv_skills: List[str], job_skills: List[str]) -> float:
        """
        Calculer un score de correspondance entre les compétences du CV et de l'offre d'emploi
        """
        if not job_skills:
            return 0.5  # Score neutre si aucune compétence n'est requise
        
        # Normaliser les compétences
        cv_skills_lower = [skill.lower() for skill in cv_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        # Compter les compétences correspondantes
        matched_skills = set(cv_skills_lower).intersection(set(job_skills_lower))
        
        # Calculer le score de correspondance de base
        if len(job_skills_lower) == 0:
            base_score = 0.5
        else:
            base_score = len(matched_skills) / len(job_skills_lower)
        
        # Si toutes les compétences essentielles sont présentes, bonus
        if matched_skills and len(matched_skills) >= len(job_skills_lower) * 0.7:
            base_score = min(1.0, base_score * 1.2)
        
        return base_score
    
    def _calculate_semantic_similarity(self, cv_embedding: np.ndarray, job_description: str) -> float:
        """
        Calculer la similarité sémantique entre le CV et l'offre d'emploi
        """
        if not DEPENDENCIES_INSTALLED or self.model is None or self.tokenizer is None:
            # Mode de simulation
            return 0.75
            
        # Si pas d'embedding disponible
        if cv_embedding is None:
            return 0.5
        
        # Créer l'embedding pour la description du poste
        job_embedding = self._create_embedding(job_description)
        
        # Calculer la similarité cosinus entre les deux embeddings
        similarity = cosine_similarity(cv_embedding, job_embedding)[0][0]
        
        # Normaliser le score entre 0 et 1
        normalized_score = (similarity + 1) / 2
        
        return normalized_score
    
    def _calculate_experience_match(self, experiences: List[Dict[str, str]], job_description: str) -> float:
        """
        Évaluer la correspondance de l'expérience du candidat avec les exigences du poste
        """
        if not experiences:
            return 0.3  # Score faible si pas d'expérience
        
        # Extraire les années d'expérience demandées dans l'offre
        experience_req_match = re.search(r'(?i)(\d+)(?:\s+(?:à|-)\s+(\d+))?\s+an(?:s|née)?(?:\s+d\'expérience)?', job_description)
        min_years_required = 0
        max_years_required = float('inf')
        
        if experience_req_match:
            min_years_required = int(experience_req_match.group(1))
            if experience_req_match.group(2):
                max_years_required = int(experience_req_match.group(2))
            else:
                max_years_required = min_years_required + 3  # Estimation si pas de maximum spécifié
        
        # Estimer les années d'expérience du candidat
        total_years = 0
        for exp in experiences:
            # Essayer d'extraire les dates
            period = exp.get("period", "")
            years_match = re.findall(r'\b(19|20)\d{2}\b', period)
            
            if len(years_match) >= 2:
                # Si on a deux années, calculer la différence
                start_year = int(years_match[0])
                
                # Si le deuxième match est "présent" ou similaire, utiliser l'année courante
                if "présent" in period.lower() or "aujourd'hui" in period.lower():
                    from datetime import datetime
                    end_year = datetime.now().year
                else:
                    end_year = int(years_match[1])
                
                years = end_year - start_year
                total_years += max(0, years)  # Éviter les valeurs négatives
            elif len(years_match) == 1:
                # Si on a une seule année, estimer à 1 an d'expérience
                total_years += 1
        
        # Calculer le score d'expérience
        if min_years_required == 0:
            # Si aucune exigence spécifique, plus d'expérience est mieux
            experience_score = min(1.0, total_years / 5)  # 5 ans pour un score maximum
        else:
            # Si des exigences spécifiques sont présentes
            if total_years < min_years_required:
                # Pénalité si moins d'expérience que requis
                experience_score = total_years / min_years_required * 0.7
            elif total_years <= max_years_required:
                # Score optimal si dans la plage demandée
                experience_score = 0.8 + 0.2 * (total_years - min_years_required) / (max_years_required - min_years_required)
            else:
                # Légère pénalité si trop d'expérience (potentiellement surqualifié)
                experience_score = 0.9
        
        return experience_score
    
    def _create_embedding(self, text: str) -> np.ndarray:
        """
        Créer un embedding vectoriel pour le texte
        """
        if not DEPENDENCIES_INSTALLED or self.model is None or self.tokenizer is None:
            # Mode de simulation
            return np.random.rand(1, 768)  # Dimension typique des embeddings BERT
            
        # Limiter la taille du texte pour éviter de dépasser les limites du modèle
        max_length = self.tokenizer.model_max_length
        text = text[:5000]  # Limiter à 5000 caractères
        
        # Tokenizer et obtenir les embeddings
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=max_length, padding="max_length")
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # Utiliser l'embedding de [CLS] comme représentation du document
        embedding = outputs.last_hidden_state[:, 0, :].numpy()
        
        return embedding
