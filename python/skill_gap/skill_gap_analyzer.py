import numpy as np
import pandas as pd
import re
import json
import logging
from typing import Dict, List, Tuple, Any, Optional, Union
from datetime import datetime

# Simulation des imports pour Hugging Face Transformers et Gensim
# Dans une implémentation réelle, ces bibliothèques seraient importées
# from transformers import AutoTokenizer, AutoModel, pipeline
# import gensim.downloader as api
# from gensim.models import Word2Vec, KeyedVectors

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SkillGapAnalyzer:
    """
    Classe pour analyser les écarts de compétences entre les candidats et les postes
    en utilisant BERT pour l'analyse sémantique et Gensim pour les embeddings de mots.
    """
    
    def __init__(self):
        """
        Initialise l'analyseur d'écarts de compétences avec les modèles BERT et Word2Vec.
        """
        logger.info("Initialisation de l'analyseur d'écarts de compétences...")
        
        # Simulation de l'initialisation des modèles
        # Dans une implémentation réelle, nous chargerions les modèles ici
        self.bert_model_name = "bert-base-multilingual-cased"
        self.word2vec_model_name = "word2vec-google-news-300"
        
        # Simulation des modèles chargés
        self.bert_tokenizer = None  # AutoTokenizer.from_pretrained(self.bert_model_name)
        self.bert_model = None  # AutoModel.from_pretrained(self.bert_model_name)
        self.word2vec_model = None  # api.load(self.word2vec_model_name)
        
        # Dictionnaire de compétences par domaine (simulation)
        self.skills_taxonomy = self._load_skills_taxonomy()
        
        # Seuils pour l'analyse
        self.similarity_threshold = 0.75
        self.critical_skill_threshold = 0.85
        
        logger.info("Analyseur d'écarts de compétences initialisé avec succès.")
    
    def _load_skills_taxonomy(self) -> Dict[str, List[str]]:
        """
        Charge une taxonomie de compétences par domaine.
        Dans une implémentation réelle, cela pourrait être chargé à partir d'une base de données.
        """
        return {
            "programming": [
                "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", 
                "TypeScript", "Go", "Rust", "Scala", "R", "MATLAB", "SQL", "NoSQL", "HTML", "CSS"
            ],
            "data_science": [
                "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Mining", 
                "Statistical Analysis", "Data Visualization", "Big Data", "A/B Testing", 
                "Predictive Modeling", "Feature Engineering", "TensorFlow", "PyTorch", "Keras", 
                "scikit-learn", "pandas", "NumPy", "SciPy"
            ],
            "cloud": [
                "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Serverless", 
                "Microservices", "DevOps", "CI/CD", "Infrastructure as Code", "Terraform", 
                "CloudFormation", "Ansible", "Chef", "Puppet"
            ],
            "soft_skills": [
                "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", 
                "Time Management", "Adaptability", "Creativity", "Emotional Intelligence", 
                "Conflict Resolution", "Negotiation", "Presentation Skills", "Project Management"
            ],
            "business": [
                "Marketing", "Sales", "Finance", "Accounting", "HR", "Operations", "Strategy", 
                "Business Development", "Product Management", "Customer Success", "UX/UI Design", 
                "Market Research", "Data Analysis", "SEO", "SEM", "Content Marketing", "CRM"
            ]
        }
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        """
        Extrait les compétences d'un texte en utilisant une approche basée sur les règles
        et l'analyse sémantique.
        
        Dans une implémentation réelle, nous utiliserions BERT pour l'extraction d'entités
        et l'analyse sémantique.
        """
        # Simulation de l'extraction de compétences
        # Normalisation du texte
        text = text.lower()
        
        # Liste pour stocker les compétences extraites
        extracted_skills = []
        
        # Parcourir la taxonomie des compétences et rechercher des correspondances
        for domain, skills in self.skills_taxonomy.items():
            for skill in skills:
                # Recherche simple de correspondance (dans une implémentation réelle, 
                # nous utiliserions des techniques plus sophistiquées)
                if skill.lower() in text:
                    extracted_skills.append(skill)
        
        # Simuler l'ajout de quelques compétences supplémentaires basées sur l'analyse sémantique
        if "data analysis" in text or "analytics" in text:
            if "Data Analysis" not in extracted_skills:
                extracted_skills.append("Data Analysis")
        
        if "machine learning" in text or "ml" in text or "ai" in text:
            if "Machine Learning" not in extracted_skills:
                extracted_skills.append("Machine Learning")
        
        if "team" in text and "lead" in text:
            if "Leadership" not in extracted_skills:
                extracted_skills.append("Leadership")
        
        return list(set(extracted_skills))  # Éliminer les doublons
    
    def _calculate_skill_similarity(self, skill1: str, skill2: str) -> float:
        """
        Calcule la similarité sémantique entre deux compétences en utilisant Word2Vec.
        
        Dans une implémentation réelle, nous utiliserions les embeddings de Gensim.
        """
        # Simulation de la similarité sémantique
        # Correspondance exacte
        if skill1.lower() == skill2.lower():
            return 1.0
        
        # Correspondances partielles simulées
        skill_pairs = {
            ("python", "programming"): 0.85,
            ("java", "programming"): 0.82,
            ("javascript", "programming"): 0.80,
            ("machine learning", "data science"): 0.90,
            ("deep learning", "machine learning"): 0.88,
            ("tensorflow", "deep learning"): 0.85,
            ("pytorch", "deep learning"): 0.84,
            ("aws", "cloud"): 0.87,
            ("azure", "cloud"): 0.86,
            ("docker", "devops"): 0.83,
            ("kubernetes", "devops"): 0.82,
            ("communication", "soft skills"): 0.88,
            ("leadership", "management"): 0.86,
            ("teamwork", "collaboration"): 0.90,
            ("sql", "database"): 0.85,
            ("nosql", "database"): 0.82,
            ("marketing", "business"): 0.84,
            ("sales", "business"): 0.83,
            ("finance", "business"): 0.82,
        }
        
        # Vérifier si la paire existe dans notre dictionnaire simulé
        pair = (skill1.lower(), skill2.lower())
        if pair in skill_pairs:
            return skill_pairs[pair]
        
        # Inverser la paire et vérifier à nouveau
        pair_reversed = (skill2.lower(), skill1.lower())
        if pair_reversed in skill_pairs:
            return skill_pairs[pair_reversed]
        
        # Valeur par défaut pour les compétences non liées
        return 0.3
    
    def _get_skill_embedding(self, skill: str) -> np.ndarray:
        """
        Obtient l'embedding d'une compétence en utilisant BERT.
        
        Dans une implémentation réelle, nous utiliserions le modèle BERT pour générer
        des embeddings contextuels.
        """
        # Simulation d'un embedding (vecteur aléatoire de dimension 768, typique pour BERT)
        # Dans une implémentation réelle, nous utiliserions:
        # inputs = self.bert_tokenizer(skill, return_tensors="pt")
        # outputs = self.bert_model(**inputs)
        # embedding = outputs.last_hidden_state.mean(dim=1).detach().numpy()
        
        # Générer un vecteur aléatoire mais déterministe basé sur la chaîne
        np.random.seed(hash(skill) % 2**32)
        embedding = np.random.randn(768)
        # Normaliser l'embedding
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding
    
    def _calculate_skill_importance(self, skill: str, job_description: str) -> float:
        """
        Calcule l'importance d'une compétence pour un poste donné.
        
        Dans une implémentation réelle, nous utiliserions l'analyse sémantique
        et la fréquence d'apparition dans la description du poste.
        """
        # Simulation de l'importance des compétences
        job_description_lower = job_description.lower()
        skill_lower = skill.lower()
        
        # Vérifier si la compétence est mentionnée explicitement
        if skill_lower in job_description_lower:
            # Compter le nombre d'occurrences
            count = job_description_lower.count(skill_lower)
            
            # Vérifier si la compétence est mentionnée comme "requise" ou "obligatoire"
            required_patterns = [
                f"required {skill_lower}", 
                f"{skill_lower} required",
                f"mandatory {skill_lower}",
                f"{skill_lower} mandatory",
                f"must have {skill_lower}",
                f"essential {skill_lower}"
            ]
            
            is_required = any(pattern in job_description_lower for pattern in required_patterns)
            
            # Calculer l'importance en fonction du nombre d'occurrences et si elle est requise
            importance = min(0.5 + (count * 0.1) + (0.3 if is_required else 0), 1.0)
            
            return importance
        
        # Si la compétence n'est pas mentionnée explicitement, utiliser une valeur par défaut
        return 0.3
    
    def analyze_skill_gap(self, 
                          candidate_resume: str, 
                          job_description: str, 
                          candidate_id: Optional[str] = None,
                          job_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyse l'écart de compétences entre un candidat et un poste.
        
        Args:
            candidate_resume: Le CV du candidat sous forme de texte
            job_description: La description du poste sous forme de texte
            candidate_id: Identifiant optionnel du candidat
            job_id: Identifiant optionnel du poste
            
        Returns:
            Un dictionnaire contenant l'analyse détaillée des écarts de compétences
        """
        logger.info(f"Analyse des écarts de compétences pour candidat {candidate_id} et poste {job_id}")
        
        # Extraire les compétences du CV et de la description du poste
        candidate_skills = self._extract_skills_from_text(candidate_resume)
        job_skills = self._extract_skills_from_text(job_description)
        
        logger.info(f"Compétences du candidat: {candidate_skills}")
        logger.info(f"Compétences requises pour le poste: {job_skills}")
        
        # Calculer l'importance de chaque compétence pour le poste
        job_skills_importance = {skill: self._calculate_skill_importance(skill, job_description) 
                                for skill in job_skills}
        
        # Identifier les compétences critiques (haute importance)
        critical_skills = [skill for skill, importance in job_skills_importance.items() 
                          if importance >= self.critical_skill_threshold]
        
        # Analyser les correspondances et les écarts
        matched_skills = []
        missing_skills = []
        additional_skills = []
        
        # Vérifier les compétences du poste par rapport aux compétences du candidat
        for job_skill in job_skills:
            best_match = None
            best_similarity = 0
            
            for candidate_skill in candidate_skills:
                similarity = self._calculate_skill_similarity(job_skill, candidate_skill)
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = candidate_skill
            
            # Si une correspondance suffisamment forte est trouvée
            if best_similarity >= self.similarity_threshold:
                matched_skills.append({
                    "job_skill": job_skill,
                    "candidate_skill": best_match,
                    "similarity": best_similarity,
                    "importance": job_skills_importance[job_skill]
                })
            else:
                # Compétence manquante
                missing_skills.append({
                    "skill": job_skill,
                    "importance": job_skills_importance[job_skill],
                    "is_critical": job_skill in critical_skills
                })
        
        # Identifier les compétences supplémentaires du candidat
        for candidate_skill in candidate_skills:
            # Vérifier si cette compétence a déjà été associée à une compétence du poste
            if not any(match["candidate_skill"] == candidate_skill for match in matched_skills):
                # Trouver la meilleure correspondance potentielle parmi les compétences du poste
                best_match = None
                best_similarity = 0
                
                for job_skill in job_skills:
                    similarity = self._calculate_skill_similarity(candidate_skill, job_skill)
                    if similarity > best_similarity:
                        best_similarity = similarity
                        best_match = job_skill
                
                additional_skills.append({
                    "skill": candidate_skill,
                    "best_related_job_skill": best_match,
                    "similarity": best_similarity,
                    "relevance": best_similarity * (job_skills_importance.get(best_match, 0.3) if best_match else 0.3)
                })
        
        # Calculer le score global de correspondance des compétences
        if len(job_skills) > 0:
            # Pondérer par l'importance des compétences
            total_importance = sum(job_skills_importance.values())
            matched_importance = sum(match["importance"] * match["similarity"] 
                                    for match in matched_skills)
            
            if total_importance > 0:
                overall_match_score = matched_importance / total_importance
            else:
                overall_match_score = 0.0
        else:
            overall_match_score = 0.0
        
        # Calculer le score d'écart de compétences (inversement proportionnel au score de correspondance)
        skill_gap_score = 1.0 - overall_match_score
        
        # Générer des recommandations de formation
        training_recommendations = self._generate_training_recommendations(missing_skills)
        
        # Préparer le résultat
        result = {
            "candidate_id": candidate_id,
            "job_id": job_id,
            "timestamp": datetime.now().isoformat(),
            "overall_match_score": round(overall_match_score * 100, 2),
            "skill_gap_score": round(skill_gap_score * 100, 2),
            "candidate_skills_count": len(candidate_skills),
            "job_skills_count": len(job_skills),
            "matched_skills_count": len(matched_skills),
            "missing_skills_count": len(missing_skills),
            "additional_skills_count": len(additional_skills),
            "critical_skills_count": len(critical_skills),
            "missing_critical_skills_count": sum(1 for skill in missing_skills if skill["is_critical"]),
            "matched_skills": sorted(matched_skills, key=lambda x: x["importance"], reverse=True),
            "missing_skills": sorted(missing_skills, key=lambda x: x["importance"], reverse=True),
            "additional_skills": sorted(additional_skills, key=lambda x: x["relevance"], reverse=True),
            "critical_skills": critical_skills,
            "training_recommendations": training_recommendations,
            "skill_gap_by_domain": self._calculate_skill_gap_by_domain(matched_skills, missing_skills, job_skills)
        }
        
        logger.info(f"Analyse des écarts de compétences terminée avec un score de correspondance de {overall_match_score:.2f}")
        
        return result
    
    def _calculate_skill_gap_by_domain(self, 
                                      matched_skills: List[Dict[str, Any]], 
                                      missing_skills: List[Dict[str, Any]],
                                      job_skills: List[str]) -> Dict[str, Dict[str, float]]:
        """
        Calcule l'écart de compétences par domaine.
        """
        domains = {}
        
        # Initialiser les domaines avec des compteurs à zéro
        for domain in self.skills_taxonomy.keys():
            domains[domain] = {
                "required": 0,
                "matched": 0,
                "match_score": 0.0,
                "gap_score": 0.0
            }
        
        # Compter les compétences requises par domaine
        for skill in job_skills:
            for domain, skills in self.skills_taxonomy.items():
                if skill in skills:
                    domains[domain]["required"] += 1
                    break
        
        # Compter les compétences correspondantes par domaine
        for match in matched_skills:
            job_skill = match["job_skill"]
            for domain, skills in self.skills_taxonomy.items():
                if job_skill in skills:
                    domains[domain]["matched"] += 1
                    break
        
        # Calculer les scores par domaine
        for domain, counts in domains.items():
            if counts["required"] > 0:
                counts["match_score"] = round((counts["matched"] / counts["required"]) * 100, 2)
                counts["gap_score"] = round(100 - counts["match_score"], 2)
            else:
                counts["match_score"] = 0.0
                counts["gap_score"] = 0.0
        
        return domains
    
    def _generate_training_recommendations(self, missing_skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Génère des recommandations de formation pour combler les écarts de compétences.
        """
        recommendations = []
        
        # Simuler des recommandations de formation pour les compétences manquantes
        training_resources = {
            "Python": {
                "courses": ["Python for Data Science and Machine Learning Bootcamp", "Complete Python Bootcamp"],
                "platforms": ["Coursera", "Udemy", "DataCamp"],
                "estimated_time": "4-8 weeks"
            },
            "JavaScript": {
                "courses": ["Modern JavaScript From The Beginning", "JavaScript: Understanding the Weird Parts"],
                "platforms": ["Udemy", "Frontend Masters", "freeCodeCamp"],
                "estimated_time": "6-10 weeks"
            },
            "Machine Learning": {
                "courses": ["Machine Learning by Andrew Ng", "Machine Learning A-Z"],
                "platforms": ["Coursera", "Udemy", "edX"],
                "estimated_time": "10-16 weeks"
            },
            "AWS": {
                "courses": ["AWS Certified Solutions Architect", "AWS Certified Developer"],
                "platforms": ["A Cloud Guru", "AWS Training", "Pluralsight"],
                "estimated_time": "8-12 weeks"
            },
            "Leadership": {
                "courses": ["Leadership Development Program", "People Management Skills"],
                "platforms": ["LinkedIn Learning", "Coursera", "edX"],
                "estimated_time": "4-8 weeks"
            },
            "Data Analysis": {
                "courses": ["Data Analysis with Python", "SQL for Data Analysis"],
                "platforms": ["Coursera", "DataCamp", "Udacity"],
                "estimated_time": "6-10 weeks"
            }
        }
        
        # Générer des recommandations pour chaque compétence manquante
        for skill_info in missing_skills:
            skill = skill_info["skill"]
            
            # Vérifier si nous avons des recommandations spécifiques pour cette compétence
            if skill in training_resources:
                recommendation = {
                    "skill": skill,
                    "importance": skill_info["importance"],
                    "is_critical": skill_info["is_critical"],
                    "resources": training_resources[skill]
                }
            else:
                # Recommandation générique
                recommendation = {
                    "skill": skill,
                    "importance": skill_info["importance"],
                    "is_critical": skill_info["is_critical"],
                    "resources": {
                        "suggestion": f"Rechercher des cours sur {skill} sur des plateformes comme Coursera, Udemy, ou LinkedIn Learning",
                        "estimated_time": "4-12 weeks"
                    }
                }
            
            recommendations.append(recommendation)
        
        # Trier les recommandations par importance et criticité
        return sorted(recommendations, 
                     key=lambda x: (x["is_critical"], x["importance"]), 
                     reverse=True)
    
    def compare_candidates_for_job(self, 
                                  candidate_resumes: Dict[str, str], 
                                  job_description: str) -> Dict[str, Any]:
        """
        Compare plusieurs candidats pour un poste donné en fonction de leurs écarts de compétences.
        
        Args:
            candidate_resumes: Dictionnaire avec les IDs des candidats comme clés et leurs CV comme valeurs
            job_description: La description du poste
            
        Returns:
            Un dictionnaire contenant l'analyse comparative des candidats
        """
        logger.info(f"Comparaison de {len(candidate_resumes)} candidats pour un poste")
        
        # Analyser chaque candidat
        candidate_analyses = {}
        for candidate_id, resume in candidate_resumes.items():
            candidate_analyses[candidate_id] = self.analyze_skill_gap(
                candidate_resume=resume,
                job_description=job_description,
                candidate_id=candidate_id
            )
        
        # Trier les candidats par score de correspondance
        ranked_candidates = sorted(
            [
                {
                    "candidate_id": candidate_id,
                    "match_score": analysis["overall_match_score"],
                    "skill_gap_score": analysis["skill_gap_score"],
                    "missing_critical_skills_count": analysis["missing_critical_skills_count"],
                    "missing_skills_count": analysis["missing_skills_count"],
                    "additional_skills_count": analysis["additional_skills_count"]
                }
                for candidate_id, analysis in candidate_analyses.items()
            ],
            key=lambda x: (x["match_score"], -x["missing_critical_skills_count"]),
            reverse=True
        )
        
        # Extraire les compétences du poste
        job_skills = self._extract_skills_from_text(job_description)
        
        # Calculer l'importance de chaque compétence pour le poste
        job_skills_importance = {skill: self._calculate_skill_importance(skill, job_description) 
                                for skill in job_skills}
        
        # Identifier les compétences critiques
        critical_skills = [skill for skill, importance in job_skills_importance.items() 
                          if importance >= self.critical_skill_threshold]
        
        # Préparer le résultat
        result = {
            "job_skills": job_skills,
            "critical_skills": critical_skills,
            "candidate_count": len(candidate_resumes),
            "ranked_candidates": ranked_candidates,
            "detailed_analyses": candidate_analyses,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Comparaison des candidats terminée. Meilleur candidat: {ranked_candidates[0]['candidate_id'] if ranked_candidates else 'Aucun'}")
        
        return result
    
    def generate_skill_development_plan(self, 
                                       candidate_resume: str, 
                                       job_description: str,
                                       timeframe_weeks: int = 12) -> Dict[str, Any]:
        """
        Génère un plan de développement des compétences pour un candidat afin de combler
        les écarts avec un poste spécifique.
        
        Args:
            candidate_resume: Le CV du candidat
            job_description: La description du poste
            timeframe_weeks: Le nombre de semaines disponibles pour le développement
            
        Returns:
            Un plan de développement des compétences
        """
        logger.info(f"Génération d'un plan de développement des compétences sur {timeframe_weeks} semaines")
        
        # Analyser l'écart de compétences
        gap_analysis = self.analyze_skill_gap(candidate_resume, job_description)
        
        # Extraire les compétences manquantes
        missing_skills = gap_analysis["missing_skills"]
        
        # Estimer le temps nécessaire pour acquérir chaque compétence (en semaines)
        skill_learning_times = {
            # Programmation
            "Python": 6,
            "JavaScript": 8,
            "Java": 10,
            "C++": 12,
            "C#": 8,
            "Ruby": 6,
            "PHP": 6,
            "Swift": 8,
            "Kotlin": 8,
            "TypeScript": 4,
            "Go": 6,
            "Rust": 10,
            "Scala": 8,
            "R": 6,
            "SQL": 4,
            "NoSQL": 4,
            "HTML": 2,
            "CSS": 4,
            
            # Data Science
            "Machine Learning": 12,
            "Deep Learning": 10,
            "NLP": 8,
            "Computer Vision": 10,
            "Data Mining": 8,
            "Statistical Analysis": 6,
            "Data Visualization": 4,
            "Big Data": 8,
            "TensorFlow": 6,
            "PyTorch": 6,
            "Keras": 4,
            "scikit-learn": 4,
            "pandas": 3,
            "NumPy": 3,
            
            # Cloud
            "AWS": 8,
            "Azure": 8,
            "Google Cloud": 8,
            "Docker": 4,
            "Kubernetes": 6,
            "Serverless": 4,
            "Microservices": 6,
            "DevOps": 10,
            "CI/CD": 6,
            
            # Soft Skills
            "Communication": 6,
            "Leadership": 10,
            "Teamwork": 4,
            "Problem Solving": 8,
            "Critical Thinking": 8,
            "Time Management": 4,
            "Adaptability": 6,
            "Creativity": 8,
            "Emotional Intelligence": 10,
            
            # Business
            "Marketing": 8,
            "Sales": 8,
            "Finance": 10,
            "Accounting": 12,
            "HR": 8,
            "Operations": 10,
            "Strategy": 12,
            "Business Development": 10,
            "Product Management": 10,
            "UX/UI Design": 8
        }
        
        # Valeur par défaut pour les compétences non listées
        default_learning_time = 6
        
        # Calculer le temps total nécessaire et prioriser les compétences
        total_learning_time = 0
        prioritized_skills = []
        
        for skill_info in missing_skills:
            skill = skill_info["skill"]
            importance = skill_info["importance"]
            is_critical = skill_info["is_critical"]
            
            # Estimer le temps d'apprentissage
            learning_time = skill_learning_times.get(skill, default_learning_time)
            
            # Ajuster en fonction de l'importance
            adjusted_learning_time = learning_time * (0.8 + (importance * 0.4))
            
            prioritized_skills.append({
                "skill": skill,
                "importance": importance,
                "is_critical": is_critical,
                "learning_time_weeks": adjusted_learning_time,
                "priority_score": importance * (1.5 if is_critical else 1.0)
            })
            
            total_learning_time += adjusted_learning_time
        
        # Trier par score de priorité
        prioritized_skills = sorted(prioritized_skills, key=lambda x: x["priority_score"], reverse=True)
        
        # Créer un plan réalisable dans le délai imparti
        development_plan = []
        remaining_time = timeframe_weeks
        skills_to_develop = []
        
        for skill_info in prioritized_skills:
            if remaining_time >= skill_info["learning_time_weeks"]:
                skills_to_develop.append(skill_info)
                remaining_time -= skill_info["learning_time_weeks"]
            elif remaining_time > 0 and skill_info["is_critical"]:
                # Pour les compétences critiques, inclure même une formation partielle
                partial_skill = skill_info.copy()
                partial_skill["learning_time_weeks"] = remaining_time
                partial_skill["is_partial"] = True
                skills_to_develop.append(partial_skill)
                remaining_time = 0
            
        # Organiser le plan par semaines
        current_week = 1
        for skill_info in skills_to_develop:
            skill = skill_info["skill"]
            learning_time = skill_info["learning_time_weeks"]
            is_partial = skill_info.get("is_partial", False)
            
            development_plan.append({
                "skill": skill,
                "start_week": current_week,
                "end_week": current_week + learning_time - 1,
                "duration_weeks": learning_time,
                "is_critical": skill_info["is_critical"],
                "is_partial_training": is_partial,
                "resources": self._get_training_resources_for_skill(skill)
            })
            
            current_week += learning_time
        
        # Préparer le résultat
        result = {
            "total_missing_skills": len(missing_skills),
            "total_learning_time_required": total_learning_time,
            "timeframe_available": timeframe_weeks,
            "skills_covered": len(skills_to_develop),
            "skills_not_covered": len(missing_skills) - len(skills_to_develop),
            "development_plan": development_plan,
            "skill_gap_score_before": gap_analysis["skill_gap_score"],
            "estimated_skill_gap_score_after": self._estimate_skill_gap_after_training(gap_analysis, skills_to_develop),
            "critical_skills_covered": sum(1 for skill in skills_to_develop if skill["is_critical"]),
            "critical_skills_not_covered": sum(1 for skill in missing_skills if skill["is_critical"]) - 
                                          sum(1 for skill in skills_to_develop if skill["is_critical"]),
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Plan de développement généré avec {len(skills_to_develop)} compétences sur {timeframe_weeks} semaines")
        
        return result
    
    def _get_training_resources_for_skill(self, skill: str) -> Dict[str, Any]:
        """
        Retourne des ressources de formation pour une compétence donnée.
        """
        # Dictionnaire simulé de ressources de formation
        training_resources = {
            "Python": {
                "courses": ["Python for Data Science and Machine Learning Bootcamp", "Complete Python Bootcamp"],
                "platforms": ["Coursera", "Udemy", "DataCamp"],
                "books": ["Python Crash Course", "Automate the Boring Stuff with Python"],
                "projects": ["Build a personal portfolio website", "Create a data analysis tool"]
            },
            "JavaScript": {
                "courses": ["Modern JavaScript From The Beginning", "JavaScript: Understanding the Weird Parts"],
                "platforms": ["Udemy", "Frontend Masters", "freeCodeCamp"],
                "books": ["Eloquent JavaScript", "You Don't Know JS"],
                "projects": ["Build an interactive web application", "Create a browser game"]
            },
            "Machine Learning": {
                "courses": ["Machine Learning by Andrew Ng", "Machine Learning A-Z"],
                "platforms": ["Coursera", "Udemy", "edX"],
                "books": ["Hands-On Machine Learning with Scikit-Learn and TensorFlow", "Pattern Recognition and Machine Learning"],
                "projects": ["Build a recommendation system", "Create a predictive model for a real dataset"]
            },
            "AWS": {
                "courses": ["AWS Certified Solutions Architect", "AWS Certified Developer"],
                "platforms": ["A Cloud Guru", "AWS Training", "Pluralsight"],
                "books": ["AWS Certified Solutions Architect Study Guide", "Amazon Web Services in Action"],
                "projects": ["Deploy a scalable web application", "Build a serverless API"]
            },
            "Leadership": {
                "courses": ["Leadership Development Program", "People Management Skills"],
                "platforms": ["LinkedIn Learning", "Coursera", "edX"],
                "books": ["Leaders Eat Last", "The 7 Habits of Highly Effective People"],
                "projects": ["Lead a team project", "Mentor junior colleagues"]
            }
        }
        
        # Retourner les ressources spécifiques ou des ressources génériques
        if skill in training_resources:
            return training_resources[skill]
        else:
            return {
                "suggestion": f"Rechercher des cours sur {skill} sur des plateformes comme Coursera, Udemy, ou LinkedIn Learning",
                "general_platforms": ["Coursera", "Udemy", "LinkedIn Learning", "edX", "Pluralsight"],
                "approach": "Commencer par des cours d'introduction, puis passer à des projets pratiques pour consolider les connaissances"
            }
    
    def _estimate_skill_gap_after_training(self, 
                                          gap_analysis: Dict[str, Any], 
                                          skills_to_develop: List[Dict[str, Any]]) -> float:
        """
        Estime le score d'écart de compétences après la formation.
        """
        # Récupérer le score d'écart actuel
        current_gap_score = gap_analysis["skill_gap_score"]
        
        # Calculer la contribution de chaque compétence manquante au score d'écart
        missing_skills = gap_analysis["missing_skills"]
        total_importance = sum(skill["importance"] for skill in missing_skills)
        
        if total_importance == 0:
            return current_gap_score
        
        # Calculer l'importance des compétences qui seront développées
        developed_importance = sum(
            next(
                (skill["importance"] for skill in missing_skills if skill["skill"] == dev_skill["skill"]),
                0
            )
            for dev_skill in skills_to_develop
        )
        
        # Estimer le nouveau score d'écart
        if developed_importance >= total_importance:
            # Toutes les compétences manquantes seront développées
            return 0.0
        else:
            # Réduction proportionnelle du score d'écart
            reduction_factor = developed_importance / total_importance
            new_gap_score = current_gap_score * (1 - reduction_factor)
            return round(new_gap_score, 2)
