from flask import Flask, request, jsonify
import os
import json
from semantic_matcher import SemanticMatcher

app = Flask(__name__)
semantic_matcher = SemanticMatcher()

@app.route('/match', methods=['POST'])
def match_resume_to_job():
    """
    Endpoint pour calculer le score de correspondance entre un CV et une offre d'emploi
    Attend un JSON avec les champs:
    - cv_text: le texte du CV
    - job_description: la description du poste
    """
    data = request.json
    
    if not data or 'cv_text' not in data or 'job_description' not in data:
        return jsonify({"success": False, "error": "Le texte du CV et la description du poste sont requis"}), 400
    
    cv_text = data['cv_text']
    job_description = data['job_description']
    
    try:
        # Analyser le CV (version simplifiée pour l'exemple)
        cv_analysis = {
            "skills": extract_skills(cv_text),
            "experience": extract_experience(cv_text),
            "embedding": None  # Dans une implémentation réelle, nous créerions un embedding ici
        }
        
        # Calculer le score de correspondance
        match_score = semantic_matcher.match_resume_to_job(cv_analysis, job_description)
        
        # Calculer les scores détaillés
        skills_match = semantic_matcher._calculate_skills_match(cv_analysis["skills"], 
                                                              semantic_matcher._extract_skills_from_job(job_description))
        semantic_similarity = semantic_matcher._calculate_semantic_similarity(cv_analysis.get("embedding"), job_description)
        experience_match = semantic_matcher._calculate_experience_match(cv_analysis["experience"], job_description)
        
        # Préparer la réponse
        response = {
            "success": True,
            "data": {
                "matchScore": match_score,
                "skillsMatch": skills_match,
                "semanticSimilarity": semantic_similarity,
                "experienceMatch": experience_match
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def extract_skills(text):
    """
    Fonction simplifiée pour extraire les compétences d'un texte
    """
    # Liste de compétences techniques courantes
    tech_skills = [
        "python", "java", "c++", "javascript", "html", "css", "sql", "php", 
        "docker", "kubernetes", "aws", "azure", "gcp", "linux", "git", "agile", 
        "scrum", "machine learning", "deep learning", "data analysis", "nlp", 
        "react", "angular", "vue", "node.js", "django", "flask", "spring",
        "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy"
    ]
    
    # Extraire les compétences qui apparaissent dans le texte
    text_lower = text.lower()
    skills = [skill for skill in tech_skills if skill in text_lower]
    
    return skills

def extract_experience(text):
    """
    Fonction simplifiée pour extraire l'expérience d'un texte
    """
    # Dans une implémentation réelle, nous utiliserions des expressions régulières
    # et des techniques de NLP pour extraire l'expérience
    return []

if __name__ == '__main__':
    # Démarrer le serveur
    app.run(host='0.0.0.0', port=5002, debug=True)
