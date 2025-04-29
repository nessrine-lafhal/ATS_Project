#!/bin/bash

# Démarrer le serveur d'optimisation des descriptions de postes
echo "Démarrage du serveur d'optimisation des descriptions de postes..."
cd python/job_description_optimizer
python job_optimizer_server.py
