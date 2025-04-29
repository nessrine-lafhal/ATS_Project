#!/bin/bash

echo "Démarrage du serveur de sourcing de candidats..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null
then
    echo "Python3 n'est pas installé. Veuillez l'installer pour continuer."
    exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null
then
    echo "pip3 n'est pas installé. Veuillez l'installer pour continuer."
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
pip install flask flask-cors requests beautifulsoup4 gensim nltk numpy

# Aller dans le répertoire du serveur
cd python/candidate_sourcing

# Démarrer le serveur
echo "Démarrage du serveur..."
python candidate_sourcing_server.py
