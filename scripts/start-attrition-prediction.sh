#!/bin/bash

# Script pour démarrer le serveur de prédiction d'attrition

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
pip install flask pandas numpy scikit-learn tensorflow

# Aller dans le répertoire du serveur
cd python/attrition_prediction

# Démarrer le serveur
echo "Démarrage du serveur de prédiction d'attrition..."
python attrition_prediction_server.py
