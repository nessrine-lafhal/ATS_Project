import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json
import os
from datetime import datetime, timedelta
import joblib
from sklearn.preprocessing import MinMaxScaler
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TalentForecaster:
    def __init__(self):
        self.prophet_model = None
        self.lstm_model = None
        self.scaler = MinMaxScaler()
        self.models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(self.models_dir, exist_ok=True)
        
    def _prepare_prophet_data(self, historical_data):
        """Prépare les données pour Prophet"""
        df = pd.DataFrame(historical_data)
        # Prophet requiert des colonnes 'ds' (date) et 'y' (valeur)
        df = df.rename(columns={'date': 'ds', 'value': 'y'})
        return df
    
    def _prepare_lstm_data(self, historical_data, sequence_length=12):
        """Prépare les données pour LSTM"""
        df = pd.DataFrame(historical_data)
        values = df['value'].values.reshape(-1, 1)
        scaled_values = self.scaler.fit_transform(values)
        
        X, y = [], []
        for i in range(len(scaled_values) - sequence_length):
            X.append(scaled_values[i:i+sequence_length])
            y.append(scaled_values[i+sequence_length])
        
        return np.array(X), np.array(y)
    
    def train_prophet_model(self, historical_data):
        """Entraîne un modèle Prophet pour les prévisions de recrutement"""
        try:
            df = self._prepare_prophet_data(historical_data)
            
            # Création et entraînement du modèle Prophet
            self.prophet_model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                seasonality_mode='multiplicative',
                changepoint_prior_scale=0.05
            )
            
            # Ajout de saisonnalités supplémentaires si nécessaire
            self.prophet_model.add_seasonality(name='quarterly', period=91.25, fourier_order=8)
            
            # Entraînement du modèle
            self.prophet_model.fit(df)
            
            # Sauvegarde du modèle
            model_path = os.path.join(self.models_dir, 'prophet_model.pkl')
            with open(model_path, 'wb') as f:
                joblib.dump(self.prophet_model, f)
            
            logger.info("Modèle Prophet entraîné et sauvegardé avec succès")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle Prophet: {str(e)}")
            return False
    
    def train_lstm_model(self, historical_data, epochs=50, batch_size=32):
        """Entraîne un modèle LSTM pour les prévisions de recrutement"""
        try:
            X, y = self._prepare_lstm_data(historical_data)
            
            # Création du modèle LSTM
            self.lstm_model = keras.Sequential([
                layers.LSTM(50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
                layers.Dropout(0.2),
                layers.LSTM(50, return_sequences=False),
                layers.Dropout(0.2),
                layers.Dense(1)
            ])
            
            # Compilation du modèle
            self.lstm_model.compile(optimizer='adam', loss='mean_squared_error')
            
            # Entraînement du modèle
            self.lstm_model.fit(
                X, y,
                epochs=epochs,
                batch_size=batch_size,
                validation_split=0.2,
                verbose=1
            )
            
            # Sauvegarde du modèle
            model_path = os.path.join(self.models_dir, 'lstm_model')
            self.lstm_model.save(model_path)
            
            # Sauvegarde du scaler
            scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
            with open(scaler_path, 'wb') as f:
                joblib.dump(self.scaler, f)
            
            logger.info("Modèle LSTM entraîné et sauvegardé avec succès")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle LSTM: {str(e)}")
            return False
    
    def load_prophet_model(self):
        """Charge un modèle Prophet préentraîné"""
        try:
            model_path = os.path.join(self.models_dir, 'prophet_model.pkl')
            with open(model_path, 'rb') as f:
                self.prophet_model = joblib.load(f)
            logger.info("Modèle Prophet chargé avec succès")
            return True
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle Prophet: {str(e)}")
            return False
    
    def load_lstm_model(self):
        """Charge un modèle LSTM préentraîné"""
        try:
            model_path = os.path.join(self.models_dir, 'lstm_model')
            self.lstm_model = keras.models.load_model(model_path)
            
            scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
            with open(scaler_path, 'rb') as f:
                self.scaler = joblib.load(f)
            
            logger.info("Modèle LSTM chargé avec succès")
            return True
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle LSTM: {str(e)}")
            return False
    
    def forecast_with_prophet(self, periods=12, freq='M', include_history=True):
        """Génère des prévisions avec Prophet"""
        try:
            if self.prophet_model is None:
                success = self.load_prophet_model()
                if not success:
                    raise Exception("Impossible de charger le modèle Prophet")
            
            # Création du dataframe futur
            future = self.prophet_model.make_future_dataframe(periods=periods, freq=freq)
            
            # Génération des prévisions
            forecast = self.prophet_model.predict(future)
            
            # Formatage des résultats
            if include_history:
                result_df = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
            else:
                result_df = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
            
            # Conversion en format JSON
            result_df['ds'] = result_df['ds'].dt.strftime('%Y-%m-%d')
            result = result_df.to_dict(orient='records')
            
            return result
        except Exception as e:
            logger.error(f"Erreur lors de la génération des prévisions avec Prophet: {str(e)}")
            return None
    
    def forecast_with_lstm(self, historical_data, periods=12):
        """Génère des prévisions avec LSTM"""
        try:
            if self.lstm_model is None:
                success = self.load_lstm_model()
                if not success:
                    raise Exception("Impossible de charger le modèle LSTM")
            
            # Préparation des données
            df = pd.DataFrame(historical_data)
            values = df['value'].values.reshape(-1, 1)
            scaled_values = self.scaler.transform(values)
            
            # Création de la séquence d'entrée
            sequence_length = 12  # Doit correspondre à la longueur utilisée lors de l'entraînement
            input_sequence = scaled_values[-sequence_length:].reshape(1, sequence_length, 1)
            
            # Prédictions
            predictions = []
            current_sequence = input_sequence.copy()
            
            for _ in range(periods):
                # Prédiction de la prochaine valeur
                next_pred = self.lstm_model.predict(current_sequence)[0]
                predictions.append(next_pred[0])
                
                # Mise à jour de la séquence d'entrée
                current_sequence = np.append(current_sequence[:, 1:, :], [[next_pred]], axis=1)
            
            # Inverse scaling pour obtenir les valeurs réelles
            predictions = np.array(predictions).reshape(-1, 1)
            predictions = self.scaler.inverse_transform(predictions)
            
            # Création des dates futures
            last_date = pd.to_datetime(df['date'].iloc[-1])
            future_dates = [last_date + timedelta(days=30*i) for i in range(1, periods+1)]
            future_dates = [date.strftime('%Y-%m-%d') for date in future_dates]
            
            # Formatage des résultats
            result = []
            for i, date in enumerate(future_dates):
                result.append({
                    'ds': date,
                    'yhat': float(predictions[i][0]),
                    'model': 'lstm'
                })
            
            return result
        except Exception as e:
            logger.error(f"Erreur lors de la génération des prévisions avec LSTM: {str(e)}")
            return None
    
    def generate_market_trends(self, job_categories, skills, timeframe=12):
        """Génère des tendances du marché du travail basées sur les données historiques et les prévisions"""
        try:
            # Simulation de tendances du marché pour les démonstrations
            # Dans une implémentation réelle, cela serait basé sur des données réelles et des prévisions
            
            trends = {
                "growing_roles": [],
                "declining_roles": [],
                "salary_trends": [],
                "skill_demand": []
            }
            
            # Rôles en croissance
            for category in job_categories[:4]:
                growth_rate = np.random.randint(15, 40)
                trends["growing_roles"].append({
                    "role": category,
                    "growthRate": growth_rate
                })
            
            # Rôles en déclin
            for category in job_categories[-3:]:
                decline_rate = -np.random.randint(5, 20)
                trends["declining_roles"].append({
                    "role": category,
                    "declineRate": decline_rate
                })
            
            # Tendances salariales
            for category in job_categories[:4]:
                current_avg = np.random.randint(40000, 70000)
                change_pct = np.random.randint(5, 15)
                projected_avg = int(current_avg * (1 + change_pct/100))
                
                trends["salary_trends"].append({
                    "role": category,
                    "currentAvg": current_avg,
                    "projectedAvg": projected_avg,
                    "change": change_pct
                })
            
            # Demande de compétences
            for skill in skills[:5]:
                demand_score = np.random.randint(75, 95)
                trends["skill_demand"].append({
                    "skill": skill,
                    "demandScore": demand_score
                })
            
            return trends
        except Exception as e:
            logger.error(f"Erreur lors de la génération des tendances du marché: {str(e)}")
            return None
    
    def generate_attrition_risk(self, departments):
        """Génère des prévisions de risque d'attrition par département"""
        try:
            # Simulation de risques d'attrition pour les démonstrations
            # Dans une implémentation réelle, cela serait basé sur des modèles prédictifs
            
            overall_risk = np.random.randint(10, 20)
            
            department_risks = []
            for dept in departments:
                rate = np.random.randint(10, 25)
                department_risks.append({
                    "department": dept,
                    "rate": rate
                })
            
            key_roles = [
                {"role": "Développeur Senior", "risk": "high", "count": np.random.randint(1, 5)},
                {"role": "Lead UX Designer", "risk": "medium", "count": np.random.randint(1, 3)},
                {"role": "Architecte Cloud", "risk": "high", "count": np.random.randint(1, 4)}
            ]
            
            return {
                "overall": overall_risk,
                "byDepartment": department_risks,
                "keyRoles": key_roles
            }
        except Exception as e:
            logger.error(f"Erreur lors de la génération des risques d'attrition: {str(e)}")
            return None
    
    def generate_recruitment_strategy(self, channels):
        """Génère des recommandations de stratégie de recrutement"""
        try:
            # Simulation de stratégies de recrutement pour les démonstrations
            # Dans une implémentation réelle, cela serait basé sur des données réelles et des modèles
            
            channel_effectiveness = []
            for channel in channels:
                effectiveness = np.random.randint(70, 95)
                cost_per_hire = np.random.randint(500, 2000)
                channel_effectiveness.append({
                    "channel": channel,
                    "effectiveness": effectiveness,
                    "costPerHire": cost_per_hire
                })
            
            current_time = np.random.randint(40, 60)
            improvement_pct = np.random.randint(10, 20)
            projected_time = int(current_time * (1 - improvement_pct/100))
            
            current_cost = np.random.randint(4000, 6000)
            projected_cost = int(current_cost * (1 - improvement_pct/100))
            
            return {
                "channels": channel_effectiveness,
                "timeToHire": {
                    "current": current_time,
                    "projected": projected_time,
                    "improvement": improvement_pct
                },
                "costReduction": {
                    "current": current_cost,
                    "projected": projected_cost,
                    "savings": improvement_pct
                }
            }
        except Exception as e:
            logger.error(f"Erreur lors de la génération des stratégies de recrutement: {str(e)}")
            return None
    
    def generate_comprehensive_forecast(self, historical_data=None, timeframe=12, department=None, growth_factor=15):
        """Génère une prévision complète des besoins en talents"""
        try:
            # Si aucune donnée historique n'est fournie, générer des données simulées
            if historical_data is None:
                # Génération de données simulées pour la démonstration
                dates = pd.date_range(end=datetime.now(), periods=36, freq='M')
                values = np.random.randint(5, 15, size=36)
                # Ajout d'une tendance et d'une saisonnalité
                trend = np.linspace(0, 5, 36)
                seasonality = 3 * np.sin(np.linspace(0, 6*np.pi, 36))
                values = values + trend + seasonality
                
                historical_data = []
                for i, date in enumerate(dates):
                    historical_data.append({
                        "date": date.strftime('%Y-%m-%d'),
                        "value": max(1, int(values[i]))
                    })
            
            # Génération des prévisions avec Prophet
            prophet_forecast = self.forecast_with_prophet(periods=timeframe, freq='M', include_history=False)
            
            # Génération des prévisions avec LSTM (si les données sont suffisantes)
            lstm_forecast = None
            if len(historical_data) >= 24:  # Besoin d'au moins 24 points de données pour LSTM
                lstm_forecast = self.forecast_with_lstm(historical_data, periods=timeframe)
            
            # Génération des tendances du marché
            job_categories = [
                "ML Engineer", "DevOps Engineer", "Data Engineer", "Cloud Architect",
                "Full Stack Developer", "UX Designer", "Product Manager", "Data Scientist",
                "Développeur PHP", "Administrateur Système", "Testeur QA Manuel"
            ]
            
            skills = [
                "Cloud (AWS/Azure/GCP)", "Machine Learning", "React/Angular", "DevOps/CI/CD",
                "Kubernetes", "Python", "JavaScript", "Data Science", "UX/UI Design"
            ]
            
            departments = [
                "Ingénierie", "Produit", "Marketing", "Ventes", "Design", "Support"
            ]
            
            channels = [
                "LinkedIn", "Indeed", "Référencement interne", "Événements tech", "Site carrière"
            ]
            
            market_trends = self.generate_market_trends(job_categories, skills, timeframe)
            attrition_risk = self.generate_attrition_risk(departments)
            recruitment_strategy = self.generate_recruitment_strategy(channels)
            
            # Calcul des besoins en recrutement par département et par rôle
            total_hiring_needs = sum([float(forecast["yhat"]) for forecast in prophet_forecast])
            
            # Répartition par département
            department_distribution = []
            department_percentages = [42, 18, 15, 12, 8, 5]  # Pourcentages simulés
            for i, dept in enumerate(departments):
                count = int(total_hiring_needs * department_percentages[i] / 100)
                department_distribution.append({
                    "department": dept,
                    "count": count
                })
            
            # Répartition par rôle
            role_distribution = []
            roles = ["Développeur Full Stack", "DevOps Engineer", "Product Manager", "UX Designer", 
                    "Marketing Digital", "Commercial", "Data Scientist"]
            role_percentages = [28, 14, 12, 7, 10, 19, 10]  # Pourcentages simulés
            
            for i, role in enumerate(roles):
                count = int(total_hiring_needs * role_percentages[i] / 100)
                role_distribution.append({
                    "role": role,
                    "count": count
                })
            
            # Répartition par trimestre
            quarterly_distribution = []
            quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"]
            quarter_percentages = [19, 28, 36, 17]  # Pourcentages simulés
            
            for i, quarter in enumerate(quarters):
                count = int(total_hiring_needs * quarter_percentages[i] / 100)
                quarterly_distribution.append({
                    "quarter": quarter,
                    "count": count
                })
            
            # Construction du résultat final
            result = {
                "hiringNeeds": {
                    "total": int(total_hiring_needs),
                    "byDepartment": department_distribution,
                    "byRole": role_distribution,
                    "byQuarter": quarterly_distribution,
                    "monthlyForecast": prophet_forecast
                },
                "marketTrends": market_trends,
                "attritionRisk": attrition_risk,
                "recruitmentStrategy": recruitment_strategy,
                "forecastMetadata": {
                    "timeframe": timeframe,
                    "department": department,
                    "growthFactor": growth_factor,
                    "generatedAt": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "modelUsed": "prophet" if lstm_forecast is None else "hybrid"
                }
            }
            
            return result
        except Exception as e:
            logger.error(f"Erreur lors de la génération de la prévision complète: {str(e)}")
            return None
    
    def generate_forecast_data(self, timeframe=12, department="all"):
        """Génère des données de prévision pour l'interface utilisateur"""
        try:
            # Génération de données simulées pour les graphiques
            
            # Besoins en recrutement mensuels
            hiring_needs = []
            months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
            base_values = [3, 2, 4, 5, 7, 6, 8, 5, 9, 11, 8, 6]
            
            for i, month in enumerate(months):
                hiring_needs.append({
                    "name": month,
                    "besoins": base_values[i]
                })
            
            # Distribution par département
            department_distribution = [
                {"name": "Ingénierie", "value": 42},
                {"name": "Marketing", "value": 18},
                {"name": "Ventes", "value": 15},
                {"name": "Produit", "value": 12},
                {"name": "Design", "value": 8},
                {"name": "Support", "value": 5}
            ]
            
            # Écarts de compétences
            skills_gap = [
                {"skill": "JavaScript", "actuel": 65, "requis": 85},
                {"skill": "Python", "actuel": 45, "requis": 70},
                {"skill": "React", "actuel": 55, "requis": 80},
                {"skill": "DevOps", "actuel": 30, "requis": 60},
                {"skill": "Data Science", "actuel": 25, "requis": 50},
                {"skill": "UX Design", "actuel": 40, "requis": 55}
            ]
            
            # Tendances du marché
            market_trends = [
                {"skill": "JavaScript", "demande": 85, "offre": 75, "z": 120},
                {"skill": "Python", "demande": 90, "offre": 60, "z": 150},
                {"skill": "React", "demande": 95, "offre": 70, "z": 180},
                {"skill": "DevOps", "demande": 80, "offre": 50, "z": 130},
                {"skill": "Data Science", "demande": 95, "offre": 40, "z": 200},
                {"skill": "UX Design", "demande": 75, "offre": 65, "z": 110}
            ]
            
            # Risques d'attrition
            attrition_risk = [
                {"name": "Ingénierie", "risque": 28},
                {"name": "Marketing", "risque": 15},
                {"name": "Ventes", "risque": 22},
                {"name": "Produit", "risque": 18},
                {"name": "Design", "risque": 12},
                {"name": "Support", "risque": 25}
            ]
            
            result = {
                "hiringNeeds": hiring_needs,
                "departmentDistribution": department_distribution,
                "skillsGap": skills_gap,
                "marketTrends": market_trends,
                "attritionRisk": attrition_risk
            }
            
            return result
        except Exception as e:
            logger.error(f"Erreur lors de la génération des données de prévision: {str(e)}")
            return None
