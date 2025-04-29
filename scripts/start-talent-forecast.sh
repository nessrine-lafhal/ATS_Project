#!/bin/bash

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null
then
    echo "Python3 n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null
then
    echo "pip3 n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Créer un environnement virtuel si nécessaire
if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
echo "Installation des dépendances..."
pip install flask flask-cors pandas numpy prophet tensorflow scikit-learn joblib

# Démarrer le serveur
echo "Démarrage du serveur de prévision de talents..."
cd python/talent_forecast
python talent_forecast_server.py
