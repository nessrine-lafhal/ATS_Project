import os
import json
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, T5ForConditionalGeneration, T5Tokenizer
import re

class JobDescriptionOptimizer:
    """
    Classe pour optimiser les descriptions de postes en utilisant GPT-2 et T5.
    """
    
    def __init__(self):
        """
        Initialise les modèles GPT-2 et T5 pour l'optimisation des descriptions de postes.
        """
        print("Initialisation des modèles pour l'optimisation des descriptions de postes...")
        
        # Initialiser GPT-2 pour la génération de texte
        self.gpt2_model_name = "gpt2"
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained(self.gpt2_model_name)
        self.gpt2_model = GPT2LMHeadModel.from_pretrained(self.gpt2_model_name)
        
        # Initialiser T5 pour le résumé et la réécriture
        self.t5_model_name = "t5-base"
        self.t5_tokenizer = T5Tokenizer.from_pretrained(self.t5_model_name)
        self.t5_model = T5ForConditionalGeneration.from_pretrained(self.t5_model_name)
        
        # Charger les templates et exemples pour l'optimisation
        self.templates = self._load_templates()
        self.examples = self._load_examples()
        
        # Mots-clés attractifs pour les descriptions de postes
        self.attractive_keywords = [
            "innovant", "créatif", "collaboratif", "flexible", "dynamique", 
            "croissance", "développement", "opportunité", "impact", "passion",
            "équilibre", "diversité", "inclusion", "apprentissage", "évolution",
            "autonomie", "responsabilité", "challenge", "international", "avantages"
        ]
        
        print("Modèles pour l'optimisation des descriptions de postes initialisés avec succès.")
    
    def _load_templates(self) -> Dict[str, str]:
        """
        Charge les templates pour différentes sections de descriptions de postes.
        """
        # Dans une implémentation réelle, ces templates seraient chargés depuis un fichier
        return {
            "introduction": "Notre entreprise {company_name} recherche un(e) {job_title} {job_type} pour rejoindre notre équipe {department}.",
            "about_company": "Chez {company_name}, nous {company_mission}. Nous sommes fiers de {company_values}.",
            "responsibilities": "En tant que {job_title}, vous serez responsable de :",
            "requirements": "Profil recherché :",
            "benefits": "Ce que nous offrons :",
            "application": "Pour postuler, veuillez envoyer votre CV et lettre de motivation à {application_email}."
        }
    
    def _load_examples(self) -> Dict[str, List[str]]:
        """
        Charge des exemples de descriptions de postes de haute qualité pour l'apprentissage.
        """
        # Dans une implémentation réelle, ces exemples seraient chargés depuis une base de données
        return {
            "tech": [
                "Nous recherchons un développeur full stack passionné pour rejoindre notre équipe dynamique...",
                "En tant qu'ingénieur DevOps, vous serez au cœur de notre infrastructure cloud..."
            ],
            "marketing": [
                "Nous cherchons un responsable marketing digital créatif pour développer notre présence en ligne...",
                "Le chef de produit marketing que nous recherchons aura pour mission de..."
            ],
            "sales": [
                "Notre équipe commerciale s'agrandit et recherche un business developer talentueux...",
                "En tant que responsable des ventes, vous aurez l'opportunité de..."
            ]
        }
    
    def analyze_job_description(self, job_description: str) -> Dict[str, Any]:
        """
        Analyse une description de poste existante pour identifier les forces et faiblesses.
        """
        # Calculer la longueur du texte
        word_count = len(job_description.split())
        
        # Analyser la présence de mots-clés attractifs
        attractive_keywords_count = sum(1 for keyword in self.attractive_keywords if keyword.lower() in job_description.lower())
        attractive_keywords_ratio = attractive_keywords_count / len(self.attractive_keywords)
        
        # Analyser la structure (présence des sections importantes)
        has_responsibilities = any(keyword in job_description.lower() for keyword in ["responsabilités", "missions", "tâches"])
        has_requirements = any(keyword in job_description.lower() for keyword in ["profil", "compétences", "requis", "qualifications"])
        has_benefits = any(keyword in job_description.lower() for keyword in ["avantages", "offrons", "proposons", "bénéfices"])
        
        # Analyser la clarté (phrases trop longues)
        sentences = re.split(r'[.!?]+', job_description)
        avg_sentence_length = sum(len(sentence.split()) for sentence in sentences if sentence) / max(1, len(sentences))
        clarity_score = max(0, min(100, 100 - (avg_sentence_length - 15) * 5)) if avg_sentence_length > 15 else 100
        
        # Calculer un score global
        structure_score = (has_responsibilities + has_requirements + has_benefits) / 3 * 100
        attractiveness_score = attractive_keywords_ratio * 100
        overall_score = (structure_score * 0.4 + attractiveness_score * 0.3 + clarity_score * 0.3)
        
        return {
            "word_count": word_count,
            "attractive_keywords_found": attractive_keywords_count,
            "structure_score": structure_score,
            "clarity_score": clarity_score,
            "attractiveness_score": attractiveness_score,
            "overall_score": overall_score,
            "has_responsibilities": has_responsibilities,
            "has_requirements": has_requirements,
            "has_benefits": has_benefits,
            "improvement_areas": self._get_improvement_areas(has_responsibilities, has_requirements, has_benefits, 
                                                            attractive_keywords_ratio, clarity_score)
        }
    
    def _get_improvement_areas(self, has_responsibilities: bool, has_requirements: bool, 
                              has_benefits: bool, attractive_keywords_ratio: float, 
                              clarity_score: float) -> List[str]:
        """
        Identifie les domaines d'amélioration pour la description de poste.
        """
        improvements = []
        
        if not has_responsibilities:
            improvements.append("Ajouter une section détaillant les responsabilités du poste")
        
        if not has_requirements:
            improvements.append("Ajouter une section précisant les compétences et qualifications requises")
        
        if not has_benefits:
            improvements.append("Ajouter une section sur les avantages et bénéfices offerts")
        
        if attractive_keywords_ratio < 0.3:
            improvements.append("Utiliser plus de termes attractifs pour susciter l'intérêt des candidats")
        
        if clarity_score < 70:
            improvements.append("Améliorer la clarté en utilisant des phrases plus courtes et directes")
        
        return improvements
    
    def optimize_job_description(self, job_description: str, job_category: str, 
                                optimization_level: str = "medium") -> Dict[str, Any]:
        """
        Optimise une description de poste existante.
        
        Args:
            job_description: La description de poste à optimiser
            job_category: Catégorie du poste (tech, marketing, sales, etc.)
            optimization_level: Niveau d'optimisation (light, medium, full)
            
        Returns:
            Dictionnaire contenant la description optimisée et des métriques
        """
        # Analyser la description actuelle
        analysis = self.analyze_job_description(job_description)
        
        # Déterminer les sections à optimiser en fonction du niveau d'optimisation
        sections_to_optimize = []
        if optimization_level == "light":
            # Optimisation légère: améliorer uniquement les sections problématiques
            if not analysis["has_responsibilities"]:
                sections_to_optimize.append("responsibilities")
            if not analysis["has_benefits"]:
                sections_to_optimize.append("benefits")
            if analysis["clarity_score"] < 70:
                sections_to_optimize.append("clarity")
        elif optimization_level == "medium":
            # Optimisation moyenne: améliorer les sections problématiques + attractivité
            sections_to_optimize = ["attractiveness"]
            if not analysis["has_responsibilities"]:
                sections_to_optimize.append("responsibilities")
            if not analysis["has_requirements"]:
                sections_to_optimize.append("requirements")
            if not analysis["has_benefits"]:
                sections_to_optimize.append("benefits")
            if analysis["clarity_score"] < 80:
                sections_to_optimize.append("clarity")
        else:  # full
            # Optimisation complète: réécriture complète
            sections_to_optimize = ["full_rewrite"]
        
        # Optimiser la description
        optimized_description = job_description
        
        # Appliquer les optimisations
        if "full_rewrite" in sections_to_optimize:
            # Utiliser T5 pour résumer d'abord
            input_text = "summarize: " + job_description
            input_ids = self.t5_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
            summary_ids = self.t5_model.generate(input_ids, max_length=150, min_length=40, 
                                               length_penalty=2.0, num_beams=4, early_stopping=True)
            summary = self.t5_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            
            # Puis utiliser GPT-2 pour générer une nouvelle description basée sur le résumé et les exemples
            prompt = f"Voici une description de poste à améliorer: {summary}\n\nVoici une version améliorée:"
            if job_category in self.examples:
                prompt += f"\n\nExemple de bonne description pour ce type de poste:\n{self.examples[job_category][0]}"
            
            input_ids = self.gpt2_tokenizer.encode(prompt, return_tensors="pt")
            output = self.gpt2_model.generate(
                input_ids,
                max_length=1024,
                temperature=0.8,
                top_k=50,
                top_p=0.95,
                repetition_penalty=1.2,
                do_sample=True,
                num_return_sequences=1
            )
            
            optimized_description = self.gpt2_tokenizer.decode(output[0], skip_special_tokens=True)
            # Extraire uniquement la partie générée après le prompt
            optimized_description = optimized_description.split("Voici une version améliorée:")[-1].strip()
            
        else:
            # Optimisations spécifiques par section
            if "clarity" in sections_to_optimize:
                # Utiliser T5 pour simplifier le texte
                input_text = "simplify: " + job_description
                input_ids = self.t5_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
                output_ids = self.t5_model.generate(input_ids, max_length=512, min_length=len(job_description.split()) // 2, 
                                                 length_penalty=1.0, num_beams=4, early_stopping=True)
                optimized_description = self.t5_tokenizer.decode(output_ids[0], skip_special_tokens=True)
            
            if "attractiveness" in sections_to_optimize:
                # Ajouter des mots-clés attractifs
                for keyword in self.attractive_keywords:
                    if keyword not in optimized_description.lower() and np.random.random() < 0.3:
                        # Trouver une phrase aléatoire pour insérer le mot-clé
                        sentences = re.split(r'[.!?]+', optimized_description)
                        if sentences:
                            sentence_idx = np.random.randint(0, len(sentences))
                            words = sentences[sentence_idx].split()
                            if words:
                                insert_idx = np.random.randint(0, len(words))
                                words.insert(insert_idx, keyword)
                                sentences[sentence_idx] = " ".join(words)
                                optimized_description = ".".join(sentences)
            
            # Ajouter les sections manquantes
            if "responsibilities" in sections_to_optimize:
                # Générer des responsabilités basées sur la description
                responsibilities_prompt = f"Générer 5 responsabilités pour ce poste: {job_description}"
                input_ids = self.gpt2_tokenizer.encode(responsibilities_prompt, return_tensors="pt")
                output = self.gpt2_model.generate(
                    input_ids,
                    max_length=200,
                    temperature=0.7,
                    top_k=50,
                    top_p=0.95,
                    num_return_sequences=1
                )
                responsibilities = self.gpt2_tokenizer.decode(output[0], skip_special_tokens=True)
                responsibilities = responsibilities.split("Générer 5 responsabilités pour ce poste:")[-1].strip()
                
                # Formater les responsabilités
                responsibilities_list = responsibilities.split("\n")
                formatted_responsibilities = "\n\nResponsabilités:\n" + "\n".join([f"- {r.strip()}" for r in responsibilities_list if r.strip()])
                
                optimized_description += formatted_responsibilities
            
            if "benefits" in sections_to_optimize:
                # Ajouter une section sur les avantages
                benefits = "\n\nCe que nous offrons:\n"
                benefits += "- Un environnement de travail dynamique et collaboratif\n"
                benefits += "- Des opportunités de développement professionnel\n"
                benefits += "- Un équilibre vie professionnelle/vie personnelle\n"
                benefits += "- Une rémunération compétitive\n"
                benefits += "- Des avantages sociaux attractifs"
                
                optimized_description += benefits
        
        # Analyser la description optimisée
        optimized_analysis = self.analyze_job_description(optimized_description)
        
        return {
            "original_description": job_description,
            "optimized_description": optimized_description,
            "original_analysis": analysis,
            "optimized_analysis": optimized_analysis,
            "improvement_percentage": (optimized_analysis["overall_score"] - analysis["overall_score"]) / max(1, analysis["overall_score"]) * 100,
            "optimization_level": optimization_level,
            "timestamp": datetime.now().isoformat()
        }
    
    def generate_job_description(self, job_title: str, job_category: str, 
                               skills_required: List[str], company_info: Dict[str, str]) -> Dict[str, Any]:
        """
        Génère une description de poste complète à partir de zéro.
        
        Args:
            job_title: Titre du poste
            job_category: Catégorie du poste (tech, marketing, sales, etc.)
            skills_required: Liste des compétences requises
            company_info: Informations sur l'entreprise
            
        Returns:
            Dictionnaire contenant la description générée et des métriques
        """
        # Construire un prompt pour GPT-2
        prompt = f"Générer une description de poste pour {job_title} chez {company_info.get('name', 'notre entreprise')}.\n\n"
        
        # Ajouter des informations sur l'entreprise
        prompt += f"À propos de l'entreprise: {company_info.get('description', '')}\n\n"
        
        # Ajouter les compétences requises
        prompt += f"Compétences requises: {', '.join(skills_required)}\n\n"
        
        # Ajouter un exemple si disponible
        if job_category in self.examples and self.examples[job_category]:
            prompt += f"Exemple de bonne description pour ce type de poste:\n{self.examples[job_category][0]}\n\n"
        
        prompt += "Description du poste:"
        
        # Générer la description avec GPT-2
        input_ids = self.gpt2_tokenizer.encode(prompt, return_tensors="pt")
        output = self.gpt2_model.generate(
            input_ids,
            max_length=1024,
            temperature=0.8,
            top_k=50,
            top_p=0.95,
            repetition_penalty=1.2,
            do_sample=True,
            num_return_sequences=1
        )
        
        generated_description = self.gpt2_tokenizer.decode(output[0], skip_special_tokens=True)
        
        # Extraire uniquement la partie générée après "Description du poste:"
        generated_description = generated_description.split("Description du poste:")[-1].strip()
        
        # Structurer la description en sections
        structured_description = self._structure_description(generated_description, job_title, company_info, skills_required)
        
        # Analyser la description générée
        analysis = self.analyze_job_description(structured_description)
        
        return {
            "job_title": job_title,
            "job_category": job_category,
            "skills_required": skills_required,
            "company_info": company_info,
            "generated_description": structured_description,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
    
    def _structure_description(self, description: str, job_title: str, 
                              company_info: Dict[str, str], skills_required: List[str]) -> str:
        """
        Structure une description de poste en sections bien définies.
        """
        # Utiliser T5 pour résumer la description en sections
        sections = {}
        
        # Introduction
        intro_prompt = f"summarize introduction: {description}"
        input_ids = self.t5_tokenizer.encode(intro_prompt, return_tensors="pt", max_length=512, truncation=True)
        output_ids = self.t5_model.generate(input_ids, max_length=100, min_length=30, num_beams=4, early_stopping=True)
        sections["introduction"] = self.t5_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        
        # Responsabilités
        resp_prompt = f"extract responsibilities: {description}"
        input_ids = self.t5_tokenizer.encode(resp_prompt, return_tensors="pt", max_length=512, truncation=True)
        output_ids = self.t5_model.generate(input_ids, max_length=200, min_length=50, num_beams=4, early_stopping=True)
        responsibilities = self.t5_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        
        # Formater les responsabilités en liste
        responsibilities_list = responsibilities.split(". ")
        sections["responsibilities"] = "\n".join([f"- {r.strip()}" for r in responsibilities_list if r.strip()])
        
        # Exigences (basées sur les compétences fournies)
        requirements = ["- " + skill for skill in skills_required]
        sections["requirements"] = "\n".join(requirements)
        
        # Avantages
        benefits_prompt = f"extract benefits: {description}"
        input_ids = self.t5_tokenizer.encode(benefits_prompt, return_tensors="pt", max_length=512, truncation=True)
        output_ids = self.t5_model.generate(input_ids, max_length=150, min_length=30, num_beams=4, early_stopping=True)
        benefits = self.t5_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        
        # Formater les avantages en liste
        benefits_list = benefits.split(". ")
        sections["benefits"] = "\n".join([f"- {b.strip()}" for b in benefits_list if b.strip()])
        
        # Assembler la description structurée
        structured_description = f"# {job_title}\n\n"
        
        # À propos de l'entreprise
        structured_description += f"## À propos de {company_info.get('name', 'notre entreprise')}\n\n"
        structured_description += f"{company_info.get('description', '')}\n\n"
        
        # Introduction
        structured_description += f"## Description du poste\n\n"
        structured_description += f"{sections['introduction']}\n\n"
        
        # Responsabilités
        structured_description += f"## Responsabilités\n\n"
        structured_description += f"{sections['responsibilities']}\n\n"
        
        # Exigences
        structured_description += f"## Profil recherché\n\n"
        structured_description += f"{sections['requirements']}\n\n"
        
        # Avantages
        structured_description += f"## Ce que nous offrons\n\n"
        structured_description += f"{sections['benefits']}\n\n"
        
        # Candidature
        structured_description += f"## Comment postuler\n\n"
        structured_description += f"Envoyez votre CV et une lettre de motivation à {company_info.get('contact_email', 'careers@company.com')}."
        
        return structured_description
    
    def suggest_improvements(self, job_description: str) -> Dict[str, Any]:
        """
        Suggère des améliorations spécifiques pour une description de poste.
        """
        # Analyser la description
        analysis = self.analyze_job_description(job_description)
        
        # Utiliser T5 pour générer des suggestions
        prompt = f"suggest improvements for job description: {job_description}"
        input_ids = self.t5_tokenizer.encode(prompt, return_tensors="pt", max_length=512, truncation=True)
        output_ids = self.t5_model.generate(input_ids, max_length=200, min_length=50, num_beams=4, early_stopping=True)
        suggestions_text = self.t5_tokenizer.decode(output_ids[0], skip_special_tokens=True)
        
        # Formater les suggestions
        suggestions_list = suggestions_text.split(". ")
        suggestions = [s.strip() for s in suggestions_list if s.strip()]
        
        # Ajouter des suggestions basées sur l'analyse
        if analysis["word_count"] < 200:
            suggestions.append("Ajouter plus de détails sur le poste et les responsabilités")
        
        if analysis["word_count"] > 800:
            suggestions.append("Raccourcir la description pour la rendre plus concise et impactante")
        
        if analysis["attractive_keywords_found"] < 5:
            suggestions.append("Ajouter des termes attractifs comme 'innovant', 'collaboratif', 'opportunité', 'impact'")
        
        # Ajouter les suggestions basées sur les domaines d'amélioration identifiés
        suggestions.extend(analysis["improvement_areas"])
        
        return {
            "analysis": analysis,
            "suggestions": suggestions,
            "timestamp": datetime.now().isoformat()
        }

# Fonction pour simuler l'optimisation (pour les tests)
def simulate_job_description_optimization(job_description, job_category="tech", optimization_level="medium"):
    """
    Simule l'optimisation d'une description de poste sans charger les modèles.
    Utilisé pour les tests et le développement.
    """
    # Simuler une analyse
    analysis = {
        "word_count": len(job_description.split()),
        "attractive_keywords_found": 3,
        "structure_score": 70,
        "clarity_score": 80,
        "attractiveness_score": 65,
        "overall_score": 72,
        "has_responsibilities": True,
        "has_requirements": True,
        "has_benefits": False,
        "improvement_areas": ["Ajouter une section sur les avantages et bénéfices offerts"]
    }
    
    # Simuler une description optimisée
    optimized_description = job_description
    
    # Ajouter une section d'avantages
    if not analysis["has_benefits"]:
        benefits = "\n\nCe que nous offrons:\n"
        benefits += "- Un environnement de travail dynamique et collaboratif\n"
        benefits += "- Des opportunités de développement professionnel\n"
        benefits += "- Un équilibre vie professionnelle/vie personnelle\n"
        benefits += "- Une rémunération compétitive\n"
        benefits += "- Des avantages sociaux attractifs"
        
        optimized_description += benefits
    
    # Simuler une analyse optimisée
    optimized_analysis = {
        "word_count": len(optimized_description.split()),
        "attractive_keywords_found": 8,
        "structure_score": 100,
        "clarity_score": 85,
        "attractiveness_score": 80,
        "overall_score": 88,
        "has_responsibilities": True,
        "has_requirements": True,
        "has_benefits": True,
        "improvement_areas": []
    }
    
    return {
        "original_description": job_description,
        "optimized_description": optimized_description,
        "original_analysis": analysis,
        "optimized_analysis": optimized_analysis,
        "improvement_percentage": (optimized_analysis["overall_score"] - analysis["overall_score"]) / max(1, analysis["overall_score"]) * 100,
        "optimization_level": optimization_level,
        "timestamp": datetime.now().isoformat()
    }

# Fonction pour simuler la génération (pour les tests)
def simulate_job_description_generation(job_title, job_category, skills_required, company_info):
    """
    Simule la génération d'une description de poste sans charger les modèles.
    Utilisé pour les tests et le développement.
    """
    # Générer une description simulée
    description = f"# {job_title}\n\n"
    
    # À propos de l'entreprise
    description += f"## À propos de {company_info.get('name', 'notre entreprise')}\n\n"
    description += f"{company_info.get('description', 'Une entreprise innovante dans son domaine.')}\n\n"
    
    # Introduction
    description += f"## Description du poste\n\n"
    description += f"Nous recherchons un(e) {job_title} talentueux(se) pour rejoindre notre équipe dynamique. "
    description += f"Ce poste offre une opportunité unique de contribuer à des projets innovants et impactants.\n\n"
    
    # Responsabilités
    description += f"## Responsabilités\n\n"
    description += f"- Développer et maintenir des solutions de haute qualité\n"
    description += f"- Collaborer avec les équipes transversales pour atteindre les objectifs\n"
    description += f"- Participer à l'amélioration continue des processus\n"
    description += f"- Résoudre des problèmes complexes de manière créative\n"
    description += f"- Contribuer à l'innovation et à la croissance de l'entreprise\n\n"
    
    # Exigences
    description += f"## Profil recherché\n\n"
    for skill in skills_required:
        description += f"- {skill}\n"
    description += f"- Excellentes compétences en communication\n"
    description += f"- Capacité à travailler en équipe\n"
    description += f"- Autonomie et sens de l'initiative\n\n"
    
    # Avantages
    description += f"## Ce que nous offrons\n\n"
    description += f"- Un environnement de travail dynamique et collaboratif\n"
    description += f"- Des opportunités de développement professionnel\n"
    description += f"- Un équilibre vie professionnelle/vie personnelle\n"
    description += f"- Une rémunération compétitive\n"
    description += f"- Des avantages sociaux attractifs\n\n"
    
    # Candidature
    description += f"## Comment postuler\n\n"
    description += f"Envoyez votre CV et une lettre de motivation à {company_info.get('contact_email', 'careers@company.com')}."
    
    # Simuler une analyse
    analysis = {
        "word_count": len(description.split()),
        "attractive_keywords_found": 8,
        "structure_score": 100,
        "clarity_score": 90,
        "attractiveness_score": 85,
        "overall_score": 92,
        "has_responsibilities": True,
        "has_requirements": True,
        "has_benefits": True,
        "improvement_areas": []
    }
    
    return {
        "job_title": job_title,
        "job_category": job_category,
        "skills_required": skills_required,
        "company_info": company_info,
        "generated_description": description,
        "analysis": analysis,
        "timestamp": datetime.now().isoformat()
    }
