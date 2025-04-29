#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Module d'analyse vidéo amélioré pour les entretiens de recrutement.
Combine les fonctionnalités de analyse_video_entretiens.py et integrateur_ats.py
"""

import os
import sys
import json
import time
import datetime
import cv2
import numpy as np
import mediapipe as mp
import pandas as pd
import matplotlib.pyplot as plt
from scipy.signal import savgol_filter
import logging
from typing import Dict, List, Tuple, Optional, Union, Any
from pathlib import Path
import threading
import base64
from io import BytesIO
from flask import Flask, request, jsonify, send_file

class AnalyseVideoEntretien:
    """
    Classe pour analyser les vidéos d'entretien, détecter les émotions,
    les expressions faciales et les indices non verbaux.
    """
    
    def __init__(self, model_path=None, output_dir='resultats_analyses'):
        """
        Initialisation de l'analyseur vidéo.
        
        Args:
            model_path (str): Chemin vers le modèle d'analyse des émotions
            output_dir (str): Répertoire de sortie pour les résultats
        """
        # Initialisation de MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_holistic = mp.solutions.holistic
        
        # Création du répertoire de sortie s'il n'existe pas
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Charger le modèle d'émotions (Utilisant le framework MediaPipe Tasks)
        self.model_path = model_path
        self.detector = None
        
        try:
            if model_path and os.path.exists(model_path):
                # Ici, on utiliserait le code pour charger le modèle
                # Pour l'instant, on simule juste le chargement
                print(f"Modèle d'émotions chargé depuis {model_path}")
            else:
                print("Aucun modèle d'émotions spécifié ou trouvé. Utilisation d'une détection de base.")
        except Exception as e:
            print(f"Impossible de charger le modèle d'émotions: {e}")
            print("Utilisation d'une détection de base des émotions")
        
        # Valeurs des émotions et métriques non verbales
        self.emotions_data = {
            'timestamp': [],
            'joie': [],
            'tristesse': [],
            'colere': [],
            'surprise': [],
            'peur': [],
            'degout': [],
            'neutre': [],
            'confiance': [],
            'attention': [],
            'engagement': []
        }
        
        # Métriques de position des yeux/tête pour l'attention
        self.last_head_pos = None
        self.head_movement_count = 0
        self.blink_count = 0
        self.last_blink_time = 0
        
        # Métriques globales
        self.analyse_complete = {
            'duree_totale': 0,
            'emotion_dominante': '',
            'niveau_engagement': 0,
            'variations_attention': 0,
            'moments_cles': [],
            'score_global': 0
        }
    
    def _detecter_visage(self, frame):
        """
        Détecte les visages dans l'image avec MediaPipe.
        
        Args:
            frame (np.array): Image à analyser
            
        Returns:
            landmarks (liste): Points de repère du visage
            face_present (bool): True si un visage est détecté
        """
        with self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5) as face_mesh:
            
            # Convertir l'image en RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(frame_rgb)
            
            if results.multi_face_landmarks:
                return results.multi_face_landmarks[0].landmark, True
            else:
                return None, False
    
    def _analyser_emotion(self, frame, landmarks):
        """
        Analyse l'émotion du visage détecté.
        
        Args:
            frame (np.array): Image à analyser
            landmarks (liste): Points de repère du visage
            
        Returns:
            emotions (dict): Dictionnaire des scores d'émotions
        """
        # Initialiser les valeurs par défaut
        emotions = {
            'joie': 0,
            'tristesse': 0,
            'colere': 0,
            'surprise': 0,
            'peur': 0,
            'degout': 0,
            'neutre': 0
        }
        
        # Méthode de secours basée sur les landmarks pour estimer les émotions
        emotions = self._calculer_emotions_depuis_landmarks(landmarks)
        
        return emotions
    
    def _calculer_emotions_depuis_landmarks(self, landmarks):
        """
        Calcule les émotions à partir des landmarks du visage.
        C'est une méthode simplifiée basée sur des heuristiques.
        
        Args:
            landmarks (liste): Points de repère du visage
            
        Returns:
            emotions (dict): Dictionnaire des scores d'émotions
        """
        # Dans un système réel, on utiliserait un modèle d'IA entraîné
        # Ceci est une simulation simplifiée pour démonstration
        
        if not landmarks:
            return {
                'joie': 0,
                'tristesse': 0,
                'colere': 0, 
                'surprise': 0,
                'peur': 0,
                'degout': 0,
                'neutre': 1.0  # Par défaut neutre
            }
        
        # Calculer les distances entre points clés
        # Par exemple, largeur de la bouche pour la joie
        mouth_width = abs(landmarks[61].x - landmarks[291].x)
        mouth_height = abs(landmarks[0].y - landmarks[17].y)
        
        # Distance entre sourcils pour la colère
        eyebrow_dist = abs(landmarks[65].y - landmarks[295].y)
        
        # Hauteur des yeux pour la surprise
        eye_height = abs(landmarks[159].y - landmarks[145].y)
        
        # Calcul simplifié des scores d'émotions
        joie_score = mouth_width * 2.0
        tristesse_score = 1.0 - joie_score if mouth_height > 0.02 else 0.1
        colere_score = 1.0 - eyebrow_dist if eyebrow_dist < 0.05 else 0.1
        surprise_score = eye_height * 5.0 if eye_height > 0.03 else 0.1
        
        # Normalisation des scores
        total = joie_score + tristesse_score + colere_score + surprise_score + 0.1
        
        emotions = {
            'joie': min(1.0, joie_score / total),
            'tristesse': min(1.0, tristesse_score / total),
            'colere': min(1.0, colere_score / total),
            'surprise': min(1.0, surprise_score / total),
            'peur': 0.1,  # Simplifié
            'degout': 0.1,  # Simplifié
            'neutre': 0.1   # Simplifié
        }
        
        # Normaliser pour que la somme = 1
        sum_emotions = sum(emotions.values())
        for emotion in emotions:
            emotions[emotion] /= sum_emotions
            
        return emotions
    
    def _analyser_attention(self, landmarks):
        """
        Analyse l'attention et l'engagement à partir des landmarks.
        
        Args:
            landmarks (liste): Points de repère du visage
            
        Returns:
            attention (float): Score d'attention (0-1)
            engagement (float): Score d'engagement (0-1)
        """
        if not landmarks:
            return 0.5, 0.5
            
        # Analyser la position de la tête
        head_pos = (landmarks[1].x, landmarks[1].y, landmarks[1].z)
        
        # Calculer les mouvements de tête
        if self.last_head_pos:
            movement = np.sqrt(
                (head_pos[0] - self.last_head_pos[0])**2 +
                (head_pos[1] - self.last_head_pos[1])**2 +
                (head_pos[2] - self.last_head_pos[2])**2
            )
            
            # Détecter les mouvements significatifs
            if movement > 0.01:
                self.head_movement_count += 1
        
        self.last_head_pos = head_pos
        
        # Détecter les clignements (simplifié)
        left_eye_height = abs(landmarks[159].y - landmarks[145].y)
        
        # Un clignement est détecté si les yeux sont presque fermés
        if left_eye_height < 0.01 and time.time() - self.last_blink_time > 0.5:
            self.blink_count += 1
            self.last_blink_time = time.time()
        
        # Calculer le score d'attention
        # L'attention est inversement proportionnelle aux mouvements excessifs de la tête
        attention = max(0.1, min(1.0, 1.0 - (self.head_movement_count / 100)))
        
        # Calculer le score d'engagement
        # L'engagement est basé sur un taux de clignement normal (ni trop, ni trop peu)
        ideal_blink_rate = 0.2  # ~12 clignements par minute
        current_blink_rate = self.blink_count / max(1, (time.time() - self.last_blink_time))
        engagement = max(0.1, min(1.0, 1.0 - abs(current_blink_rate - ideal_blink_rate)))
        
        return attention, engagement
    
    def _calculer_confiance(self, emotions, attention):
        """
        Calcule un score de confiance basé sur les émotions et l'attention.
        
        Args:
            emotions (dict): Scores d'émotions
            attention (float): Score d'attention
            
        Returns:
            confiance (float): Score de confiance (0-1)
        """
        # La confiance est plus élevée quand la joie et la neutralité sont plus présentes
        # et que l'attention est maintenue
        confiance = (emotions['joie'] * 0.4 + 
                     emotions['neutre'] * 0.3 + 
                     (1.0 - emotions['peur']) * 0.1 +
                     attention * 0.2)
        
        return max(0.0, min(1.0, confiance))
    
    def analyser_frame(self, frame, timestamp):
        """
        Analyse une frame de vidéo pour en extraire les métriques.
        
        Args:
            frame (np.array): Image à analyser
            timestamp (float): Timestamp de la frame
            
        Returns:
            frame_annotee (np.array): Image avec annotations
            metriques (dict): Métriques extraites
        """
        # Détecter le visage
        landmarks, face_present = self._detecter_visage(frame)
        
        frame_annotee = frame.copy()
        
        if face_present:
            # Dessiner les landmarks sur la frame
            with self.mp_face_mesh.FaceMesh() as face_mesh:
                results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                if results.multi_face_landmarks:
                    for face_landmarks in results.multi_face_landmarks:
                        self.mp_drawing.draw_landmarks(
                            image=frame_annotee,
                            landmark_list=face_landmarks,
                            connections=self.mp_face_mesh.FACEMESH_TESSELATION,
                            landmark_drawing_spec=None,
                            connection_drawing_spec=self.mp_drawing_styles.get_default_face_mesh_tesselation_style()
                        )
            
            # Analyser les émotions
            emotions = self._analyser_emotion(frame, landmarks)
            
            # Analyser l'attention et l'engagement
            attention, engagement = self._analyser_attention(landmarks)
            
            # Calculer la confiance
            confiance = self._calculer_confiance(emotions, attention)
            
            # Stocker les données
            self.emotions_data['timestamp'].append(timestamp)
            for emotion, score in emotions.items():
                self.emotions_data[emotion].append(score)
            
            self.emotions_data['confiance'].append(confiance)
            self.emotions_data['attention'].append(attention)
            self.emotions_data['engagement'].append(engagement)
            
            # Afficher les métriques sur la frame
            y_offset = 30
            for emotion, score in emotions.items():
                cv2.putText(
                    frame_annotee, 
                    f"{emotion}: {score:.2f}", 
                    (10, y_offset), 
                    cv2.FONT_HERSHEY_SIMPLEX, 
                    0.5, 
                    (0, 255, 0), 
                    1
                )
                y_offset += 20
            
            cv2.putText(
                frame_annotee,
                f"Attention: {attention:.2f}",
                (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 0, 0),
                1
            )
            y_offset += 20
            
            cv2.putText(
                frame_annotee,
                f"Engagement: {engagement:.2f}",
                (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 255),
                1
            )
            y_offset += 20
            
            cv2.putText(
                frame_annotee,
                f"Confiance: {confiance:.2f}",
                (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 255, 0),
                1
            )
            
            # Retourner les métriques
            metriques = {
                'timestamp': timestamp,
                'emotions': emotions,
                'attention': attention,
                'engagement': engagement,
                'confiance': confiance
            }
        else:
            # Aucun visage détecté
            cv2.putText(
                frame_annotee,
                "Aucun visage détecté",
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                2
            )
            
            # Métriques par défaut
            metriques = {
                'timestamp': timestamp,
                'emotions': {
                    'joie': 0,
                    'tristesse': 0,
                    'colere': 0,
                    'surprise': 0,
                    'peur': 0,
                    'degout': 0,
                    'neutre': 1.0
                },
                'attention': 0,
                'engagement': 0,
                'confiance': 0
            }
        
        return frame_annotee, metriques
    
    def analyser_video(self, video_path, output_video_path=None, max_frames=None):
        """
        Analyse une vidéo complète et génère les résultats.
        
        Args:
            video_path (str): Chemin vers la vidéo à analyser
            output_video_path (str): Chemin pour la vidéo annotée (optionnel)
            max_frames (int): Nombre maximum de frames à traiter (optionnel)
            
        Returns:
            resultat (dict): Analyse complète de la vidéo
        """
        # Ouvrir la vidéo
        video = cv2.VideoCapture(video_path)
        if not video.isOpened():
            print(f"Erreur: Impossible d'ouvrir la vidéo {video_path}")
            return None
        
        # Obtenir les propriétés de la vidéo
        fps = video.get(cv2.CAP_PROP_FPS)
        width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Limiter le nombre de frames si nécessaire
        if max_frames and max_frames < total_frames:
            total_frames = max_frames
        
        # Créer la vidéo de sortie si nécessaire
        if output_video_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out_video = cv2.VideoWriter(
                output_video_path, 
                fourcc, 
                fps, 
                (width, height)
            )
        else:
            out_video = None
        
        # Réinitialiser les données d'émotions
        self.emotions_data = {
            'timestamp': [],
            'joie': [],
            'tristesse': [],
            'colere': [],
            'surprise': [],
            'peur': [],
            'degout': [],
            'neutre': [],
            'confiance': [],
            'attention': [],
            'engagement': []
        }
        
        # Initialiser les métriques
        self.last_head_pos = None
        self.head_movement_count = 0
        self.blink_count = 0
        self.last_blink_time = 0
        
        # Traiter la vidéo frame par frame
        frame_count = 0
        start_time = time.time()
        
        while frame_count < total_frames:
            ret, frame = video.read()
            if not ret:
                break
                
            # Calculer le timestamp
            timestamp = frame_count / fps
            
            # Analyser la frame
            frame_annotee, metriques = self.analyser_frame(frame, timestamp)
            
            # Enregistrer la frame annotée si nécessaire
            if out_video:
                out_video.write(frame_annotee)
            
            # Afficher la progression
            if frame_count % 30 == 0:
                pct_complete = (frame_count / total_frames) * 100
                print(f"Analyse en cours: {pct_complete:.1f}% ({frame_count}/{total_frames})")
            
            frame_count += 1
            
            # Sortir si on a atteint le maximum de frames
            if max_frames and frame_count >= max_frames:
                break
        
        # Libérer les ressources
        video.release()
        if out_video:
            out_video.release()
        
        # Calculer le temps écoulé
        duree_analyse = time.time() - start_time
        
        # Générer l'analyse complète
        self._generer_analyse_complete(duree_analyse, total_frames, fps)
        
        # Enregistrer les résultats
        self._enregistrer_resultats(video_path)
        
        return self.analyse_complete
    
    def _generer_analyse_complete(self, duree_analyse, total_frames, fps):
        """
        Génère l'analyse complète à partir des données collectées.
        
        Args:
            duree_analyse (float): Durée de l'analyse en secondes
            total_frames (int): Nombre total de frames analysées
            fps (float): Frames par seconde de la vidéo
        """
        # Durée totale de la vidéo
        duree_video = total_frames / fps
        self.analyse_complete['duree_totale'] = duree_video
        
        # Trouver l'émotion dominante
        if len(self.emotions_data['timestamp']) > 0:
            emotions_moyennes = {}
            for emotion in ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout', 'neutre']:
                if emotion in self.emotions_data and len(self.emotions_data[emotion]) > 0:
                    emotions_moyennes[emotion] = sum(self.emotions_data[emotion]) / len(self.emotions_data[emotion])
                else:
                    emotions_moyennes[emotion] = 0
                    
            self.analyse_complete['emotion_dominante'] = max(emotions_moyennes, key=emotions_moyennes.get)
            
            # Calculer le niveau d'engagement moyen
            if 'engagement' in self.emotions_data and len(self.emotions_data['engagement']) > 0:
                self.analyse_complete['niveau_engagement'] = sum(self.emotions_data['engagement']) / len(self.emotions_data['engagement'])
            
            # Calculer les variations d'attention
            if 'attention' in self.emotions_data and len(self.emotions_data['attention']) > 2:
                variations = 0
                prev_attention = self.emotions_data['attention'][0]
                for att in self.emotions_data['attention'][1:]:
                    variations += abs(att - prev_attention)
                    prev_attention = att
                self.analyse_complete['variations_attention'] = variations / (len(self.emotions_data['attention']) - 1)
            
            # Identifier les moments clés (grands changements émotionnels)
            moments_cles = []
            if len(self.emotions_data['timestamp']) > 10:
                for i in range(10, len(self.emotions_data['timestamp'])):
                    # Calculer la différence d'émotions sur une fenêtre
                    emotion_diff = 0
                    for emotion in ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout']:
                        avg_before = sum(self.emotions_data[emotion][i-10:i]) / 10
                        current = self.emotions_data[emotion][i]
                        emotion_diff += abs(current - avg_before)
                    
                    # Si grand changement, enregistrer comme moment clé
                    if emotion_diff > 0.5:
                        emotion_dominante = max(
                            ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout', 'neutre'],
                            key=lambda e: self.emotions_data[e][i]
                        )
                        moments_cles.append({
                            'timestamp': self.emotions_data['timestamp'][i],
                            'emotion': emotion_dominante,
                            'intensite': self.emotions_data[emotion_dominante][i]
                        })
            
            # Limiter à 5 moments clés les plus significatifs
            moments_cles.sort(key=lambda x: x['intensite'], reverse=True)
            self.analyse_complete['moments_cles'] = moments_cles[:5]
            
            # Calculer un score global
            engagement = self.analyse_complete['niveau_engagement']
            attention_stable = 1.0 - self.analyse_complete['variations_attention']
            emotion_positive = emotions_moyennes.get('joie', 0) + emotions_moyennes.get('surprise', 0) * 0.5
            
            self.analyse_complete['score_global'] = (
                engagement * 0.4 +
                attention_stable * 0.3 +
                emotion_positive * 0.3
            )
            
            # Limiter le score entre 0 et 1
            self.analyse_complete['score_global'] = max(0.0, min(1.0, self.analyse_complete['score_global']))
    
    def _enregistrer_resultats(self, video_path):
        """
        Enregistre les résultats de l'analyse dans différents formats.
        
        Args:
            video_path (str): Chemin de la vidéo originale
        """
        # Créer un nom de base pour les fichiers de sortie
        base_name = os.path.splitext(os.path.basename(video_path))[0]
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        output_base = f"{self.output_dir}/{base_name}_{timestamp}"
        
        # Enregistrer les données brutes au format CSV
        if len(self.emotions_data['timestamp']) > 0:
            df = pd.DataFrame(self.emotions_data)
            df.to_csv(f"{output_base}_emotions_raw.csv", index=False)
            
            # Créer des graphiques
            self._generer_graphiques(df, output_base)
        
        # Enregistrer l'analyse complète au format JSON
        with open(f"{output_base}_analyse.json", 'w') as f:
            json.dump(self.analyse_complete, f, indent=4)
        
        # Créer un rapport textuel
        self._generer_rapport_texte(output_base)
        
        print(f"Résultats enregistrés dans {self.output_dir}")
    
    def _generer_graphiques(self, df, output_base):
        """
        Génère des graphiques d'analyse à partir des données.
        
        Args:
            df (DataFrame): Données d'émotions
            output_base (str): Chemin de base pour les fichiers de sortie
        """
        # Lisser les données pour les graphiques
        window_size = min(11, len(df) // 5)
        if window_size % 2 == 0:
            window_size += 1
        
        if len(df) > window_size:
            for col in ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout', 'neutre', 'attention', 'engagement']:
                if col in df.columns:
                    df[f'{col}_smooth'] = savgol_filter(df[col], window_size, 3)
        else:
            for col in ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout', 'neutre', 'attention', 'engagement']:
                if col in df.columns:
                    df[f'{col}_smooth'] = df[col]
        
        # Graphique des émotions
        plt.figure(figsize=(12, 6))
        for emotion in ['joie', 'tristesse', 'colere', 'surprise', 'peur', 'degout', 'neutre']:
            if f'{emotion}_smooth' in df.columns:
                plt.plot(df['timestamp'], df[f'{emotion}_smooth'], label=emotion)
        
        plt.title('Évolution des émotions pendant l\'entretien')
        plt.xlabel('Temps (secondes)')
        plt.ylabel('Intensité')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.savefig(f"{output_base}_emotions.png", dpi=300, bbox_inches='tight')
        
        # Graphique d'attention et engagement
        plt.figure(figsize=(12, 6))
        if 'attention_smooth' in df.columns:
            plt.plot(df['timestamp'], df['attention_smooth'], label='Attention', color='blue')
        if 'engagement_smooth' in df.columns:
            plt.plot(df['timestamp'], df['engagement_smooth'], label='Engagement', color='green')
        if 'confiance_smooth' in df.columns:
            plt.plot(df['timestamp'], df['confiance_smooth'], label='Confiance', color='red')
        
        plt.title('Attention, Engagement et Confiance pendant l\'entretien')
        plt.xlabel('Temps (secondes)')
        plt.ylabel('Niveau')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.savefig(f"{output_base}_attention_engagement.png", dpi=300, bbox_inches='tight')
        
        # Fermer toutes les figures pour libérer la mémoire
        plt.close('all')
    
    def _generer_rapport_texte(self, output_base):
        """
        Génère un rapport textuel de l'analyse.
        
        Args:
            output_base (str): Chemin de base pour les fichiers de sortie
        """
        rapport = f"""
        # Rapport d'analyse d'entretien vidéo
        
        Date d'analyse: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        
        ## Résumé
        
        - Durée totale: {self.analyse_complete['duree_totale']:.2f} secondes
        - Émotion dominante: {self.analyse_complete['emotion_dominante']}
        - Niveau d'engagement: {self.analyse_complete['niveau_engagement']:.2f}/1.0
        - Score global: {self.analyse_complete['score_global']:.2f}/1.0
        
        ## Moments clés
        
        """
        
        for moment in self.analyse_complete['moments_cles']:
            rapport += f"- À {moment['timestamp']:.1f}s: {moment['emotion']} (intensité: {moment['intensite']:.2f})\n"
        
        rapport += """
        ## Analyse détaillée
        
        ### Engagement et attention
        
        """
        
        rapport += f"- Niveau d'engagement moyen: {self.analyse_complete['niveau_engagement']:.2f}/1.0\n"
        rapport += f"- Variations d'attention: {self.analyse_complete['variations_attention']:.2f}\n"
        
        rapport += """
        ### Recommandations
        
        """
        
        # Ajouter des recommandations basées sur l'analyse
        if self.analyse_complete['niveau_engagement'] < 0.5:
            rapport += "- Améliorer l'engagement pendant l'entretien, montrer plus d'intérêt\n"
        
        if self.analyse_complete['variations_attention'] > 0.3:
            rapport += "- Maintenir une attention plus constante, éviter les distractions\n"
        
        emotion_dominante = self.analyse_complete['emotion_dominante']
        if emotion_dominante in ['tristesse', 'peur', 'colere']:
            rapport += f"- Travailler sur la gestion des émotions, particulièrement la {emotion_dominante}\n"
        
        if self.analyse_complete['score_global'] < 0.6:
            rapport += "- Pratiquer davantage les entretiens simulés pour améliorer la performance globale\n"
        
        # Enregistrer le rapport
        with open(f"{output_base}_rapport.md", 'w') as f:
            f.write(rapport)

# Classe pour le serveur Flask qui expose l'API d'analyse vidéo
class VideoAnalysisServer:
    def __init__(self, host='0.0.0.0', port=5002, upload_dir='uploads', results_dir='resultats'):
        self.app = Flask(__name__)
        self.host = host
        self.port = port
        self.upload_dir = upload_dir
        self.results_dir = results_dir
        
        # Créer les répertoires nécessaires
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.results_dir, exist_ok=True)
        
        # Initialiser l'analyseur vidéo
        self.analyzer = AnalyseVideoEntretien(output_dir=self.results_dir)
        
        # Configurer les routes
        self._setup_routes()
    
    def _setup_routes(self):
        @self.app.route('/analyze', methods=['POST'])
        def analyze_video():
            try:
                # Vérifier si un fichier a été envoyé
                if 'video' not in request.files:
                    return jsonify({'error': 'No video file provided'}), 400
                
                video_file = request.files['video']
                if video_file.filename == '':
                    return jsonify({'error': 'No video file selected'}), 400
                
                # Sauvegarder le fichier
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{video_file.filename}"
                filepath = os.path.join(self.upload_dir, filename)
                video_file.save(filepath)
                
                # Analyser la vidéo
                output_video_path = os.path.join(self.results_dir, f"analyzed_{filename}")
                results = self.analyzer.analyser_video(filepath, output_video_path)
                
                # Préparer la réponse
                response = {
                    'success': True,
                    'videoId': timestamp,
                    'results': results,
                    'analyzedVideoUrl': f"/video/{timestamp}"
                }
                
                return jsonify(response)
            
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/video/<video_id>', methods=['GET'])
        def get_video(video_id):
            try:
                # Trouver la vidéo analysée correspondant à l'ID
                for file in os.listdir(self.results_dir):
                    if file.startswith(f"analyzed_{video_id}"):
                        video_path = os.path.join(self.results_dir, file)
                        return send_file(video_path, mimetype='video/mp4')
                
                return jsonify({'error': 'Video not found'}), 404
            
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/results/<video_id>', methods=['GET'])
        def get_results(video_id):
            try:
                # Trouver les résultats correspondant à l'ID
                for file in os.listdir(self.results_dir):
                    if file.startswith(f"{video_id}") and file.endswith("_analyse.json"):
                        results_path = os.path.join(self.results_dir, file)
                        with open(results_path, 'r') as f:
                            results = json.load(f)
                        return jsonify(results)
                
                return jsonify({'error': 'Results not found'}), 404
            
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def start(self):
        self.app.run(host=self.host, port=self.port)

# Point d'entrée pour démarrer le serveur
if __name__ == "__main__":
    server = VideoAnalysisServer()
    server.start()
