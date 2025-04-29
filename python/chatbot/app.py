import os
import sys
import logging
import json
import argparse
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("chatbot_app.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
CHATBOT_SERVER_URL = os.environ.get("CHATBOT_SERVER_URL", "http://localhost:5000")
JOB_DATA_FILE = os.environ.get("JOB_DATA_FILE", "data/jobs.json")

# Load job data
def load_job_data():
    try:
        if os.path.exists(JOB_DATA_FILE):
            with open(JOB_DATA_FILE, "r") as f:
                return json.load(f)
        else:
            # Default job data
            return {
                "jobs": [
                    {
                        "id": "dev-fullstack",
                        "title": "Développeur Full Stack",
                        "description": "Développement d'applications web modernes",
                        "responsibilities": "Conception, développement et maintenance d'applications",
                        "company_name": "TechInnovate",
                        "company_description": "une entreprise innovante dans le secteur de la technologie",
                        "salary_min": 45000,
                        "salary_max": 65000
                    },
                    {
                        "id": "data-scientist",
                        "title": "Data Scientist",
                        "description": "Analyse de données et création de modèles prédictifs",
                        "responsibilities": "Collecte, nettoyage et analyse de données, création de modèles ML",
                        "company_name": "DataInsight",
                        "company_description": "leader dans l'analyse de données et l'intelligence artificielle",
                        "salary_min": 50000,
                        "salary_max": 70000
                    }
                ]
            }
    except Exception as e:
        logger.error(f"Error loading job data: {e}")
        return {"jobs": []}

@app.route('/')
def index():
    """Render the chatbot interface"""
    jobs = load_job_data().get("jobs", [])
    return render_template('index.html', jobs=jobs)

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Return available jobs"""
    jobs = load_job_data().get("jobs", [])
    return jsonify(jobs)

@app.route('/api/job/<job_id>', methods=['GET'])
def get_job(job_id):
    """Return details for a specific job"""
    jobs = load_job_data().get("jobs", [])
    job = next((job for job in jobs if job.get("id") == job_id), None)
    
    if job:
        return jsonify(job)
    else:
        return jsonify({"error": "Job not found"}), 404

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy requests to the chatbot server"""
    data = request.json
    
    if not data or not data.get("message"):
        return jsonify({"error": "Message is required"}), 400
    
    # Add job context if provided
    job_id = data.get("jobId")
    if job_id:
        jobs = load_job_data().get("jobs", [])
        job = next((job for job in jobs if job.get("id") == job_id), None)
        
        if job:
            # Enrich the context with job details
            data["context"] = {
                "job_title": job.get("title"),
                "job_description": job.get("description"),
                "job_responsibilities": job.get("responsibilities"),
                "company_name": job.get("company_name"),
                "company_description": job.get("company_description"),
                "salary_min": job.get("salary_min"),
                "salary_max": job.get("salary_max")
            }
    
    try:
        # Forward the request to the chatbot server
        response = requests.post(f"{CHATBOT_SERVER_URL}/webhook", json=data)
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error communicating with chatbot server: {e}")
        return jsonify({
            "error": "Failed to communicate with chatbot server",
            "fallback": True,
            "message": "Notre service de chat est temporairement indisponible. Veuillez réessayer plus tard."
        }), 500

@app.route('/api/evaluation/<candidate_id>', methods=['GET'])
def get_evaluation(candidate_id):
    """Proxy evaluation requests to the chatbot server"""
    try:
        response = requests.get(f"{CHATBOT_SERVER_URL}/evaluation/{candidate_id}")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error getting evaluation: {e}")
        return jsonify({
            "error": "Failed to get evaluation",
            "fallback": True
        }), 500

@app.route('/api/conversations/<candidate_id>', methods=['GET'])
def get_conversations(candidate_id):
    """Proxy conversation history requests to the chatbot server"""
    try:
        response = requests.get(f"{CHATBOT_SERVER_URL}/conversations/{candidate_id}")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error getting conversations: {e}")
        return jsonify({
            "error": "Failed to get conversation history",
            "fallback": True
        }), 500

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Chatbot Application Server')
    parser.add_argument('--port', type=int, default=8000, help='Port to run the server on')
    parser.add_argument('--debug', action='store_true', help='Run in debug mode')
    
    args = parser.parse_args()
    
    app.run(host='0.0.0.0', port=args.port, debug=args.debug)
