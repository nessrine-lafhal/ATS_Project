from flask import Flask, request, jsonify
import os
import uuid
from cv_parser_service import get_cv_parser_service

app = Flask(__name__)
cv_parser_service = get_cv_parser_service()

@app.route('/api/parse-cv', methods=['POST'])
def parse_cv():
    """
    Endpoint pour analyser un CV
    Attend un JSON avec les champs:
    - cv_text: le texte du CV
    - job_description: (optionnel) la description du poste
    """
    data = request.json
    
    if not data or 'cv_text' not in data:
        return jsonify({"success": False, "error": "Le texte du CV est requis"}), 400
    
    cv_text = data['cv_text']
    job_description = data.get('job_description')
    
    # Générer un ID unique pour ce CV
    cv_id = str(uuid.uuid4())
    
    # Analyser le CV
    try:
        result = cv_parser_service.parse_cv(cv_text, job_description)
        
        # Sauvegarder l'analyse
        cv_parser_service.save_analysis(cv_id, result)
        
        # Préparer la réponse
        response = {
            "success": True,
            "cv_id": cv_id,
            "data": {
                "personalInfo": {
                    "fullName": result["structured_info"]["name"],
                    "email": result["structured_info"]["email"],
                    "phone": result["structured_info"]["phone"],
                    "location": "Non spécifié"  # À améliorer dans une version future
                },
                "skills": {
                    "technical": result["structured_info"]["skills"],
                    "soft": []  # À améliorer dans une version future
                },
                "education": result["structured_info"].get("education", []),
                "experience": result["structured_info"].get("experience", []),
                "matchScore": result.get("match_score", 0) * 100 if "match_score" in result else None
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/cv-analysis/<cv_id>', methods=['GET'])
def get_cv_analysis(cv_id):
    """
    Endpoint pour récupérer l'analyse d'un CV
    """
    result = cv_parser_service.get_analysis(cv_id)
    
    if result:
        return jsonify({"success": True, "data": result})
    else:
        return jsonify({"success": False, "error": "Analyse non trouvée"}), 404

if __name__ == '__main__':
    # Créer les répertoires nécessaires
    os.makedirs("data/cv_analysis", exist_ok=True)
    
    # Démarrer le serveur
    app.run(host='0.0.0.0', port=5001, debug=True)
