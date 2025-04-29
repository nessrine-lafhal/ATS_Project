from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import time
from candidate_sourcer import CandidateSourcer

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialiser le sourcer de candidats
sourcer = CandidateSourcer()

@app.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint de vérification de l'état du serveur
    """
    return jsonify({"status": "ok", "service": "candidate-sourcing-service"})

@app.route('/search', methods=['POST'])
def search_candidates():
    """
    Endpoint pour rechercher des candidats
    """
    try:
        data = request.json
        
        # Extraire les paramètres de recherche
        job_description = data.get('job_description', '')
        skills = data.get('skills', [])
        location = data.get('location')
        experience_level = data.get('experience_level')
        platforms = data.get('platforms')
        max_results = data.get('max_results', 20)
        
        logger.info(f"Recherche de candidats avec les compétences: {skills}")
        
        # Effectuer la recherche
        candidates = sourcer.search_candidates(
            job_description=job_description,
            skills=skills,
            location=location,
            experience_level=experience_level,
            platforms=platforms,
            max_results=max_results
        )
        
        return jsonify({
            "success": True,
            "candidates": candidates,
            "count": len(candidates)
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la recherche de candidats: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/candidate/<platform>/<candidate_id>', methods=['GET'])
def get_candidate_details(platform, candidate_id):
    """
    Endpoint pour récupérer les détails d'un candidat
    """
    try:
        logger.info(f"Récupération des détails du candidat {candidate_id} sur {platform}")
        
        # Récupérer les détails du candidat
        details = sourcer.get_candidate_details(candidate_id, platform)
        
        return jsonify({
            "success": True,
            "candidate": details
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des détails du candidat: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_candidate():
    """
    Endpoint pour analyser l'adéquation d'un candidat
    """
    try:
        data = request.json
        
        # Extraire les paramètres d'analyse
        candidate = data.get('candidate', {})
        job_description = data.get('job_description', '')
        required_skills = data.get('required_skills', [])
        
        logger.info(f"Analyse de l'adéquation du candidat {candidate.get('id', 'inconnu')}")
        
        # Effectuer l'analyse
        analysis = sourcer.analyze_candidate_fit(
            candidate=candidate,
            job_description=job_description,
            required_skills=required_skills
        )
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse du candidat: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/platforms', methods=['GET'])
def get_platforms():
    """
    Endpoint pour récupérer le statut des plateformes
    """
    try:
        platforms = sourcer.get_platform_status()
        
        return jsonify({
            "success": True,
            "platforms": platforms
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des plateformes: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/platforms/<platform>', methods=['PUT'])
def update_platform(platform):
    """
    Endpoint pour mettre à jour le statut d'une plateforme
    """
    try:
        data = request.json
        enabled = data.get('enabled', True)
        
        success = sourcer.update_platform_status(platform, enabled)
        
        if success:
            return jsonify({
                "success": True,
                "message": f"Plateforme {platform} {'activée' if enabled else 'désactivée'}"
            })
        else:
            return jsonify({
                "success": False,
                "error": f"Plateforme {platform} non trouvée"
            }), 404
        
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour de la plateforme: {str(e)}")
        return json 
        logger.error(f"Erreur lors de la mise à jour de la plateforme: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/statistics', methods=['GET'])
def get_statistics():
    """
    Endpoint pour récupérer des statistiques sur le sourcing
    """
    try:
        statistics = sourcer.get_sourcing_statistics()
        
        return jsonify({
            "success": True,
            "statistics": statistics
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des statistiques: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Démarrage du serveur de sourcing de candidats")
    app.run(host='0.0.0.0', port=5006)
