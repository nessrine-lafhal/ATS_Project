import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from datetime import datetime

# Importer la classe d'optimisation des descriptions de postes
try:
    from job_optimizer import JobDescriptionOptimizer, simulate_job_description_optimization, simulate_job_description_generation
    USE_SIMULATION = False
except ImportError:
    # Si les modèles ne peuvent pas être chargés, utiliser la simulation
    from job_optimizer import simulate_job_description_optimization, simulate_job_description_generation
    USE_SIMULATION = True
    print("Utilisation du mode simulation pour l'optimisation des descriptions de postes")

app = Flask(__name__)
CORS(app)

# Initialiser l'optimiseur de descriptions de postes
if not USE_SIMULATION:
    try:
        optimizer = JobDescriptionOptimizer()
    except Exception as e:
        print(f"Erreur lors de l'initialisation de l'optimiseur: {str(e)}")
        USE_SIMULATION = True
        print("Passage en mode simulation")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "job-description-optimizer", "simulation_mode": USE_SIMULATION})

@app.route('/analyze', methods=['POST'])
def analyze_job_description():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        
        if not job_description:
            return jsonify({"error": "La description de poste est requise"}), 400
        
        if not USE_SIMULATION:
            result = optimizer.analyze_job_description(job_description)
        else:
            # Simuler une analyse
            result = {
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
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        print(f"Erreur lors de l'analyse de la description de poste: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/optimize', methods=['POST'])
def optimize_job_description():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        job_category = data.get('job_category', 'tech')
        optimization_level = data.get('optimization_level', 'medium')
        
        if not job_description:
            return jsonify({"error": "La description de poste est requise"}), 400
        
        if not USE_SIMULATION:
            result = optimizer.optimize_job_description(job_description, job_category, optimization_level)
        else:
            # Simuler une optimisation
            result = simulate_job_description_optimization(job_description, job_category, optimization_level)
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        print(f"Erreur lors de l'optimisation de la description de poste: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/generate', methods=['POST'])
def generate_job_description():
    try:
        data = request.json
        job_title = data.get('job_title', '')
        job_category = data.get('job_category', 'tech')
        skills_required = data.get('skills_required', [])
        company_info = data.get('company_info', {})
        
        if not job_title:
            return jsonify({"error": "Le titre du poste est requis"}), 400
        
        if not USE_SIMULATION:
            result = optimizer.generate_job_description(job_title, job_category, skills_required, company_info)
        else:
            # Simuler une génération
            result = simulate_job_description_generation(job_title, job_category, skills_required, company_info)
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        print(f"Erreur lors de la génération de la description de poste: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/suggest', methods=['POST'])
def suggest_improvements():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        
        if not job_description:
            return jsonify({"error": "La description de poste est requise"}), 400
        
        if not USE_SIMULATION:
            result = optimizer.suggest_improvements(job_description)
        else:
            # Simuler des suggestions
            result = {
                "analysis": {
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
                },
                "suggestions": [
                    "Ajouter une section sur les avantages et bénéfices offerts",
                    "Utiliser plus de termes attractifs comme 'innovant', 'collaboratif', 'opportunité'",
                    "Améliorer la clarté en utilisant des phrases plus courtes et directes",
                    "Ajouter des exemples concrets de projets ou réalisations"
                ],
                "timestamp": datetime.now().isoformat()
            }
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        print(f"Erreur lors de la suggestion d'améliorations: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5004))
    app.run(host='0.0.0.0', port=port, debug=True)
