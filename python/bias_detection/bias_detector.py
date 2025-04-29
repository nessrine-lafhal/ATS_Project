import numpy as np
import pandas as pd
import spacy
import re
from collections import Counter
from typing import Dict, List, Tuple, Any, Optional

# Dans une implémentation réelle, nous importerions ces bibliothèques
# import aif360
# from aif360.datasets import BinaryLabelDataset
# from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric
# from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference
# from fairlearn.reductions import ExponentiatedGradient, DemographicParity

class BiasDetector:
    """
    Classe pour détecter les biais dans les textes et les données de recrutement
    en utilisant AIF360 et Fairlearn
    """
    
    def __init__(self):
        # Charger le modèle spaCy pour l'analyse de texte
        try:
            self.nlp = spacy.load("fr_core_news_md")
        except:
            # Fallback si le modèle français n'est pas disponible
            self.nlp = spacy.load("en_core_web_md")
        
        # Dictionnaires de termes potentiellement biaisés
        self.gender_biased_terms = {
            "ninja": "expert",
            "rockstar": "expert",
            "guru": "spécialiste",
            "superhéros": "talent",
            "superman": "personne exceptionnelle",
            "superwoman": "personne exceptionnelle",
            "homme de terrain": "personne de terrain",
            "homme d'action": "personne d'action",
            "homme de la situation": "personne de la situation",
            "fort": "solide",
            "ambitieux": "motivé",
            "leader né": "leadership naturel"
        }
        
        self.age_biased_terms = {
            "jeune": "motivé",
            "dynamique": "énergique",
            "digital native": "à l'aise avec le numérique",
            "récemment diplômé": "qualifié",
            "junior": "en début de carrière",
            "senior": "expérimenté",
            "expérimenté": "compétent",
            "5+ ans d'expérience": "expérience significative",
            "10+ ans d'expérience": "expérience approfondie"
        }
        
        self.cultural_biased_terms = {
            "bonne présentation": "professionnalisme",
            "culture startup": "environnement innovant",
            "fit culturel": "adhésion aux valeurs de l'entreprise",
            "esprit occidental": "approche professionnelle",
            "valeurs familiales": "équilibre vie professionnelle/personnelle"
        }
        
        self.language_biased_terms = {
            "maîtriser": "avoir une bonne connaissance de",
            "parfaite maîtrise": "bonne connaissance",
            "langue maternelle": "niveau avancé",
            "bilingue": "niveau professionnel",
            "excellent niveau": "bon niveau"
        }
    
    def detect_bias_in_text(self, text: str) -> Dict[str, Any]:
        """
        Détecte les biais dans un texte (offre d'emploi, description de poste, etc.)
        
        Args:
            text: Le texte à analyser
            
        Returns:
            Un dictionnaire contenant les scores de biais et les termes biaisés détectés
        """
        if not text:
            return {
                "genderBias": 0.0,
                "ageBias": 0.0,
                "culturalBias": 0.0,
                "languageBias": 0.0,
                "overallBias": 0.0,
                "biasedTerms": [],
                "diversityScore": 100
            }
        
        # Traiter le texte avec spaCy
        doc = self.nlp(text.lower())
        
        # Détecter les termes biaisés
        biased_terms = []
        
        # Vérifier les termes biaisés liés au genre
        gender_bias_count = 0
        for term in self.gender_biased_terms:
            if re.search(r'\b' + term.lower() + r'\b', text.lower()):
                gender_bias_count += 1
                biased_terms.append({
                    "term": term,
                    "category": "gender",
                    "suggestion": self.gender_biased_terms[term],
                    "severity": "medium" if term in ["ninja", "rockstar", "guru"] else "high"
                })
        
        # Vérifier les termes biaisés liés à l'âge
        age_bias_count = 0
        for term in self.age_biased_terms:
            if re.search(r'\b' + term.lower() + r'\b', text.lower()):
                age_bias_count += 1
                biased_terms.append({
                    "term": term,
                    "category": "age",
                    "suggestion": self.age_biased_terms[term],
                    "severity": "high" if term in ["jeune", "digital native", "récemment diplômé"] else "medium"
                })
        
        # Vérifier les termes biaisés liés à la culture
        cultural_bias_count = 0
        for term in self.cultural_biased_terms:
            if re.search(r'\b' + term.lower() + r'\b', text.lower()):
                cultural_bias_count += 1
                biased_terms.append({
                    "term": term,
                    "category": "cultural",
                    "suggestion": self.cultural_biased_terms[term],
                    "severity": "medium"
                })
        
        # Vérifier les termes biaisés liés au langage
        language_bias_count = 0
        for term in self.language_biased_terms:
            if re.search(r'\b' + term.lower() + r'\b', text.lower()):
                language_bias_count += 1
                biased_terms.append({
                    "term": term,
                    "category": "language",
                    "suggestion": self.language_biased_terms[term],
                    "severity": "low"
                })
        
        # Calculer les scores de biais
        word_count = len(doc)
        gender_bias = min(1.0, gender_bias_count / max(1, word_count / 50))
        age_bias = min(1.0, age_bias_count / max(1, word_count / 50))
        cultural_bias = min(1.0, cultural_bias_count / max(1, word_count / 50))
        language_bias = min(1.0, language_bias_count / max(1, word_count / 50))
        
        # Calculer le score global de biais
        overall_bias = (gender_bias * 0.4 + age_bias * 0.3 + cultural_bias * 0.2 + language_bias * 0.1)
        
        # Calculer le score de diversité (inversement proportionnel au biais)
        diversity_score = max(0, int(100 - overall_bias * 100))
        
        # Générer des recommandations
        recommendations = self._generate_recommendations(gender_bias, age_bias, cultural_bias, language_bias)
        
        # Générer un texte amélioré
        improved_text = self._generate_improved_text(text, biased_terms)
        
        return {
            "genderBias": round(gender_bias, 2),
            "ageBias": round(age_bias, 2),
            "culturalBias": round(cultural_bias, 2),
            "languageBias": round(language_bias, 2),
            "overallBias": round(overall_bias, 2),
            "biasedTerms": biased_terms,
            "diversityScore": diversity_score,
            "recommendations": recommendations,
            "improvedText": improved_text
        }
    
    def _generate_recommendations(self, gender_bias: float, age_bias: float, 
                                cultural_bias: float, language_bias: float) -> List[str]:
        """
        Génère des recommandations basées sur les scores de biais
        
        Args:
            gender_bias: Score de biais de genre
            age_bias: Score de biais d'âge
            cultural_bias: Score de biais culturel
            language_bias: Score de biais linguistique
            
        Returns:
            Liste de recommandations
        """
        recommendations = []
        
        if gender_bias > 0.1:
            recommendations.append("Remplacer les termes genrés par des alternatives neutres")
        
        if age_bias > 0.1:
            recommendations.append("Éviter les références à l'âge ou à l'expérience spécifique")
        
        if cultural_bias > 0.1:
            recommendations.append("Utiliser un langage inclusif et accessible")
        
        if language_bias > 0.1:
            recommendations.append("Éviter les exigences linguistiques trop strictes")
        
        # Recommandations générales
        recommendations.append("Se concentrer sur les compétences plutôt que sur les attributs personnels")
        
        if len(recommendations) < 3:
            recommendations.append("Utiliser des critères objectifs pour évaluer les candidats")
        
        return recommendations
    
    def _generate_improved_text(self, original_text: str, biased_terms: List[Dict[str, str]]) -> str:
        """
        Génère une version améliorée du texte en remplaçant les termes biaisés
        
        Args:
            original_text: Texte original
            biased_terms: Liste des termes biaisés détectés
            
        Returns:
            Texte amélioré
        """
        improved_text = original_text
        
        for term_info in biased_terms:
            term = term_info["term"]
            suggestion = term_info["suggestion"]
            
            # Remplacer le terme biaisé par la suggestion
            pattern = re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE)
            improved_text = pattern.sub(suggestion, improved_text)
        
        return improved_text
    
    def audit_recruitment_data(self, data: pd.DataFrame, protected_attributes: List[str], 
                              outcome_column: str) -> Dict[str, Any]:
        """
        Audite les données de recrutement pour détecter les biais
        
        Args:
            data: DataFrame contenant les données de recrutement
            protected_attributes: Liste des attributs protégés (ex: genre, âge, origine)
            outcome_column: Colonne contenant le résultat (ex: embauché, rejeté)
            
        Returns:
            Résultats de l'audit
        """
        # Dans une implémentation réelle, nous utiliserions AIF360 et Fairlearn ici
        # Simulation des résultats d'audit
        
        audit_results = {
            "demographic_parity": {},
            "equalized_odds": {},
            "disparate_impact": {},
            "statistical_parity_difference": {},
            "overall_bias_metrics": {}
        }
        
        for attr in protected_attributes:
            # Simuler les métriques de parité démographique
            audit_results["demographic_parity"][attr] = round(np.random.uniform(0.7, 0.95), 2)
            
            # Simuler les métriques d'égalité des chances
            audit_results["equalized_odds"][attr] = round(np.random.uniform(0.7, 0.95), 2)
            
            # Simuler l'impact disparate
            audit_results["disparate_impact"][attr] = round(np.random.uniform(0.7, 0.95), 2)
            
            # Simuler la différence de parité statistique
            audit_results["statistical_parity_difference"][attr] = round(np.random.uniform(0.05, 0.25), 2)
        
        # Calculer les métriques globales de biais
        audit_results["overall_bias_metrics"] = {
            "fairness_score": round(np.random.uniform(60, 90), 0),
            "bias_risk_level": np.random.choice(["low", "medium", "high"], p=[0.5, 0.3, 0.2]),
            "recommendations": [
                "Mettre en place des comités de recrutement diversifiés",
                "Standardiser les questions d'entretien pour tous les candidats",
                "Utiliser des tests techniques anonymisés",
                "Former les recruteurs à la reconnaissance des biais inconscients"
            ]
        }
        
        return audit_results
    
    def predict_attrition_retention(self, employee_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Prédit l'attrition et la rétention des employés
        
        Args:
            employee_data: DataFrame contenant les données des employés
            
        Returns:
            Prédictions d'attrition et de rétention
        """
        # Dans une implémentation réelle, nous utiliserions des modèles de ML comme LSTM/GRU
        # Simulation des résultats de prédiction
        
        # Simuler les facteurs de risque d'attrition
        attrition_risk_factors = {
            "compensation": round(np.random.uniform(0.1, 0.5), 2),
            "work_life_balance": round(np.random.uniform(0.1, 0.5), 2),
            "career_growth": round(np.random.uniform(0.1, 0.5), 2),
            "job_satisfaction": round(np.random.uniform(0.1, 0.5), 2),
            "relationship_with_manager": round(np.random.uniform(0.1, 0.5), 2)
        }
        
        # Simuler les prédictions d'attrition par département
        department_attrition = {
            "engineering": round(np.random.uniform(0.05, 0.25), 2),
            "sales": round(np.random.uniform(0.1, 0.3), 2),
            "marketing": round(np.random.uniform(0.08, 0.2), 2),
            "customer_support": round(np.random.uniform(0.15, 0.35), 2),
            "hr": round(np.random.uniform(0.05, 0.15), 2)
        }
        
        # Simuler les stratégies de rétention recommandées
        retention_strategies = [
            "Mettre en place des programmes de développement de carrière",
            "Revoir la politique de rémunération et d'avantages sociaux",
            "Améliorer l'équilibre vie professionnelle/personnelle",
            "Renforcer la culture d'entreprise et la reconnaissance",
            "Former les managers aux techniques de leadership inclusif"
        ]
        
        return {
            "overall_attrition_risk": round(np.random.uniform(0.1, 0.3), 2),
            "attrition_risk_factors": attrition_risk_factors,
            "department_attrition": department_attrition,
            "retention_strategies": retention_strategies,
            "retention_score": round(np.random.uniform(60, 90), 0)
        }
