import os
import json
import sys
from typing import Dict, Any, List, Optional

# Importer le parser de CV
# Note: Dans un environnement réel, vous devriez installer les dépendances requises
# pip install spacy transformers torch pandas numpy scikit-learn
# python -m spacy download fr_core_news_lg

try:
    import spacy
    from transformers import AutoTokenizer, AutoModel
    import torch
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    DEPENDENCIES_INSTALLED = True
except ImportError:
    DEPENDENCIES_INSTALLED = False
    print("Les dépendances requises ne sont pas installées. Mode de simulation activé.")

class CVParserService:
    def __init__(self):
        self.parser = None
        if DEPENDENCIES_INSTALLED:
            try:
                from cv_parser import CVParser
                self.parser = CVParser()
                print("Parser de CV initialisé avec succès.")
            except Exception as e:
                print(f"Erreur lors de l'initialisation du parser de CV: {e}")
                self.parser = None
        
        # Créer le répertoire pour stocker les résultats d'analyse
        os.makedirs("data/cv_analysis", exist_ok=True)
    
    def parse_cv(self, cv_text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyse un CV et retourne les informations structurées
        """
        if self.parser is not None:
            try:
                # Utiliser le parser réel
                result = self.parser.parse(cv_text)
                
                # Calculer la similarité avec l'offre d'emploi si fournie
                if job_description:
                    similarity = self.parser.match_cv_with_job(cv_text, job_description)
                    result["match_score"] = float(similarity)
                
                # Convertir les embeddings numpy en liste pour la sérialisation JSON
                if "embedding" in result:
                    result["embedding"] = result["embedding"].tolist()
                
                return result
            except Exception as e:
                print(f"Erreur lors de l'analyse du CV: {e}")
                return self._simulate_cv_parsing(cv_text, job_description)
        else:
            # Mode de simulation
            return self._simulate_cv_parsing(cv_text, job_description)
    
    def _simulate_cv_parsing(self, cv_text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
        """
        Simule l'analyse d'un CV lorsque les dépendances ne sont pas disponibles
        """
        print("Simulation de l'analyse de CV...")
        
        # Extraire quelques informations basiques avec des expressions régulières simples
        import re
        
        # Simuler l'extraction du nom (première ligne non vide)
        lines = [line.strip() for line in cv_text.split('\n') if line.strip()]
        name = lines[0] if lines else "Candidat Inconnu"
        
        # Simuler l'extraction de l'email
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', cv_text)
        email = email_match.group(0) if email_match else None
        
        # Simuler l'extraction du téléphone
        phone_match = re.search(r'(?:\+\d{1,3}[-.\s]?)?(?:\d{1,4}[-.\s]?){1,5}\d{1,4}', cv_text)
        phone = phone_match.group(0) if phone_match else None
        
        # Simuler l'extraction des compétences
        common_skills = [
            "Python", "JavaScript", "Java", "C++", "React", "Angular", "Vue", 
            "Node.js", "Express", "Django", "Flask", "TensorFlow", "PyTorch", 
            "SQL", "MongoDB", "AWS", "Azure", "Docker", "Kubernetes"
        ]
        
        # Extraire les compétences qui apparaissent dans le texte
        skills = [skill for skill in common_skills if skill.lower() in cv_text.lower()]
        
        # Si aucune compétence n'est trouvée, en générer quelques-unes aléatoirement
        if not skills:
            import random
            skills = random.sample(common_skills, min(5, len(common_skills)))
        
        # Simuler un score de correspondance avec l'offre d'emploi
        match_score = None
        if job_description:
            # Calculer un score basé sur le nombre de compétences communes
            job_skills = [skill for skill in common_skills if skill.lower() in job_description.lower()]
            common_skills_count = len(set(skills).intersection(set(job_skills)))
            match_score = 0.5 + (common_skills_count / max(len(job_skills), 1)) * 0.5
        
        # Créer le résultat simulé
        result = {
            "structured_info": {
                "name": name,
                "email": email,
                "phone": phone,
                "skills": skills,
                "education": [],
                "experience": []
            },
            "sections": {
                "SKILLS": skills,
                "EXPERIENCE": [],
                "EDUCATION": [],
                "LANGUAGE": []
            }
        }
        
        if match_score is not None:
            result["match_score"] = match_score
        
        return result
    
    def save_analysis(self, cv_id: str, analysis_result: Dict[str, Any]) -> None:
        """
        Sauvegarde le résultat d'analyse dans un fichier JSON
        """
        file_path = f"data/cv_analysis/{cv_id}.json"
        
        # Supprimer les embeddings pour économiser de l'espace
        if "embedding" in analysis_result:
            del analysis_result["embedding"]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_result, f, ensure_ascii=False, indent=2)
    
    def get_analysis(self, cv_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère le résultat d'analyse d'un CV
        """
        file_path = f"data/cv_analysis/{cv_id}.json"
        
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        return None

# Singleton pour le service
_cv_parser_service = None

def get_cv_parser_service():
    global _cv_parser_service
    if _cv_parser_service is None:
        _cv_parser_service = CVParserService()
    return _cv_parser_service

# Point d'entrée pour l'exécution en ligne de commande
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cv_parser_service.py <cv_text_file> [job_description_file]")
        sys.exit(1)
    
    # Lire le texte du CV
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        cv_text = f.read()
    
    # Lire la description du poste si fournie
    job_description = None
    if len(sys.argv) > 2:
        with open(sys.argv[2], 'r', encoding='utf-8') as f:
            job_description = f.read()
    
    # Analyser le CV
    service = get_cv_parser_service()
    result = service.parse_cv(cv_text, job_description)
    
    # Afficher le résultat
    print(json.dumps(result, ensure_ascii=False, indent=2))
