import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from datetime import datetime

# Importer la classe de génération de scénarios d'entretien
try:
    from interview_generator import InterviewScenarioGenerator, simulate_interview_scenario_generation
    USE_SIMULATION = False
except ImportError:
    # Si les modèles ne peuvent pas être chargés, utiliser la simulation
    from interview_generator import simulate_interview_scenario_generation
    USE_SIMULATION = True
    print("Utilisation du mode simulation pour la génération de scénarios d'entretien")

app = Flask(__name__)
CORS(app)

# Initialiser le générateur de scénarios d'entretien
if not USE_SIMULATION:
    try:
        generator = InterviewScenarioGenerator()
    except Exception as e:
        print(f"Erreur lors de l'initialisation du générateur: {str(e)}")
        USE_SIMULATION = True
        print("Passage en mode simulation")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "interview-scenario-generator", "simulation_mode": USE_SIMULATION})

@app.route('/generate', methods=['POST'])
def generate_interview_scenarios():
    try:
        data = request.json
        job_description = data.get('job_description', '')
        candidate_profile = data.get('candidate_profile', {})
        company_info = data.get('company_info', {})
        scenario_types = data.get('scenario_types', None)
        num_questions = data.get('num_questions', 5)
        
        if not job_description:
            return jsonify({"error": "La description de poste est requise"}), 400
        
        if not USE_SIMULATION:
            result = generator.generate_interview_scenarios(
                job_description, candidate_profile, company_info, scenario_types, num_questions
            )
        else:
            # Simuler une génération
            result = simulate_interview_scenario_generation(
                job_description, candidate_profile, company_info, scenario_types, num_questions
            )
        
        return jsonify({"success": True, "data": result})
    
    except Exception as e:
        print(f"Erreur lors de la génération des scénarios d'entretien: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/generate-script', methods=['POST'])
def generate_interview_script():
    try:
        data = request.json
        job_title = data.get('job_title', '')
        scenarios = data.get('scenarios', {})
        company_info = data.get('company_info', {})
        
        if not job_title:
            return jsonify({"error": "Le titre du poste est requis"}), 400
        
        if not scenarios:
            return jsonify({"error": "Les scénarios d'entretien sont requis"}), 400
        
        if not USE_SIMULATION:
            script = generator.generate_interview_script(job_title, scenarios, company_info)
        else:
            # Simuler une génération de script
            script = f"# Script d'entretien pour le poste de {job_title}\n\n"
            script += "## Introduction\n\n"
            script += f"Bonjour et bienvenue chez {company_info.get('name', 'notre entreprise')}. "
            script += "Je m'appelle [Nom de l'intervieweur] et je suis [Poste de l'intervieweur]. "
            script += f"Nous sommes ravis de vous rencontrer aujourd'hui pour discuter du poste de {job_title}.\n\n"
            
            # Ajouter les questions par catégorie
            for category, questions in scenarios.items():
                if category != "roleplay":
                    script += f"## Questions de type {category}\n\n"
                    
                    if isinstance(questions, list):
                        for i, question in enumerate(questions, 1):
                            script += f"{i}. {question}\n"
                            script += "   - [Noter les points clés de la réponse]\n"
                            script += "   - [Points à approfondir si nécessaire]\n\n"
            
            # Ajouter les jeux de rôle
            if "roleplay" in scenarios and isinstance(scenarios["roleplay"], list):
                script += "## Mise en situation / Jeu de rôle\n\n"
                
                for i, scenario in enumerate(scenarios["roleplay"], 1):
                    if isinstance(scenario, dict):
                        script += f"{i}. **{scenario.get('title', 'Scénario')}**\n\n"
                        script += f"   {scenario.get('description', '')}\n\n"
                    else:
                        script += f"{i}. **Scénario**\n\n"
                        script += f"   {scenario}\n\n"
            
            # Conclusion
            script += "## Conclusion\n\n"
            script += "Merci pour cet entretien. Nous vous recontacterons prochainement pour vous informer de la suite du processus.\n"
        
        return jsonify({"success": True, "data": {"script": script}})
    
    except Exception as e:
        print(f"Erreur lors de la génération du script d'entretien: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5005))
    app.run(host='0.0.0.0', port=port, debug=True)
