import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score
from prophet import Prophet
import joblib
import os
import json
import logging
from datetime import datetime, timedelta

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CostPredictor:
    def __init__(self):
        self.regression_model = None
        self.prophet_model = None
        self.scaler = StandardScaler()
        self.preprocessor = None
        self.models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(self.models_dir, exist_ok=True)
        
    def _prepare_data(self, data):
        """Prépare les données pour l'entraînement ou la prédiction"""
        df = pd.DataFrame(data)
        
        # Vérification des colonnes requises
        required_columns = ['channel', 'source', 'location', 'position_level', 'department', 'cost']
        for col in required_columns:
            if col not in df.columns:
                raise ValueError(f"La colonne '{col}' est requise mais n'est pas présente dans les données")
        
        return df
    
    def _create_preprocessor(self, df):
        """Crée un préprocesseur pour transformer les données catégorielles et numériques"""
        categorical_features = ['channel', 'source', 'location', 'position_level', 'department']
        categorical_transformer = OneHotEncoder(handle_unknown='ignore')
        
        numerical_features = [col for col in df.columns if col not in categorical_features + ['cost']]
        numerical_transformer = StandardScaler()
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('cat', categorical_transformer, categorical_features),
                ('num', numerical_transformer, numerical_features)
            ])
        
        return self.preprocessor
    
    def train_regression_model(self, training_data, model_type='random_forest'):
        """Entraîne un modèle de régression pour prédire les coûts de recrutement"""
        try:
            df = self._prepare_data(training_data)
            
            # Séparation des features et de la cible
            X = df.drop('cost', axis=1)
            y = df['cost']
            
            # Création du préprocesseur
            preprocessor = self._create_preprocessor(df)
            
            # Sélection du modèle
            if model_type == 'linear':
                model = LinearRegression()
            elif model_type == 'ridge':
                model = Ridge(alpha=1.0)
            elif model_type == 'lasso':
                model = Lasso(alpha=0.1)
            elif model_type == 'gradient_boosting':
                model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3)
            else:  # default: random_forest
                model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
            
            # Création du pipeline
            self.regression_model = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('regressor', model)
            ])
            
            # Entraînement du modèle
            self.regression_model.fit(X, y)
            
            # Évaluation du modèle
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            self.regression_model.fit(X_train, y_train)
            y_pred = self.regression_model.predict(X_test)
            
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Sauvegarde du modèle
            model_path = os.path.join(self.models_dir, f'regression_model_{model_type}.pkl')
            joblib.dump(self.regression_model, model_path)
            
            logger.info(f"Modèle de régression entraîné et sauvegardé avec succès. MSE: {mse}, R²: {r2}")
            
            return {
                'success': True,
                'metrics': {
                    'mse': mse,
                    'r2': r2
                },
                'model_type': model_type
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle de régression: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def train_prophet_model(self, time_series_data):
        """Entraîne un modèle Prophet pour les prévisions temporelles des coûts"""
        try:
            # Conversion en DataFrame
            df = pd.DataFrame(time_series_data)
            
            # Vérification des colonnes requises
            if 'date' not in df.columns or 'cost' not in df.columns:
                raise ValueError("Les colonnes 'date' et 'cost' sont requises")
            
            # Préparation des données pour Prophet
            prophet_df = df.rename(columns={'date': 'ds', 'cost': 'y'})
            
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
            self.prophet_model.fit(prophet_df)
            
            # Sauvegarde du modèle
            model_path = os.path.join(self.models_dir, 'prophet_model.pkl')
            with open(model_path, 'wb') as f:
                joblib.dump(self.prophet_model, f)
            
            logger.info("Modèle Prophet entraîné et sauvegardé avec succès")
            
            return {
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement du modèle Prophet: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def load_regression_model(self, model_type='random_forest'):
        """Charge un modèle de régression préentraîné"""
        try:
            model_path = os.path.join(self.models_dir, f'regression_model_{model_type}.pkl')
            self.regression_model = joblib.load(model_path)
            logger.info(f"Modèle de régression '{model_type}' chargé avec succès")
            return True
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle de régression: {str(e)}")
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
    
    def predict_cost(self, recruitment_data, model_type='random_forest'):
        """Prédit le coût d'un recrutement en fonction des caractéristiques fournies"""
        try:
            # Chargement du modèle si nécessaire
            if self.regression_model is None:
                success = self.load_regression_model(model_type)
                if not success:
                    # Si le modèle n'existe pas, on utilise un modèle par défaut
                    dummy_data = self._generate_dummy_training_data()
                    self.train_regression_model(dummy_data, model_type)
            
            # Préparation des données
            df = pd.DataFrame([recruitment_data])
            
            # Prédiction
            predicted_cost = self.regression_model.predict(df)[0]
            
            # Calcul de l'intervalle de confiance (simulation)
            confidence_interval = {
                'lower': max(0, predicted_cost * 0.85),
                'upper': predicted_cost * 1.15
            }
            
            # Facteurs d'influence (simulation)
            influence_factors = self._calculate_influence_factors(recruitment_data)
            
            return {
                'predicted_cost': float(predicted_cost),
                'confidence_interval': confidence_interval,
                'influence_factors': influence_factors
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction du coût: {str(e)}")
            return {
                'error': str(e)
            }
    
    def forecast_costs(self, historical_data=None, periods=12, freq='M'):
        """Génère des prévisions de coûts pour les périodes futures"""
        try:
            # Chargement du modèle si nécessaire
            if self.prophet_model is None:
                success = self.load_prophet_model()
                if not success:
                    # Si le modèle n'existe pas, on utilise des données simulées
                    if historical_data is None:
                        historical_data = self._generate_dummy_time_series()
                    self.train_prophet_model(historical_data)
            
            # Création du dataframe futur
            future = self.prophet_model.make_future_dataframe(periods=periods, freq=freq)
            
            # Génération des prévisions
            forecast = self.prophet_model.predict(future)
            
            # Formatage des résultats
            result_df = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
            result_df['ds'] = result_df['ds'].dt.strftime('%Y-%m-%d')
            
            # Conversion en format JSON
            forecast_result = result_df.to_dict(orient='records')
            
            # Ajout de métriques supplémentaires
            total_cost = sum([item['yhat'] for item in forecast_result])
            avg_cost = total_cost / len(forecast_result)
            
            return {
                'forecast': forecast_result,
                'total_cost': float(total_cost),
                'average_cost': float(avg_cost),
                'forecast_period': {
                    'periods': periods,
                    'frequency': freq
                }
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération des prévisions: {str(e)}")
            return {
                'error': str(e)
            }
    
    def analyze_channels(self, channel_data=None):
        """Analyse l'efficacité des différents canaux de recrutement"""
        try:
            # Si aucune donnée n'est fournie, utiliser des données simulées
            if channel_data is None:
                channel_data = self._generate_dummy_channel_data()
            
            # Conversion en DataFrame
            df = pd.DataFrame(channel_data)
            
            # Calcul des métriques par canal
            channel_metrics = []
            for channel, group in df.groupby('channel'):
                avg_cost = group['cost'].mean()
                avg_time = group['time_to_hire'].mean() if 'time_to_hire' in group.columns else None
                success_rate = group['success'].mean() if 'success' in group.columns else None
                
                roi = None
                if 'value' in group.columns and avg_cost > 0:
                    avg_value = group['value'].mean()
                    roi = (avg_value - avg_cost) / avg_cost
                
                channel_metrics.append({
                    'channel': channel,
                    'avg_cost': float(avg_cost),
                    'avg_time_to_hire': float(avg_time) if avg_time is not None else None,
                    'success_rate': float(success_rate) if success_rate is not None else None,
                    'roi': float(roi) if roi is not None else None,
                    'volume': len(group)
                })
            
            # Tri par coût moyen
            channel_metrics.sort(key=lambda x: x['avg_cost'])
            
            # Recommandations basées sur les métriques
            recommendations = self._generate_channel_recommendations(channel_metrics)
            
            # Optimisation du budget
            budget_optimization = self._optimize_channel_budget(channel_metrics)
            
            return {
                'channel_metrics': channel_metrics,
                'recommendations': recommendations,
                'budget_optimization': budget_optimization
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'analyse des canaux: {str(e)}")
            return {
                'error': str(e)
            }
    
    def _calculate_influence_factors(self, recruitment_data):
        """Calcule les facteurs qui influencent le coût de recrutement"""
        # Simulation des facteurs d'influence
        factors = {
            'channel': {
                'impact': np.random.uniform(0.1, 0.4),
                'description': f"Le canal '{recruitment_data.get('channel', 'inconnu')}' a un impact significatif sur le coût."
            },
            'position_level': {
                'impact': np.random.uniform(0.2, 0.5),
                'description': f"Le niveau de poste '{recruitment_data.get('position_level', 'inconnu')}' influence fortement le coût."
            },
            'location': {
                'impact': np.random.uniform(0.1, 0.3),
                'description': f"La localisation '{recruitment_data.get('location', 'inconnue')}' a un impact modéré sur le coût."
            },
            'department': {
                'impact': np.random.uniform(0.05, 0.2),
                'description': f"Le département '{recruitment_data.get('department', 'inconnu')}' a un impact mineur sur le coût."
            }
        }
        
        # Tri par impact décroissant
        sorted_factors = sorted(factors.items(), key=lambda x: x[1]['impact'], reverse=True)
        return {k: v for k, v in sorted_factors}
    
    def _generate_channel_recommendations(self, channel_metrics):
        """Génère des recommandations basées sur l'analyse des canaux"""
        recommendations = []
        
        # Identification du canal le plus rentable
        if any(cm.get('roi') is not None for cm in channel_metrics):
            best_roi_channel = max([cm for cm in channel_metrics if cm.get('roi') is not None], 
                                  key=lambda x: x['roi'])
            recommendations.append({
                'type': 'increase_investment',
                'channel': best_roi_channel['channel'],
                'reason': f"Ce canal offre le meilleur ROI ({best_roi_channel['roi']:.2f})."
            })
        
        # Identification du canal le moins cher
        cheapest_channel = min(channel_metrics, key=lambda x: x['avg_cost'])
        recommendations.append({
            'type': 'cost_effective',
            'channel': cheapest_channel['channel'],
            'reason': f"Ce canal a le coût moyen le plus bas (€{cheapest_channel['avg_cost']:.2f})."
        })
        
        # Identification du canal le plus rapide
        time_channels = [cm for cm in channel_metrics if cm.get('avg_time_to_hire') is not None]
        if time_channels:
            fastest_channel = min(time_channels, key=lambda x: x['avg_time_to_hire'])
            recommendations.append({
                'type': 'time_effective',
                'channel': fastest_channel['channel'],
                'reason': f"Ce canal a le temps de recrutement le plus court ({fastest_channel['avg_time_to_hire']:.1f} jours)."
            })
        
        # Identification du canal avec le meilleur taux de succès
        success_channels = [cm for cm in channel_metrics if cm.get('success_rate') is not None]
        if success_channels:
            most_successful_channel = max(success_channels, key=lambda x: x['success_rate'])
            recommendations.append({
                'type': 'most_successful',
                'channel': most_successful_channel['channel'],
                'reason': f"Ce canal a le taux de succès le plus élevé ({most_successful_channel['success_rate']*100:.1f}%)."
            })
        
        return recommendations
    
    def _optimize_channel_budget(self, channel_metrics):
        """Optimise la répartition du budget entre les différents canaux"""
        # Calcul du budget total actuel (simulation)
        total_budget = sum([cm['avg_cost'] * cm['volume'] for cm in channel_metrics])
        
        # Calcul de l'efficacité de chaque canal
        for cm in channel_metrics:
            # Score d'efficacité basé sur le coût, le temps et le taux de succès
            efficiency_score = 0
            
            # Inverse du coût (plus c'est bas, mieux c'est)
            if cm['avg_cost'] > 0:
                efficiency_score += 1 / cm['avg_cost']
            
            # Inverse du temps (plus c'est rapide, mieux c'est)
            if cm.get('avg_time_to_hire') is not None and cm['avg_time_to_hire'] > 0:
                efficiency_score += 1 / cm['avg_time_to_hire']
            
            # Taux de succès (plus c'est élevé, mieux c'est)
            if cm.get('success_rate') is not None:
                efficiency_score += cm['success_rate']
            
            # ROI (plus c'est élevé, mieux c'est)
            if cm.get('roi') is not None and cm['roi'] > 0:
                efficiency_score += cm['roi']
            
            cm['efficiency_score'] = efficiency_score
        
        # Normalisation des scores d'efficacité
        max_score = max([cm['efficiency_score'] for cm in channel_metrics])
        for cm in channel_metrics:
            cm['normalized_efficiency'] = cm['efficiency_score'] / max_score
        
        # Calcul de la nouvelle répartition du budget
        total_efficiency = sum([cm['normalized_efficiency'] for cm in channel_metrics])
        
        optimized_budget = []
        for cm in channel_metrics:
            # Allocation proportionnelle à l'efficacité
            budget_share = (cm['normalized_efficiency'] / total_efficiency)
            new_budget = total_budget * budget_share
            
            # Calcul de la variation par rapport au budget actuel
            current_budget = cm['avg_cost'] * cm['volume']
            budget_change = new_budget - current_budget
            budget_change_pct = (budget_change / current_budget) * 100 if current_budget > 0 else 0
            
            optimized_budget.append({
                'channel': cm['channel'],
                'current_budget': float(current_budget),
                'optimized_budget': float(new_budget),
                'budget_change': float(budget_change),
                'budget_change_pct': float(budget_change_pct)
            })
        
        # Tri par variation de budget décroissante
        optimized_budget.sort(key=lambda x: x['budget_change_pct'], reverse=True)
        
        return {
            'total_budget': float(total_budget),
            'channel_allocation': optimized_budget
        }
    
    def _generate_dummy_training_data(self, n_samples=100):
        """Génère des données d'entraînement simulées pour la démonstration"""
        channels = ['LinkedIn', 'Indeed', 'Référencement', 'Site carrière', 'Agence de recrutement']
        sources = ['Recherche active', 'Application spontanée', 'Recommandation', 'Chasseur de têtes']
        locations = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Remote']
        position_levels = ['Junior', 'Intermédiaire', 'Senior', 'Manager', 'Directeur']
        departments = ['Ingénierie', 'Marketing', 'Ventes', 'Produit', 'Finance', 'RH']
        
        data = []
        for _ in range(n_samples):
            channel = np.random.choice(channels)
            source = np.random.choice(sources)
            location = np.random.choice(locations)
            position_level = np.random.choice(position_levels)
            department = np.random.choice(departments)
            
            # Simulation des coûts en fonction des caractéristiques
            base_cost = 1000
            
            # Ajustement par canal
            channel_multipliers = {
                'LinkedIn': 1.2,
                'Indeed': 0.8,
                'Référencement': 0.5,
                'Site carrière': 0.3,
                'Agence de recrutement': 2.5
            }
            
            # Ajustement par niveau de poste
            level_multipliers = {
                'Junior': 0.7,
                'Intermédiaire': 1.0,
                'Senior': 1.5,
                'Manager': 2.0,
                'Directeur': 3.0
            }
            
            # Calcul du coût
            cost = base_cost * channel_multipliers[channel] * level_multipliers[position_level]
            
            # Ajout de bruit aléatoire
            cost *= np.random.uniform(0.8, 1.2)
            
            data.append({
                'channel': channel,
                'source': source,
                'location': location,
                'position_level': position_level,
                'department': department,
                'cost': cost
            })
        
        return data
    
    def _generate_dummy_time_series(self, n_periods=36):
        """Génère des données temporelles simulées pour la démonstration"""
        # Dates mensuelles sur 3 ans
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30*n_periods)
        dates = pd.date_range(start=start_date, end=end_date, freq='M')
        
        # Coûts de base avec tendance croissante
        base_costs = np.linspace(5000, 8000, n_periods)
        
        # Ajout de saisonnalité
        seasonality = 1000 * np.sin(np.linspace(0, 2*np.pi*3, n_periods))
        
        # Ajout de bruit aléatoire
        noise = np.random.normal(0, 500, n_periods)
        
        # Calcul des coûts finaux
        costs = base_costs + seasonality + noise
        
        # Création du DataFrame
        data = []
        for i, date in enumerate(dates):
            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'cost': max(0, costs[i])
            })
        
        return data
    
    def _generate_dummy_channel_data(self, n_samples=200):
        """Génère des données simulées sur les canaux de recrutement"""
        channels = ['LinkedIn', 'Indeed', 'Référencement', 'Site carrière', 'Agence de recrutement']
        
        # Caractéristiques simulées par canal
        channel_costs = {
            'LinkedIn': (800, 1500),
            'Indeed': (500, 1200),
            'Référencement': (200, 800),
            'Site carrière': (100, 500),
            'Agence de recrutement': (2000, 4000)
        }
        
        channel_times = {
            'LinkedIn': (20, 40),
            'Indeed': (25, 45),
            'Référencement': (15, 30),
            'Site carrière': (30, 60),
            'Agence de recrutement': (15, 35)
        }
        
        channel_success = {
            'LinkedIn': 0.75,
            'Indeed': 0.65,
            'Référencement': 0.85,
            'Site carrière': 0.60,
            'Agence de recrutement': 0.80
        }
        
        data = []
        for _ in range(n_samples):
            channel = np.random.choice(channels)
            
            # Coût
            cost_min, cost_max = channel_costs[channel]
            cost = np.random.uniform(cost_min, cost_max)
            
            # Temps de recrutement
            time_min, time_max = channel_times[channel]
            time_to_hire = np.random.uniform(time_min, time_max)
            
            # Succès du recrutement
            success_prob = channel_success[channel]
            success = np.random.random() < success_prob
            
            # Valeur du recrutement (pour le ROI)
            base_value = 10000
            value = base_value * np.random.uniform(0.8, 1.5)
            
            data.append({
                'channel': channel,
                'cost': cost,
                'time_to_hire': time_to_hire,
                'success': success,
                'value': value if success else 0
            })
        
        return data
