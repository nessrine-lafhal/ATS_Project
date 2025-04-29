#!/bin/bash

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
   echo "Python 3 n'est pas installé. Veuillez l'installer avant de continuer."
   exit 1
fi

# Vérifier si pip est installé
if ! command -v pip3 &> /dev/null; then
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
pip install flask spacy transformers torch numpy scikit-learn

# Télécharger le modèle spaCy français
echo "Téléchargement du modèle spaCy français..."
python -m spacy download fr_core_news_lg

# Démarrer le serveur
echo "Démarrage du serveur de matching sémantique..."
cd python
python semantic_matcher_server.py
