import cv2
import mediapipe as mp
import numpy as np
import time
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
from tensorflow.keras.models import load_model
import tensorflow as tf
import logging

class VideoAnalyzer:
    def __init__(self):
        # Initialiser MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        self.mp_holistic = mp.solutions.holistic
        
        # Initialiser les détecteurs
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.holistic = self.mp_holistic.Holistic(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Charger les modèles de classification des émotions (pré-entraînés)
        try:
            self.emotion_model = load_model("models/emotion_model.h5")
            self.confidence_model = pickle.load(open("models/confidence_model.pkl", "rb"))
            self.models_loaded = True
        except:
            logging.warning("Modèles de classification non trouvés. L'analyse sera limitée.")
            self.models_loaded = False
        
        # Dictionnaire pour stocker les métriques d'analyse
        self.metrics = {
            "emotions": {},
            "eye_contact": 0,
            "head_movements": 0,
            "gestures": 0,
            "speech_pace": 0,
            "confidence_score": 0
        }
        
        # Variables pour le suivi
        self.frame_count = 0
        self.start_time = None
        self.emotion_history = []
        self.landmark_history = []
        
        # Définir les émotions
        self.emotions = ["Neutral", "Happy", "Sad", "Surprise", "Fear", "Disgust", "Anger"]
        
    def preprocess_frame(self, frame):
        """Prétraiter l'image pour l'analyse faciale"""
        # Convertir en RGB pour MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return rgb_frame
    
    def analyze_frame(self, frame):
        """Analyser une image individuelle"""
        if self.start_time is None:
            self.start_time = time.time()
            
        self.frame_count += 1
        
        # Prétraiter l'image
        rgb_frame = self.preprocess_frame(frame)
        
        # Détecter les repères du visage
        face_results = self.face_mesh.process(rgb_frame)
        holistic_results = self.holistic.process(rgb_frame)
        
        # Stocker les résultats pour l'affichage et l'analyse
        results = {
            "frame": frame.copy(),
            "face_landmarks": face_results.multi_face_landmarks,
            "pose_landmarks": holistic_results.pose_landmarks,
            "left_hand_landmarks": holistic_results.left_hand_landmarks,
            "right_hand_landmarks": holistic_results.right_hand_landmarks
        }
        
        # Analyser les émotions si un visage est détecté
        if face_results.multi_face_landmarks:
            self._analyze_emotions(frame, face_results.multi_face_landmarks[0])
            self._analyze_eye_contact(face_results.multi_face_landmarks[0])
            self._track_head_movements(face_results.multi_face_landmarks[0])
            
            # Sauvegarder les points de repère pour l'analyse temporelle
            landmarks = self._extract_face_landmarks(face_results.multi_face_landmarks[0])
            self.landmark_history.append(landmarks)
        
        # Analyser la gestuelle corporelle
        if holistic_results.pose_landmarks:
            self._analyze_gestures(holistic_results.pose_landmarks)
        
        return results
    
    def _extract_face_landmarks(self, landmarks):
        """Extraire les points de repère du visage sous forme de tableau numpy"""
        points = []
        for landmark in landmarks.landmark:
            points.append([landmark.x, landmark.y, landmark.z])
        return np.array(points)
    
    def _analyze_emotions(self, frame, landmarks):
        """Analyser les émotions à partir des repères du visage"""
        # Si le modèle d'émotion est chargé, l'utiliser
        if self.models_loaded:
            # Extraire la région du visage
            h, w, _ = frame.shape
            x_min, y_min, x_max, y_max = w, h, 0, 0
            
            for landmark in landmarks.landmark:
                x, y = int(landmark.x * w), int(landmark.y * h)
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)
            
            # Ajouter une marge
            margin = 20
            x_min = max(0, x_min - margin)
            y_min = max(0, y_min - margin)
            x_max = min(w, x_max + margin)
            y_max = min(h, y_max + margin)
            
            # Extraire le visage
            face = frame[y_min:y_max, x_min:x_max]
            
            if face.size > 0:  # Vérifier que le visage est bien extrait
                # Redimensionner pour le modèle
                face = cv2.resize(face, (48, 48))
                face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
                face = face / 255.0  # Normaliser
                face = np.expand_dims(face, axis=0)
                face = np.expand_dims(face, axis=-1)
                
                # Prédire l'émotion
                predictions = self.emotion_model.predict(face)[0]
                emotion_index = np.argmax(predictions)
                emotion = self.emotions[emotion_index]
                
                # Mettre à jour l'historique des émotions
                self.emotion_history.append(emotion)
                
                # Mettre à jour les métriques
                if emotion not in self.metrics["emotions"]:
                    self.metrics["emotions"][emotion] = 0
                self.metrics["emotions"][emotion] += 1
        else:
            # Analyse basique basée sur la géométrie du visage
            # (Simplifié pour l'exemple)
            points = self._extract_face_landmarks(landmarks)
            
            # Calculer des caractéristiques simples (distance entre les yeux, etc.)
            # Cette partie nécessiterait un modèle bien plus sophistiqué en pratique
            pass
    
    def _analyze_eye_contact(self, landmarks):
        """Analyser le contact visuel"""
        # Points des yeux (en utilisant MediaPipe Face Mesh)
        left_eye = [landmarks.landmark[33], landmarks.landmark[133]]  # Centres approximatifs des yeux
        right_eye = [landmarks.landmark[362], landmarks.landmark[263]]
        
        # Calculer la direction du regard (simplifié)
        left_pupil = np.mean([[p.x, p.y, p.z] for p in left_eye], axis=0)
        right_pupil = np.mean([[p.x, p.y, p.z] for p in right_eye], axis=0)
        
        # Calculer l'angle vertical approximatif (simplifié)
        gaze_y = (left_pupil[1] + right_pupil[1]) / 2
        
        # Un regard direct est généralement centré verticalement
        # Cette approximation est très simplifiée
        if 0.45 < gaze_y < 0.55:  # Regarder vers la caméra (valeurs approximatives)
            self.metrics["eye_contact"] += 1
    
    def _track_head_movements(self, landmarks):
        """Suivre les mouvements de la tête"""
        # Points clés pour le tracking de la tête
        nose_tip = landmarks.landmark[4]  # Bout du nez
        
        # Si nous avons un historique, calculer le mouvement
        if len(self.landmark_history) > 1:
            prev_landmarks = self.landmark_history[-2]
            current_landmarks = self._extract_face_landmarks(landmarks)
            
            # Calculer le mouvement du nez (indice 4 dans le modèle MediaPipe Face Mesh)
            prev_nose = prev_landmarks[4]
            current_nose = current_landmarks[4]
            
            # Distance euclidienne
            movement = np.sqrt(np.sum((current_nose - prev_nose)**2))
            
            # Un mouvement significatif est considéré au-delà d'un certain seuil
            if movement > 0.01:  # Seuil à ajuster
                self.metrics["head_movements"] += 1
    
    def _analyze_gestures(self, pose_landmarks):
        """Analyser les gestes et la posture corporelle"""
        # Extraire les points de repère des épaules et des mains
        landmarks = []
        for landmark in pose_landmarks.landmark:
            landmarks.append([landmark.x, landmark.y, landmark.z])
        landmarks = np.array(landmarks)
        
        # Indices des points d'intérêt (MediaPipe Pose)
        left_shoulder = landmarks[11]
        right_shoulder = landmarks[12]
        left_wrist = landmarks[15]
        right_wrist = landmarks[16]
        
        # Calculer le mouvement des mains par rapport aux épaules
        left_hand_movement = np.sqrt(np.sum((left_wrist - left_shoulder)**2))
        right_hand_movement = np.sqrt(np.sum((right_wrist - right_shoulder)**2))
        
        # Si les mains bougent significativement, compter comme un geste
        if left_hand_movement > 0.1 or right_hand_movement > 0.1:  # Seuil à ajuster
            self.metrics["gestures"] += 1
    
    def analyze_video(self, video_path, output_path=None):
        """Analyser une vidéo complète"""
        cap = cv2.VideoCapture(video_path)
        
        # Réinitialiser les métriques
        self.metrics = {
            "emotions": {},
            "eye_contact": 0,
            "head_movements": 0,
            "gestures": 0,
            "speech_pace": 0,
            "confidence_score": 0
        }
        self.frame_count = 0
        self.start_time = None
        self.emotion_history = []
        self.landmark_history = []
        
        # Configurer l'enregistreur vidéo si un chemin de sortie est fourni
        if output_path:
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Analyser l'image
            results = self.analyze_frame(frame)
            
            # Dessiner les résultats sur l'image
            annotated_frame = self._draw_results(results)
            
            # Enregistrer l'image annotée si nécessaire
            if output_path:
                out.write(annotated_frame)
        
        # Libérer les ressources
        cap.release()
        if output_path:
            out.release()
        
        # Calculer les métriques finales
        self._compute_final_metrics()
        
        return self.metrics
    
    def _draw_results(self, results):
        """Dessiner les résultats sur l'image"""
        frame = results["frame"]
        
        # Dessiner les repères du visage
        if results["face_landmarks"]:
            for face_landmarks in results["face_landmarks"]:
                self.mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=self.mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=self.mp_drawing_styles.get_default_face_mesh_tesselation_style()
                )
                
                # Dessiner le contour des yeux, des lèvres et des sourcils
                self.mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=self.mp_face_mesh.FACEMESH_CONTOURS,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=self.mp_drawing_styles.get_default_face_mesh_contours_style()
                )
        
        # Dessiner les repères de la pose
        if results["pose_landmarks"]:
            self.mp_drawing.draw_landmarks(
                frame,
                results["pose_landmarks"],
                self.mp_holistic.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style()
            )
        
        # Dessiner les émotions détectées
        if self.emotion_history and len(self.emotion_history) > 0:
            current_emotion = self.emotion_history[-1]
            cv2.putText(frame, f"Emotion: {current_emotion}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        return frame
    
    def _compute_final_metrics(self):
        """Calculer les métriques finales après l'analyse complète"""
        total_frames = max(1, self.frame_count)  # Éviter la division par zéro
        
        # Normaliser les métriques par le nombre de frames
        self.metrics["eye_contact"] = self.metrics["eye_contact"] / total_frames
        self.metrics["head_movements"] = self.metrics["head_movements"] / total_frames
        self.metrics["gestures"] = self.metrics["gestures"] / total_frames
        
        # Calculer la distribution des émotions
        total_emotions = sum(self.metrics["emotions"].values())
        if total_emotions > 0:
            for emotion in self.metrics["emotions"]:
                self.metrics["emotions"][emotion] = self.metrics["emotions"][emotion] / total_emotions
        
        # Calculer un score de confiance basé sur plusieurs métriques
        # (Ceci est une approche heuristique simplifiée)
        confidence_features = [
            self.metrics["eye_contact"],  # Plus de contact visuel = plus de confiance
            min(0.1, self.metrics["head_movements"]),  # Mouvements modérés de la tête = confiance
            self.metrics["gestures"],  # Plus de gestes expressifs = plus de confiance
            self.metrics["emotions"].get("Happy", 0),  # Plus d'expressions positives = plus de confiance
            1 - self.metrics["emotions"].get("Fear", 0) - self.metrics["emotions"].get("Sad", 0)  # Moins de peur/tristesse = plus de confiance
        ]
        
        # Utiliser le modèle de confiance s'il est chargé, sinon utiliser une heuristique
        if self.models_loaded:
            try:
                # Normaliser les caractéristiques
                features = np.array(confidence_features).reshape(1, -1)
                self.metrics["confidence_score"] = float(self.confidence_model.predict(features)[0])
            except:
                # Fallback si le modèle échoue
                self.metrics["confidence_score"] = sum(confidence_features) / len(confidence_features)
        else:
            # Moyenne simple des caractéristiques
            self.metrics["confidence_score"] = sum(confidence_features) / len(confidence_features)
        
        # Calculer le score global sur 100
        self.metrics["overall_score"] = int(self.metrics["confidence_score"] * 100)
        
        return self.metrics
    
    def generate_report(self, candidate_id, save_path=None):
        """Générer un rapport d'analyse"""
        # Créer un dataframe pour les émotions
        emotions_df = pd.DataFrame(list(self.metrics["emotions"].items()), 
                                 columns=["Emotion", "Percentage"])
        emotions_df["Percentage"] = emotions_df["Percentage"] * 100
        
        # Créer un rapport textuel
        report = f"""
        ## Rapport d'analyse vidéo de l'entretien - Candidat {candidate_id}
        
        ### Résumé
        - Score global: {self.metrics['overall_score']}/100
        - Contact visuel: {self.metrics['eye_contact']*100:.1f}%
        - Confiance estimée: {self.metrics['confidence_score']*100:.1f}%
        
        ### Émotions détectées
        {emotions_df.to_string(index=False)}
        
        ### Langage corporel
        - Mouvements de tête: {self.metrics['head_movements']*100:.1f}% des frames
        - Gestuelle: {self.metrics['gestures']*100:.1f}% des frames
        
        ### Recommandations
        """
        
        # Ajouter des recommandations basées sur les métriques
        if self.metrics["eye_contact"] < 0.5:
            report += "- Améliorer le contact visuel avec l'interlocuteur\n"
        
        if self.metrics["gestures"] < 0.3:
            report += "- Utiliser davantage de gestes pour renforcer le discours\n"
        
        if self.metrics["emotions"].get("Happy", 0) < 0.2:
            report += "- Montrer plus d'enthousiasme et de positivité\n"
            
        if self.metrics["confidence_score"] < 0.6:
            report += "- Travailler sur la confiance en soi et l'assurance\n"
        
        # Sauvegarder le rapport si un chemin est fourni
        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "w") as f:
                f.write(report)
        
        return report
