from flask import Flask, request, jsonify
import logging
import json
import traceback
from skill_gap_analyzer import SkillGapAnalyzer

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialisation de l'application Flask
app = Flask(__name__)

# Initialisation de l'analyseur d'écarts de compétences
skill_gap_analyzer = SkillGapAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """
    Point de terminaison pour vérifier l'état du serveur.
    """
    return jsonify({"status": "healthy", "service": "skill-gap-analyzer"})

@app.route('/analyze', methods=['POST'])
def analyze_skill_gap():
    """
    Point de terminaison pour analyser l'écart de compétences entre un candidat et un poste.
    """
    try:
        data = request.json
        
        # Vérifier les données requises
        if not data or 'candidate_resume' not in data or 'job_description' not in data:
            return jsonify({
                "error": "Les données requises sont manquantes. Veuillez fournir 'candidate_resume' et 'job_description'."
            }), 400
        
        # Extraire les données
        candidate_resume = data['candidate_resume']
        job_description = data['job_description']
        candidate_id = data.get('candidate_id')
        job_id = data.get('job_id')
        
        # Analyser l'écart de compétences
        result = skill_gap_analyzer.analyze_skill_gap(
            candidate_resume=candidate_resume,
            job_description=job_description,
            candidate_id=candidate_id,
            job_id=job_id
        )
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse de l'écart de compétences: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Une erreur s'est produite lors de l'analyse: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500

@app.route('/compare', methods=['POST'])
def compare_candidates():
    """
    Point de terminaison pour comparer plusieurs candidats pour un poste.
    """
    try:
        data = request.json
        
        # Vérifier les données requises
        if not data or 'candidate_resumes' not in data or 'job_description' not in data:
            return jsonify({
                "error": "Les données requises sont manquantes. Veuillez fournir 'candidate_resumes' et 'job_description'."
            }), 400
        
        # Extraire les données
        candidate_resumes = data['candidate_resumes']
        job_description = data['job_description']
        
        # Comparer les candidats
        result = skill_gap_analyzer.compare_candidates_for_job(
            candidate_resumes=candidate_resumes,
            job_description=job_description
        )
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Erreur lors de la comparaison des candidats: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Une erreur s'est produite lors de la comparaison: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500

@app.route('/development-plan', methods=['POST'])
def generate_development_plan():
    """
    Point de terminaison pour générer un plan de développement des compétences.
    """
    try:
        data = request.json
        
        # Vérifier les données requises
        if not data or 'candidate_resume' not in data or 'job_description' not in data:
            return jsonify({
                "error": "Les données requises sont manquantes. Veuillez fournir 'candidate_resume' et 'job_description'."
            }), 400
        
        # Extraire les données
        candidate_resume = data['candidate_resume']
        job_description = data['job_description']
        timeframe_weeks = data.get('timeframe_weeks', 12)
        
        # Générer le plan de développement
        result = skill_gap_analyzer.generate_skill_development_plan(
            candidate_resume=candidate_resume,
            job_description=job_description,
            timeframe_weeks=timeframe_weeks
        )
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération du plan de développement: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Une erreur s'est produite lors de la génération du plan: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500

if __name__ == '__main__':
    logger.info("Démarrage du serveur d'analyse des écarts de compétences...")
    app.run(host='0.0.0.0', port=5006, debug=False)
