import numpy as np
import pandas as pd
import pickle
import os
import json
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime, timedelta

# Dans une implémentation réelle, nous importerions ces bibliothèques
# import tensorflow as tf
# from tensorflow.keras.models import Sequential, load_model
# from tensorflow.keras.layers import Dense, LSTM, GRU, Dropout, BatchNormalization
# from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
# from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

class AttritionPredictor:
    """
    Classe pour prédire l'attrition et la rétention des employés
    en utilisant TensorFlow/Keras et scikit-learn
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialise le prédicteur d'attrition
        
        Args:
            model_path: Chemin vers le modèle pré-entraîné (optionnel)
        """
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.feature_names = [
            'tenure', 'age', 'salary', 'performance_score', 'satisfaction_score',
            'work_life_balance', 'relationship_with_manager', 'promotion_last_3_years',
            'training_hours_last_year', 'overtime_hours', 'project_count',
            'distance_from_home', 'stock_option_level', 'total_working_years',
            'years_at_company', 'years_in_current_role', 'years_since_last_promotion',
            'years_with_curr_manager'
        ]
        
        # Charger le modèle s'il existe
        if model_path and os.path.exists(model_path):
            try:
                # Dans une implémentation réelle, nous chargerions le modèle ici
                # self.model = load_model(model_path)
                pass
            except Exception as e:
                print(f"Erreur lors du chargement du modèle: {str(e)}")
    
    def preprocess_data(self, data: pd.DataFrame) -> np.ndarray:
        """
        Prétraite les données pour la prédiction
        
        Args:
            data: DataFrame contenant les données des employés
            
        Returns:
            Données prétraitées prêtes pour la prédiction
        """
        # Dans une implémentation réelle, nous prétraiterions les données ici
        # Simuler le prétraitement
        
        # S'assurer que toutes les colonnes nécessaires sont présentes
        for col in self.feature_names:
            if col not in data.columns:
                data[col] = 0  # Valeur par défaut
        
        # Sélectionner uniquement les colonnes nécessaires
        data = data[self.feature_names]
        
        # Simuler la normalisation
        # Dans une implémentation réelle, nous utiliserions le scaler
        # preprocessed_data = self.scaler.transform(data)
        preprocessed_data = data.values
        
        return preprocessed_data
    
    def train_model(self, data: pd.DataFrame, target_column: str = 'attrition') -> Dict[str, Any]:
        """
        Entraîne le modèle de prédiction d'attrition
        
        Args:
            data: DataFrame contenant les données d'entraînement
            target_column: Nom de la colonne cible
            
        Returns:
            Métriques d'évaluation du modèle
        """
        # Dans une implémentation réelle, nous entraînerions le modèle ici
        # Simuler l'entraînement
        
        # Simuler les métriques d'évaluation
        metrics = {
            'accuracy': 0.85,
            'precision': 0.82,
            'recall': 0.78,
            'f1_score': 0.80,
            'roc_auc': 0.88
        }
        
        return metrics
    
    def predict_attrition(self, employee_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Prédit l'attrition pour un ensemble d'employés
        
        Args:
            employee_data: DataFrame contenant les données des employés
            
        Returns:
            Prédictions d'attrition et facteurs de risque
        """
        # Dans une implémentation réelle, nous utiliserions le modèle pour prédire
        # Simuler les prédictions
        
        # Nombre d'employés
        n_employees = len(employee_data)
        
        # Simuler les prédictions individuelles
        predictions = []
        for i in range(n_employees):
            # Générer une prédiction aléatoire pour la démonstration
            attrition_risk = np.random.beta(2, 5)  # Distribution beta biaisée vers des valeurs plus faibles
            
            # Générer des facteurs de risque aléatoires
            risk_factors = {
                'compensation': np.random.uniform(0.1, 0.5),
                'work_life_balance': np.random.uniform(0.1, 0.5),
                'career_growth': np.random.uniform(0.1, 0.5),
                'job_satisfaction': np.random.uniform(0.1, 0.5),
                'relationship_with_manager': np.random.uniform(0.1, 0.5)
            }
            
            # Déterminer les principaux facteurs de risque
            top_factors = sorted(risk_factors.items(), key=lambda x: x[1], reverse=True)[:2]
            top_factors = [factor[0] for factor in top_factors]
            
            # Générer une prédiction de durée avant départ (en mois)
            if attrition_risk > 0.3:
                time_to_leave = np.random.randint(1, 12)
            elif attrition_risk > 0.2:
                time_to_leave = np.random.randint(12, 24)
            else:
                time_to_leave = np.random.randint(24, 60)
            
            # Ajouter la prédiction
            predictions.append({
                'employee_id': employee_data.iloc[i].get('id', i),
                'attrition_risk': round(attrition_risk, 2),
                'risk_factors': {k: round(v, 2) for k, v in risk_factors.items()},
                'top_risk_factors': top_factors,
                'estimated_time_to_leave': time_to_leave,
                'retention_probability': round(1 - attrition_risk, 2)
            })
        
        # Calculer les statistiques globales
        overall_attrition_risk = np.mean([p['attrition_risk'] for p in predictions])
        
        # Calculer l'attrition par département
        departments = employee_data.get('department', pd.Series(['unknown'] * n_employees))
        department_attrition = {}
        for dept in departments.unique():
            dept_indices = departments == dept
            if sum(dept_indices) > 0:
                dept_risk = np.mean([p['attrition_risk'] for i, p in enumerate(predictions) if dept_indices.iloc[i]])
                department_attrition[dept] = round(dept_risk, 2)
        
        # Générer des stratégies de rétention personnalisées
        retention_strategies = self._generate_retention_strategies(predictions)
        
        return {
            'overall_attrition_risk': round(overall_attrition_risk, 2),
            'individual_predictions': predictions,
            'department_attrition': department_attrition,
            'retention_strategies': retention_strategies,
            'retention_score': round((1 - overall_attrition_risk) * 100),
            'prediction_timestamp': datetime.now().isoformat()
        }
    
    def predict_future_attrition(self, employee_data: pd.DataFrame, months: int = 12) -> Dict[str, Any]:
        """
        Prédit l'attrition future sur une période donnée
        
        Args:
            employee_data: DataFrame contenant les données des employés
            months: Nombre de mois pour la prédiction
            
        Returns:
            Prédictions d'attrition future
        """
        # Dans une implémentation réelle, nous utiliserions le modèle pour prédire
        # Simuler les prédictions
        
        # Obtenir les prédictions individuelles
        predictions = self.predict_attrition(employee_data)
        individual_predictions = predictions['individual_predictions']
        
        # Calculer les prédictions mensuelles
        monthly_predictions = []
        current_employees = len(individual_predictions)
        
        for month in range(1, months + 1):
            # Calculer le nombre d'employés qui quitteront ce mois
            leavers_this_month = sum(1 for p in individual_predictions 
                                    if p['estimated_time_to_leave'] == month)
            
            # Mettre à jour le nombre d'employés
            current_employees -= leavers_this_month
            
            # Calculer le taux d'attrition pour ce mois
            attrition_rate = leavers_this_month / len(individual_predictions) if individual_predictions else 0
            
            # Ajouter la prédiction mensuelle
            monthly_predictions.append({
                'month': month,
                'date': (datetime.now() + timedelta(days=30 * month)).strftime('%Y-%m'),
                'attrition_rate': round(attrition_rate, 3),
                'remaining_employees': current_employees,
                'leavers': leavers_this_month
            })
        
        # Calculer le coût estimé de l'attrition
        avg_salary = employee_data.get('salary', pd.Series([50000] * len(employee_data))).mean()
        total_leavers = sum(mp['leavers'] for mp in monthly_predictions)
        cost_per_leaver = avg_salary * 1.5  # Estimation du coût de remplacement (1.5x le salaire)
        total_cost = total_leavers * cost_per_leaver
        
        return {
            'monthly_predictions': monthly_predictions,
            'total_predicted_leavers': total_leavers,
            'attrition_percentage': round(total_leavers / len(individual_predictions) * 100, 1) if individual_predictions else 0,
            'estimated_cost': round(total_cost, 2),
            'prediction_period_months': months
        }
    
    def _generate_retention_strategies(self, predictions: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """
        Génère des stratégies de rétention personnalisées basées sur les prédictions
        
        Args:
            predictions: Liste des prédictions individuelles
            
        Returns:
            Stratégies de rétention par catégorie
        """
        # Compter les facteurs de risque principaux
        risk_factor_counts = {}
        for p in predictions:
            for factor in p['top_risk_factors']:
                risk_factor_counts[factor] = risk_factor_counts.get(factor, 0) + 1
        
        # Trier les facteurs de risque par fréquence
        top_risk_factors = sorted(risk_factor_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Générer des stratégies de rétention pour chaque catégorie
        strategies = {
            'compensation': [
                "Revoir la politique de rémunération et d'avantages sociaux",
                "Mettre en place un programme de bonus basé sur la performance",
                "Offrir des avantages non-monétaires (télétravail, horaires flexibles)",
                "Développer un plan d'intéressement à long terme"
            ],
            'work_life_balance': [
                "Améliorer l'équilibre vie professionnelle/personnelle",
                "Mettre en place des horaires flexibles",
                "Offrir des jours de congé supplémentaires",
                "Limiter les heures supplémentaires et les emails en dehors des heures de travail"
            ],
            'career_growth': [
                "Mettre en place des programmes de développement de carrière",
                "Créer des parcours de progression clairs",
                "Offrir des formations et certifications",
                "Mettre en place un programme de mentorat"
            ],
            'job_satisfaction': [
                "Renforcer la culture d'entreprise et la reconnaissance",
                "Améliorer l'environnement de travail",
                "Mettre en place des enquêtes régulières de satisfaction",
                "Impliquer les employés dans les décisions"
            ],
            'relationship_with_manager': [
                "Former les managers aux techniques de leadership inclusif",
                "Mettre en place des réunions régulières de feedback",
                "Développer les compétences en communication des managers",
                "Créer un programme de développement du leadership"
            ]
        }
        
        # Sélectionner les stratégies les plus pertinentes
        selected_strategies = {}
        for factor, _ in top_risk_factors:
            if factor in strategies:
                selected_strategies[factor] = strategies[factor]
        
        # Ajouter des stratégies générales
        selected_strategies['general'] = [
            "Améliorer le processus d'intégration des nouveaux employés",
            "Mettre en place un programme de reconnaissance des employés",
            "Créer une culture de feedback continu",
            "Développer un sentiment d'appartenance et de mission"
        ]
        
        return selected_strategies
