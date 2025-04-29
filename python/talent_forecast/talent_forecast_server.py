from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from talent_forecaster import TalentForecaster

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialisation du forecaster
forecaster = TalentForecaster()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de l'état du serveur"""
    return jsonify({"status": "healthy", "service": "talent-forecast-service"})

@app.route('/api/forecast', methods=['POST'])
def generate_forecast():
    """Génère une prévision complète des besoins en talents"""
    try:
        data = request.json
        timeframe = data.get('timeframe', 12)
        department = data.get('department', 'all')
        growth_factor = data.get('growthFactor', 15)
        
        # Conversion des types
        try:
            timeframe = int(timeframe)
            growth_factor = int(growth_factor)
        except ValueError:
            return jsonify({"success": False, "error": "Les paramètres timeframe et growthFactor doivent être des nombres"}), 400
        
        # Génération de la prévision
        forecast_result = forecaster.generate_comprehensive_forecast(
            timeframe=timeframe,
            department=department,
            growth_factor=growth_factor
        )
        
        if forecast_result:
            return jsonify({"success": True, "data": forecast_result})
        else:
            return jsonify({"success": False, "error": "Échec de la génération de la prévision"}), 500
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération de la prévision: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/forecast/data', methods=['POST'])
def generate_forecast_data():
    """Génère des données de prévision pour l'interface utilisateur"""
    try:
        data = request.json
        timeframe = data.get('timeframe', 12)
        department = data.get('department', 'all')
        
        # Conversion des types
        try:
            timeframe = int(timeframe)
        except ValueError:
            return jsonify({"success": False, "error": "Le paramètre timeframe doit être un nombre"}), 400
        
        # Génération des données
        forecast_data = forecaster.generate_forecast_data(
            timeframe=timeframe,
            department=department
        )
        
        if forecast_data:
            return jsonify({"success": True, "data": forecast_data})
        else:
            return jsonify({"success": False, "error": "Échec de la génération des données de prévision"}), 500
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération des données de prévision: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/forecast/train', methods=['POST'])
def train_models():
    """Entraîne les modèles de prévision"""
    try:
        data = request.json
        historical_data = data.get('historicalData', [])
        
        if not historical_data:
            return jsonify({"success": False, "error": "Aucune donnée historique fournie"}), 400
        
        # Entraînement du modèle Prophet
        prophet_success = forecaster.train_prophet_model(historical_data)
        
        # Entraînement du modèle LSTM si suffisamment de données
        lstm_success = False
        if len(historical_data) >= 24:
            lstm_success = forecaster.train_lstm_model(historical_data)
        
        return jsonify({
            "success": True,
            "data": {
                "prophetTrainingSuccess": prophet_success,
                "lstmTrainingSuccess": lstm_success,
                "modelsReady": prophet_success or lstm_success
            }
        })
    
    except Exception as e:
        logger.error(f"Erreur lors de l'entraînement des modèles: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)
