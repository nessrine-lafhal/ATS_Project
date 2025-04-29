#!/bin/bash

# Vérifier si le serveur est déjà en cours d'exécution
PID=$(pgrep -f "python3 python/bias_detection/bias_detection_server.py" || true)
if [ ! -z "$PID" ]; then
  echo "Le serveur de détection des biais est déjà en cours d'exécution (PID: $PID)"
  exit 0
fi

# Installer les dépendances si nécessaire
pip install flask pandas spacy numpy

# Télécharger le modèle spaCy si nécessaire
python -m spacy download fr_core_news_md || python -m spacy download en_core_web_md

# Démarrer le serveur
echo "Démarrage du serveur de détection des biais..."
cd "$(dirname "$0")/.." && python3 python/bias_detection/bias_detection_server.py &

# Attendre que le serveur démarre
sleep 2

# Vérifier si le serveur a démarré correctement
PID=$(pgrep -f "python3 python/bias_detection/bias_detection_server.py" || true)
if [ -z "$PID" ]; then
  echo "Erreur: Le serveur de détection des biais n'a pas démarré correctement"
  exit 1
else
  echo "Le serveur de détection des biais a démarré avec succès (PID: $PID)"
fi
