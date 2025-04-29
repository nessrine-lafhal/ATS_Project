from flask import Flask, request, jsonify
import requests
import logging
import json
import os
import sys
from typing import Dict, Any, List, Text
import spacy
import numpy as np
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("chatbot_server.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load spaCy model
try:
    nlp = spacy.load("fr_core_news_md")
    logger.info("Successfully loaded spaCy model")
except Exception as e:
    logger.error(f"Error loading spaCy model: {e}")
    nlp = None

# Configuration
RASA_URL = os.environ.get("RASA_URL", "http://localhost:5005/webhooks/rest/webhook")
EVALUATIONS_DIR = "evaluations"
CONVERSATIONS_DIR = "conversations"
ANALYSES_DIR = "analyses"

# Ensure directories exist
for directory in [EVALUATIONS_DIR, CONVERSATIONS_DIR, ANALYSES_DIR]:
    os.makedirs(directory, exist_ok=True)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Entry point for the Rasa chatbot webhook"""
    data = request.json
    sender_id = data.get('sender')
    message = data.get('message')
    
    if not sender_id or not message:
        return jsonify({"error": "Missing sender or message"}), 400
    
    logger.info(f"Received message from {sender_id}: {message}")
    
    # Send request to Rasa
    try:
        rasa_payload = {
            "sender": sender_id,
            "message": message
        }
        
        response = requests.post(RASA_URL, json=rasa_payload)
        response.raise_for_status()
        
        # Log the conversation
        save_conversation(sender_id, "user", message)
        
        rasa_response = response.json()
        if rasa_response:
            for msg in rasa_response:
                save_conversation(sender_id, "bot", msg.get("text", ""))
        
        return jsonify(rasa_response)
    except Exception as e:
        logger.error(f"Error sending message to Rasa: {e}")
        
        # Fallback response if Rasa is unavailable
        fallback_response = generate_fallback_response(message)
        save_conversation(sender_id, "bot", fallback_response["text"])
        
        return jsonify([fallback_response])

@app.route('/evaluation/<candidate_id>', methods=['GET'])
def get_candidate_evaluation(candidate_id):
    """Retrieve a candidate's evaluation"""
    try:
        evaluation_path = os.path.join(EVALUATIONS_DIR, f"{candidate_id}.json")
        
        if not os.path.exists(evaluation_path):
            # Generate evaluation on-the-fly if it doesn't exist
            evaluation = generate_evaluation(candidate_id)
            with open(evaluation_path, "w") as f:
                json.dump(evaluation, f)
            return jsonify(evaluation)
            
        with open(evaluation_path, "r") as f:
            evaluation = json.load(f)
        return jsonify(evaluation)
    except Exception as e:
        logger.error(f"Error retrieving evaluation: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/conversations/<candidate_id>', methods=['GET'])
def get_conversation_history(candidate_id):
    """Retrieve a candidate's conversation history"""
    try:
        conversation_path = os.path.join(CONVERSATIONS_DIR, f"{candidate_id}.json")
        
        if not os.path.exists(conversation_path):
            return jsonify({"error": "Conversation not found"}), 404
            
        with open(conversation_path, "r") as f:
            conversation = json.load(f)
        return jsonify(conversation)
    except Exception as e:
        logger.error(f"Error retrieving conversation: {e}")
        return jsonify({"error": str(e)}), 500

def save_conversation(candidate_id: str, speaker: str, message: str) -> None:
    """Save a message to the conversation history"""
    try:
        conversation_path = os.path.join(CONVERSATIONS_DIR, f"{candidate_id}.json")
        
        # Load existing conversation or create new one
        if os.path.exists(conversation_path):
            with open(conversation_path, "r") as f:
                conversation = json.load(f)
        else:
            conversation = []
        
        # Add new message
        conversation.append({
            "speaker": speaker,
            "text": message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Save updated conversation
        with open(conversation_path, "w") as f:
            json.dump(conversation, f)
            
    except Exception as e:
        logger.error(f"Error saving conversation: {e}")

def generate_fallback_response(message: str) -> Dict[str, Any]:
    """Generate a fallback response when Rasa is unavailable"""
    # Simple keyword-based fallback
    message_lower = message.lower()
    
    if any(greeting in message_lower for greeting in ["bonjour", "salut", "hello"]):
        return {
            "text": "Bonjour ! Je suis l'assistant de recrutement virtuel. Comment puis-je vous aider aujourd'hui ?",
            "intent": "fallback_greeting"
        }
    elif any(experience in message_lower for experience in ["expérience", "travaillé", "ans"]):
        return {
            "text": "Merci de partager votre expérience. Pourriez-vous me parler de vos compétences techniques principales ?",
            "intent": "fallback_experience"
        }
    elif any(skill in message_lower for skill in ["compétence", "sais", "connais", "maîtrise"]):
        return {
            "text": "Ces compétences sont intéressantes. Quelle est votre formation ou votre parcours académique ?",
            "intent": "fallback_skills"
        }
    elif any(education in message_lower for education in ["diplôme", "formation", "étude", "université"]):
        return {
            "text": "Merci pour ces informations. Qu'est-ce qui vous motive à postuler pour ce poste ?",
            "intent": "fallback_education"
        }
    elif any(motivation in message_lower for motivation in ["motiv", "intéress", "passion", "aime"]):
        return {
            "text": "Je comprends votre motivation. Avez-vous des questions concernant le poste ou l'entreprise ?",
            "intent": "fallback_motivation"
        }
    else:
        return {
            "text": "Merci pour cette information. Pourriez-vous me parler de vos motivations pour rejoindre notre entreprise ?",
            "intent": "fallback_general"
        }

def analyze_text(text: str) -> Dict[str, Any]:
    """Analyze text using spaCy for skills, sentiment, etc."""
    if not nlp or not text:
        return {
            "skills": [],
            "sentiment": "neutral",
            "complexity": 0,
            "keywords": []
        }
    
    doc = nlp(text)
    
    # Extract skills (simplified)
    skills = []
    skill_keywords = ["python", "java", "javascript", "react", "angular", "vue", "node", "express", 
                     "django", "flask", "sql", "nosql", "mongodb", "postgresql", "mysql", "docker", 
                     "kubernetes", "aws", "azure", "gcp", "ci/cd", "git", "agile", "scrum", "kanban",
                     "machine learning", "deep learning", "nlp", "data science", "tensorflow", "pytorch"]
    
    for token in doc:
        if token.lemma_.lower() in skill_keywords:
            skills.append(token.text)
    
    # Simple sentiment analysis
    positive_words = ["excellent", "bon", "bien", "super", "génial", "aime", "passionné", "motivé", "intéressé"]
    negative_words = ["difficile", "problème", "mauvais", "déteste", "compliqué", "frustrant"]
    
    positive_count = sum(1 for token in doc if token.lemma_.lower() in positive_words)
    negative_count = sum(1 for token in doc if token.lemma_.lower() in negative_words)
    
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    # Text complexity (based on sentence length and word length)
    avg_sentence_length = sum(len(sent) for sent in doc.sents) / max(1, len(list(doc.sents)))
    avg_word_length = sum(len(token.text) for token in doc if not token.is_punct) / max(1, sum(1 for token in doc if not token.is_punct))
    complexity = (avg_sentence_length * 0.5) + (avg_word_length * 0.5)
    
    # Extract keywords
    keywords = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"] and not token.is_stop][:10]
    
    return {
        "skills": list(set(skills)),
        "sentiment": sentiment,
        "complexity": round(complexity, 2),
        "keywords": list(set(keywords))
    }

def generate_evaluation(candidate_id: str) -> Dict[str, Any]:
    """Generate an evaluation based on conversation history"""
    try:
        conversation_path = os.path.join(CONVERSATIONS_DIR, f"{candidate_id}.json")
        
        if not os.path.exists(conversation_path):
            return {
                "error": "No conversation found for this candidate",
                "generated": True
            }
        
        with open(conversation_path, "r") as f:
            conversation = json.load(f)
        
        # Extract user messages
        user_messages = [msg["text"] for msg in conversation if msg["speaker"] == "user"]
        
        if not user_messages:
            return {
                "error": "No user messages found in conversation",
                "generated": True
            }
        
        # Combine all user messages for analysis
        all_text = " ".join(user_messages)
        analysis = analyze_text(all_text)
        
        # Calculate scores
        technical_score = min(len(analysis["skills"]) * 15, 100)
        
        # Communication score based on message length and complexity
        avg_message_length = sum(len(msg) for msg in user_messages) / len(user_messages)
        communication_score = min(avg_message_length / 2, 100)
        
        # Motivation score based on sentiment
        motivation_score = {
            "positive": 85,
            "neutral": 60,
            "negative": 30
        }.get(analysis["sentiment"], 50)
        
        # Overall score
        overall_score = (technical_score * 0.4) + (communication_score * 0.3) + (motivation_score * 0.3)
        
        # Determine recommendation
        if overall_score >= 75:
            recommendation = "proceed"
        elif overall_score >= 50:
            recommendation = "further_evaluation"
        else:
            recommendation = "reject"
        
        evaluation = {
            "technicalSkills": round(technical_score),
            "softSkills": round(communication_score),
            "motivation": round(motivation_score),
            "overallScore": round(overall_score),
            "skills": analysis["skills"],
            "keywords": analysis["keywords"],
            "sentiment": analysis["sentiment"],
            "strengths": analysis["skills"][:3] if len(analysis["skills"]) >= 3 else analysis["skills"],
            "weaknesses": [],
            "recommendation": recommendation,
            "generated": True,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save the evaluation
        evaluation_path = os.path.join(EVALUATIONS_DIR, f"{candidate_id}.json")
        with open(evaluation_path, "w") as f:
            json.dump(evaluation, f)
        
        return evaluation
        
    except Exception as e:
        logger.error(f"Error generating evaluation: {e}")
        return {
            "error": str(e),
            "generated": True
        }

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
