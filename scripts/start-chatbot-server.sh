#!/bin/bash

# Script pour démarrer uniquement le serveur Flask du chatbot
# Utile pour le développement ou lorsque Rasa est déjà en cours d'exécution

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
    python3 -c "import flask" 2>/dev/null || { echo "Flask n'est pas installé. Installation..."; pip3 install flask flask-cors; }
    python3 -c "import spacy" 2>/dev/null || { echo "spaCy n'est pas installé. Installation..."; pip3 install spacy; }
    
    # Vérifier le modèle spaCy français
    python3 -c "import spacy; spacy.load('fr_core_news_md')" 2>/dev/null || { 
        echo "Modèle spaCy français non trouvé. Téléchargement..."; 
        python3 -m spacy download fr_core_news_md; 
    }
}

# Démarrer le serveur Flask
start_flask() {
    echo "Démarrage du serveur Flask..."
    
    # Créer les répertoires nécessaires
    mkdir -p python/chatbot/evaluations
    mkdir -p python/chatbot/conversations
    mkdir -p python/chatbot/analyses
    
    # Définir l'URL de Rasa (peut être modifiée via une variable d'environnement)
    export RASA_URL=${RASA_URL:-"http://localhost:5005/webhooks/rest/webhook"}
    
    # Démarrer le serveur Flask
    cd python/chatbot && python3 server.py &
    FLASK_PID=$!
    echo "Serveur Flask démarré avec PID: $FLASK_PID"
    
    # Attendre que le serveur Flask soit prêt
    echo "Attente du démarrage du serveur Flask..."
    sleep 5
    
    echo "Serveur Flask démarré sur http://localhost:5000"
}

# Fonction pour arrêter tous les processus
cleanup() {
    echo "Arrêt du serveur..."
    [ -n "$FLASK_PID" ] && kill $FLASK_PID
    exit 0
}

# Capturer les signaux pour un arrêt propre
trap cleanup SIGINT SIGTERM

# Exécution principale
main() {
    # Vérifier les dépendances
    check_dependencies
    
    # Démarrer le serveur Flask
    start_flask
    
    echo "Serveur démarré! Appuyez sur Ctrl+C pour arrêter."
    wait
}

# Exécuter le script
main
