#!/bin/bash

# Définition des variables
SERVICE_NAME="cost-prediction"
SERVICE_DIR="python/cost_prediction"
PYTHON_SCRIPT="cost_prediction_server.py"
LOG_FILE="logs/${SERVICE_NAME}.log"

# Création du répertoire de logs s'il n'existe pas
mkdir -p logs

echo "Démarrage du service de prédiction des coûts..."

# Vérification de l'environnement Python
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "Erreur: Python n'est pas installé."
    exit 1
fi

# Vérification des dépendances
echo "Vérification des dépendances..."
$PYTHON_CMD -c "import pandas, numpy, sklearn, prophet, flask, flask_cors" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installation des dépendances manquantes..."
    pip install pandas numpy scikit-learn prophet flask flask-cors
fi

# Démarrage du serveur
echo "Démarrage du serveur..."
cd $(dirname $0)/..
$PYTHON_CMD $SERVICE_DIR/$PYTHON_SCRIPT > $LOG_FILE 2>&1 &

# Récupération du PID
PID=$!
echo "Service démarré avec PID: $PID"
echo $PID > logs/${SERVICE_NAME}.pid

# Vérification que le service est bien démarré
sleep 2
if ps -p $PID > /dev/null; then
    echo "Le service de prédiction des coûts est démarré et fonctionne correctement."
    echo "Les logs sont disponibles dans: $LOG_FILE"
else
    echo "Erreur: Le service n'a pas pu démarrer correctement."
    echo "Consultez les logs pour plus d'informations: $LOG_FILE"
    exit 1
fi
