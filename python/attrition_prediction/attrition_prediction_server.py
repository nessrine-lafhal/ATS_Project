from flask import Flask, request, jsonify
from attrition_predictor import AttritionPredictor
import pandas as pd
import json
import traceback

app = Flask(__name__)
predictor = AttritionPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de l'état du serveur"""
    return jsonify({"status": "healthy"})

@app.route('/predict-attrition', methods=['POST'])
def predict_attrition():
    """Endpoint pour prédire l'attrition des employés"""
    try:
        data = request.json
        employee_data = data.get('data', [])
        
        if not employee_data:
            return jsonify({"error": "No employee data provided"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(employee_data)
        
        # Prédire l'attrition
        results = predictor.predict_attrition(df)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in predict_attrition: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict-future-attrition', methods=['POST'])
def predict_future_attrition():
    """Endpoint pour prédire l'attrition future"""
    try:
        data = request.json
        employee_data = data.get('data', [])
        months = data.get('months', 12)
        
        if not employee_data:
            return jsonify({"error": "No employee data provided"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(employee_data)
        
        # Prédire l'attrition future
        results = predictor.predict_future_attrition(df, months)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in predict_future_attrition: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/train-model', methods=['POST'])
def train_model():
    """Endpoint pour entraîner le modèle d'attrition"""
    try:
        data = request.json
        training_data = data.get('data', [])
        target_column = data.get('target_column', 'attrition')
        
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
    app.run(host='0.0.0.0', port=5005, debug=True)
