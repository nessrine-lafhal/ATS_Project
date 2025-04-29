#!/bin/bash

# Démarrer le serveur d'analyse vidéo
echo "Démarrage du serveur d'analyse vidéo..."

# Créer les répertoires nécessaires s'ils n'existent pas
mkdir -p uploads
mkdir -p resultats_analyses

# Activer l'environnement virtuel si nécessaire
# source venv/bin/activate

# Démarrer le serveur
python python/video_analysis_enhanced.py
