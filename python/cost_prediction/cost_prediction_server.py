from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from cost_predictor import CostPredictor

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialisation du prédicteur de coûts
cost_predictor = CostPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de l'état du serveur"""
    return jsonify({"status": "healthy", "service": "cost-prediction-service"})

@app.route('/api/predict', methods=['POST'])
def predict_cost():
    """Prédit le coût d'un recrutement en fonction des caractéristiques fournies"""
    try:
        data = request.json
        recruitment_data = data.get('recruitment_data', {})
        model_type = data.get('model_type', 'random_forest')
        
        # Validation des données
        required_fields = ['channel', 'position_level', 'department']
        for field in required_fields:
            if field not in recruitment_data:
                return jsonify({"success": False, "error": f"Le champ '{field}' est requis"}), 400
        
        # Prédiction du coût
        prediction_result = cost_predictor.predict_cost(recruitment_data, model_type)
        
        if 'error' in prediction_result:
            return jsonify({"success": False, "error": prediction_result['error']}), 500
        
        return jsonify({"success": True, "data": prediction_result})
    
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction du coût: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/forecast', methods=['POST'])
def forecast_costs():
    """Génère des prévisions de coûts pour les périodes futures"""
    try:
        data = request.json
        historical_data = data.get('historical_data')
        periods = data.get('periods', 12)
        freq = data.get('freq', 'M')
        
        # Conversion des types
        try:
            periods = int(periods)
        except ValueError:
            return jsonify({"success": False, "error": "Le paramètre 'periods' doit être un nombre entier"}), 400
        
        # Génération des prévisions
        forecast_result = cost_predictor.forecast_costs(historical_data, periods, freq)
        
        if 'error' in forecast_result:
            return jsonify({"success": False, "error": forecast_result['error']}), 500
        
        return jsonify({"success": True, "data": forecast_result})
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération des prévisions: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/channels', methods=['POST'])
def analyze_channels():
    """Analyse l'efficacité des différents canaux de recrutement"""
    try:
        data = request.json
        channel_data = data.get('channel_data')
        
        # Analyse des canaux
        analysis_result = cost_predictor.analyze_channels(channel_data)
        
        if 'error' in analysis_result:
            return jsonify({"success": False, "error": analysis_result['error']}), 500
        
        return jsonify({"success": True, "data": analysis_result})
    
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse des canaux: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/train/regression', methods=['POST'])
def train_regression():
    """Entraîne un modèle de régression pour la prédiction des coûts"""
    try:
        data = request.json
        training_data = data.get('training_data')
        model_type = data.get('model_type', 'random_forest')
        
        if not training_data:
            return jsonify({"success": False, "error": "Aucune donnée d'entraînement fournie"}), 400
        
        # Entraînement du modèle
        training_result = cost_predictor.train_regression_model(training_data, model_type)
        
        return jsonify({"success": training_result['success'], "data": training_result})
    
    except Exception as e:
        logger.error(f"Erreur lors de l'entraînement du modèle de régression: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/train/prophet', methods=['POST'])
def train_prophet():
    """Entraîne un modèle Prophet pour les prévisions temporelles"""
    try:
        data = request.json
        time_series_data = data.get('time_series_data')
        
        if not time_series_data:
            return jsonify({"success": False, "error": "Aucune donnée temporelle fournie"}), 400
        
        # Entraînement du modèle
        training_result = cost_predictor.train_prophet_model(time_series_data)
        
        return jsonify({"success": training_result['success'], "data": training_result})
    
    except Exception as e:
        logger.error(f"Erreur lors de l'entraînement du modèle Prophet: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=True)
