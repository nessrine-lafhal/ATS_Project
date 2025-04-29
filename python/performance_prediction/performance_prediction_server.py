from flask import Flask, request, jsonify
from performance_predictor import PerformancePredictor
import pandas as pd
import json
import traceback

app = Flask(__name__)
predictor = PerformancePredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de l'état du serveur"""
    return jsonify({"status": "healthy"})

@app.route('/predict-performance', methods=['POST'])
def predict_performance():
    """Endpoint pour prédire la performance des candidats"""
    try:
        data = request.json
        candidate_data = data.get('data', [])
        
        if not candidate_data:
            return jsonify({"error": "No candidate data provided"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(candidate_data)
        
        # Prédire la performance
        results = predictor.predict_performance(df)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in predict_performance: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/performance-factors', methods=['GET'])
def performance_factors():
    """Endpoint pour obtenir les facteurs qui influencent la performance"""
    try:
        results = predictor.get_performance_factors()
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in performance_factors: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/train-model', methods=['POST'])
def train_model():
    """Endpoint pour entraîner le modèle de prédiction de performance"""
    try:
        data = request.json
        training_data = data.get('data', [])
        target_column = data.get('target_column', 'performance_score')
        
        if not training_data:
            return jsonify({"error": "No training data provided"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(training_data)
        
        # Entraîner le modèle
        metrics = predictor.train_model(df, target_column)
        return jsonify({"success": True, "data": metrics})
    
    except Exception as e:
        print(f"Error in train_model: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)
