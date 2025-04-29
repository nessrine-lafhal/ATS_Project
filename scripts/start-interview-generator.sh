#!/bin/bash

# Démarrer le serveur de génération de scénarios d'entretien
echo "Démarrage du serveur de génération de scénarios d'entretien..."
cd python/interview_generator
python interview_generator_server.py
