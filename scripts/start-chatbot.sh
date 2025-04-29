#!/bin/bash

# Script pour démarrer le chatbot Rasa et le serveur Flask

# Vérifier si les dépendances sont installées
check_dependencies() {
    echo "Vérification des dépendances..."
    
    # Vérifier Python
    if ! command -v python3 &> /dev/null; then
        echo "Python 3 n'est pas installé. Veuillez l'installer."
        exit 1
    fi
    
    # Vérifier pip
    if ! command -v pip3 &> /dev/null; then
        echo "pip3 n'est pas installé. Veuillez l'installer."
        exit 1
    fi
    
    # Vérifier les packages Python requis
    python3 -c "import rasa" 2>/dev/null || { echo "Rasa n'est pas installé. Installation..."; pip3 install rasa; }
    python3 -c "import spacy" 2>/dev/null || { echo "spaCy n'est pas installé. Installation..."; pip3 install spacy; }
    python3 -c "import flask" 2>/dev/null || { echo "Flask n'est pas installé. Installation..."; pip3 install flask flask-cors; }
    
    # Vérifier le modèle spaCy français
    python3 -c "import spacy; spacy.load('fr_core_news_md')" 2>/dev/null || { 
        echo "Modèle spaCy français non trouvé. Téléchargement..."; 
        python3 -m spacy download fr_core_news_md; 
    }
}

# Démarrer le serveur Rasa
start_rasa() {
    echo "Démarrage du serveur Rasa..."
    
    # Vérifier si le modèle Rasa existe, sinon l'entraîner
    if [ ! -d "python/chatbot/models" ]; then
        echo "Aucun modèle Rasa trouvé. Entraînement du modèle..."
        cd python/chatbot && rasa train
    fi
    
    # Démarrer le serveur Rasa en arrière-plan
    cd python/chatbot && rasa run --enable-api --cors "*" --port 5005 &
    RASA_PID=$!
    echo "Serveur Rasa démarré avec PID: $RASA_PID"
    
    # Attendre que le serveur Rasa soit prêt
    echo "Attente du démarrage du serveur Rasa..."
    sleep 10
}

# Démarrer le serveur d'actions Rasa
start_rasa_actions() {
    echo "Démarrage du serveur d'actions Rasa..."
    cd python/chatbot && rasa run actions &
    ACTIONS_PID=$!
    echo "Serveur d'actions Rasa démarré avec PID: $ACTIONS_PID"
    
    # Attendre que le serveur d'actions soit prêt
    echo "Attente du démarrage du serveur d'actions..."
    sleep 5
}

# Démarrer le serveur Flask
start_flask() {
    echo "Démarrage du serveur Flask..."
    cd python/chatbot && python3 server.py &
    FLASK_PID=$!
    echo "Serveur Flask démarré avec PID: $FLASK_PID"
    
    # Attendre que le serveur Flask soit prêt
    echo "Attente du démarrage du serveur Flask..."
    sleep 5
}

# Démarrer l'application web
start_app() {
    echo "Démarrage de l'application web..."
    cd python/chatbot && python3 app.py --port 8000 &
    APP_PID=$!
    echo "Application web démarrée avec PID: $APP_PID"
}

# Fonction pour arrêter tous les processus
cleanup() {
    echo "Arrêt des serveurs..."
    [ -n "$RASA_PID" ] && kill $RASA_PID
    [ -n "$ACTIONS_PID" ] && kill $ACTIONS_PID
    [ -n "$FLASK_PID" ] && kill $FLASK_PID
    [ -n "$APP_PID" ] && kill $APP_PID
    exit 0
}

# Capturer les signaux pour un arrêt propre
trap cleanup SIGINT SIGTERM

# Exécution principale
main() {
    # Créer les répertoires nécessaires
    mkdir -p python/chatbot/evaluations
    mkdir -p python/chatbot/conversations
    mkdir -p python/chatbot/analyses
    
    # Vérifier les dépendances
    check_dependencies
    
    # Démarrer les serveurs
    start_rasa
    start_rasa_actions
    start_flask
    start_app
    
    echo "Tous les serveurs sont démarrés!"
    echo "Serveur Rasa: http://localhost:5005"
    echo "Serveur Flask: http://localhost:5000"
    echo "Application web: http://localhost:8000"
    
    # Garder le script en cours d'exécution
    echo "Appuyez sur Ctrl+C pour arrêter tous les serveurs"
    wait
}

# Exécuter le script
main
