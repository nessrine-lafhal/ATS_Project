from flask import Flask, request, jsonify
from bias_detector import BiasDetector
import pandas as pd
import json
import traceback

app = Flask(__name__)
bias_detector = BiasDetector()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de l'état du serveur"""
    return jsonify({"status": "healthy"})

@app.route('/detect-bias', methods=['POST'])
def detect_bias():
    """Endpoint pour détecter les biais dans un texte"""
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        results = bias_detector.detect_bias_in_text(text)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in detect_bias: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/audit-recruitment', methods=['POST'])
def audit_recruitment():
    """Endpoint pour auditer les données de recrutement"""
    try:
        data = request.json
        recruitment_data = data.get('data', [])
        protected_attributes = data.get('protected_attributes', [])
        outcome_column = data.get('outcome_column', 'hired')
        
        if not recruitment_data or not protected_attributes:
            return jsonify({"error": "Missing required data"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(recruitment_data)
        
        results = bias_detector.audit_recruitment_data(df, protected_attributes, outcome_column)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in audit_recruitment: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict-attrition', methods=['POST'])
def predict_attrition():
    """Endpoint pour prédire l'attrition et la rétention"""
    try:
        data = request.json
        employee_data = data.get('data', [])
        
        if not employee_data:
            return jsonify({"error": "No employee data provided"}), 400
        
        # Convertir les données en DataFrame
        df = pd.DataFrame(employee_data)
        
        results = bias_detector.predict_attrition_retention(df)
        return jsonify({"success": True, "data": results})
    
    except Exception as e:
        print(f"Error in predict_attrition: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)
