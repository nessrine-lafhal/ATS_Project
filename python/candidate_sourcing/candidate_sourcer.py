import requests
from bs4 import BeautifulSoup
import gensim
from gensim import corpora
from gensim.models import LdaModel, TfidfModel
from gensim.utils import simple_preprocess
import numpy as np
import re
import json
import time
import random
from typing import List, Dict, Any, Tuple, Optional
import logging
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Télécharger les ressources NLTK nécessaires
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CandidateSourcer:
    """
    Classe pour le sourcing automatisé de candidats à partir de différentes plateformes
    """
    
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        self.platforms = {
            'linkedin': {
                'enabled': True,
                'base_url': 'https://www.linkedin.com',
                'search_url': 'https://www.linkedin.com/search/results/people/',
                'headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            },
            'github': {
                'enabled': True,
                'base_url': 'https://github.com',
                'search_url': 'https://github.com/search?q=',
                'headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            },
            'stackoverflow': {
                'enabled': True,
                'base_url': 'https://stackoverflow.com',
                'search_url': 'https://stackoverflow.com/users?tab=reputation&filter=',
                'headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        }
        
        # Initialiser le modèle TF-IDF
        self.dictionary = None
        self.tfidf_model = None
        
    def preprocess_text(self, text: str) -> List[str]:
        """
        Prétraite le texte pour l'analyse
        """
        # Tokenisation et nettoyage
        tokens = word_tokenize(text.lower())
        # Supprimer les stopwords et les tokens courts
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens 
                 if token not in self.stop_words and len(token) > 2]
        return tokens
    
    def build_tfidf_model(self, documents: List[str]):
        """
        Construit un modèle TF-IDF à partir d'un corpus de documents
        """
        processed_docs = [self.preprocess_text(doc) for doc in documents]
        self.dictionary = corpora.Dictionary(processed_docs)
        corpus = [self.dictionary.doc2bow(doc) for doc in processed_docs]
        self.tfidf_model = TfidfModel(corpus)
        
    def get_document_similarity(self, doc1: str, doc2: str) -> float:
        """
        Calcule la similarité entre deux documents en utilisant TF-IDF et cosinus
        """
        if not self.dictionary or not self.tfidf_model:
            self.build_tfidf_model([doc1, doc2])
            
        vec1 = self.tfidf_model[self.dictionary.doc2bow(self.preprocess_text(doc1))]
        vec2 = self.tfidf_model[self.dictionary.doc2bow(self.preprocess_text(doc2))]
        
        # Convertir en vecteurs numpy pour calculer la similarité cosinus
        def sparse_to_dense(vec, size):
            dense = np.zeros(size)
            for idx, val in vec:
                dense[idx] = val
            return dense
        
        size = len(self.dictionary)
        vec1_dense = sparse_to_dense(vec1, size)
        vec2_dense = sparse_to_dense(vec2, size)
        
        # Calculer la similarité cosinus
        norm1 = np.linalg.norm(vec1_dense)
        norm2 = np.linalg.norm(vec2_dense)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return np.dot(vec1_dense, vec2_dense) / (norm1 * norm2)
    
    def search_candidates(self, job_description: str, skills: List[str], 
                          location: str = None, experience_level: str = None,
                          platforms: List[str] = None, max_results: int = 20) -> List[Dict[Any, Any]]:
        """
        Recherche des candidats correspondant aux critères spécifiés
        
        Note: Dans une implémentation réelle, cette fonction effectuerait des requêtes HTTP
        vers les API des plateformes ou ferait du web scraping. Pour cette simulation,
        nous générons des données fictives.
        """
        logger.info(f"Recherche de candidats avec les compétences: {skills}")
        
        if not platforms:
            platforms = [p for p, config in self.platforms.items() if config['enabled']]
        else:
            platforms = [p for p in platforms if p in self.platforms and self.platforms[p]['enabled']]
        
        if not platforms:
            logger.warning("Aucune plateforme activée pour la recherche")
            return []
        
        # Simulation de recherche de candidats
        candidates = []
        
        # Générer des candidats fictifs pour chaque plateforme
        for platform in platforms:
            platform_candidates = self._simulate_platform_search(
                platform, job_description, skills, location, experience_level, 
                max_results // len(platforms)
            )
            candidates.extend(platform_candidates)
        
        # Trier les candidats par score de correspondance
        candidates.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Limiter le nombre de résultats
        return candidates[:max_results]
    
    def _simulate_platform_search(self, platform: str, job_description: str, 
                                 skills: List[str], location: str, 
                                 experience_level: str, max_results: int) -> List[Dict[Any, Any]]:
        """
        Simule la recherche de candidats sur une plateforme spécifique
        """
        logger.info(f"Simulation de recherche sur la plateforme: {platform}")
        
        # Noms fictifs pour la simulation
        first_names = ["Jean", "Marie", "Pierre", "Sophie", "Thomas", "Julie", "Nicolas", "Emma", 
                      "Lucas", "Camille", "Alexandre", "Léa", "Antoine", "Chloé", "Maxime"]
        last_names = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", 
                     "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel"]
        
        # Compétences possibles par plateforme
        platform_skills = {
            'linkedin': ["Management", "Leadership", "Communication", "Marketing", "Ventes", 
                        "Finance", "Ressources Humaines", "Stratégie", "Négociation", 
                        "Gestion de projet"] + skills,
            'github': ["Python", "JavaScript", "Java", "C++", "Ruby", "Go", "Rust", "PHP", 
                      "TypeScript", "Swift", "Kotlin", "C#", "Shell", "HTML/CSS"] + skills,
            'stackoverflow': ["Algorithmes", "Structures de données", "Bases de données", 
                             "Architecture logicielle", "DevOps", "Cloud Computing", 
                             "Sécurité informatique", "Machine Learning"] + skills
        }
        
        # Titres de poste possibles par plateforme
        platform_titles = {
            'linkedin': ["Directeur", "Manager", "Chef de projet", "Consultant", "Analyste", 
                        "Responsable", "Chargé de", "Spécialiste"],
            'github': ["Développeur", "Ingénieur logiciel", "Architecte", "DevOps", 
                      "Data Scientist", "Full Stack", "Frontend", "Backend"],
            'stackoverflow': ["Développeur Senior", "Lead Developer", "Architecte Solution", 
                             "Expert Technique", "CTO", "Tech Lead"]
        }
        
        # Entreprises fictives par plateforme
        platform_companies = {
            'linkedin': ["Acme Corp", "Global Solutions", "Innovative Tech", "Strategic Consulting", 
                        "Digital Marketing", "Finance Plus", "HR Solutions"],
            'github': ["TechStart", "CodeMasters", "DevHouse", "ByteCrafters", "DataMinds", 
                      "CloudNative", "AppFactory"],
            'stackoverflow': ["StackInnovate", "CodeGurus", "AlgoExperts", "TechSolvers", 
                             "BitWizards", "LogicLabs"]
        }
        
        # Générer des candidats fictifs
        candidates = []
        for _ in range(max_results):
            # Sélectionner aléatoirement des compétences du candidat
            candidate_skills = random.sample(
                platform_skills[platform], 
                random.randint(3, min(8, len(platform_skills[platform])))
            )
            
            # Calculer un score de correspondance basé sur les compétences
            skill_match = len(set(candidate_skills).intersection(set(skills))) / len(skills) if skills else 0
            
            # Générer un profil fictif
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            title = random.choice(platform_titles[platform])
            domain = random.choice(platform_skills[platform][:5])
            company = random.choice(platform_companies[platform])
            
            # Générer une expérience aléatoire en années
            experience_years = random.randint(1, 15)
            
            # Générer une bio fictive
            bio = f"Professionnel expérimenté en {domain} avec {experience_years} ans d'expérience. "
            bio += f"Spécialisé en {', '.join(candidate_skills[:3])}. "
            
            # Générer un score de correspondance global
            match_score = skill_match * 0.7 + random.uniform(0, 0.3)
            
            # Créer le profil du candidat
            candidate = {
                'id': f"{platform}-{len(candidates) + 1}",
                'platform': platform,
                'name': f"{first_name} {last_name}",
                'title': f"{title} {domain}",
                'company': company,
                'location': location if location else random.choice(["Paris", "Lyon", "Marseille", "Bordeaux", "Lille"]),
                'experience_years': experience_years,
                'skills': candidate_skills,
                'bio': bio,
                'profile_url': f"https://example.com/{platform}/{first_name.lower()}{last_name.lower()}",
                'match_score': round(match_score * 100),
                'contact_info': {
                    'email': f"{first_name.lower()}.{last_name.lower()}@example.com",
                    'phone': None  # Dans une implémentation réelle, ces données ne seraient pas disponibles directement
                }
            }
            
            candidates.append(candidate)
        
        return candidates
    
    def get_candidate_details(self, candidate_id: str, platform: str) -> Dict[Any, Any]:
        """
        Récupère les détails complets d'un candidat
        
        Note: Dans une implémentation réelle, cette fonction ferait une requête
        vers l'API de la plateforme ou extrairait les données de la page du profil.
        Pour cette simulation, nous générons des données fictives plus détaillées.
        """
        logger.info(f"Récupération des détails du candidat {candidate_id} sur {platform}")
        
        # Simuler un délai de réseau
        time.sleep(0.5)
        
        # Générer des détails fictifs plus complets
        education = []
        for _ in range(random.randint(1, 3)):
            degree = random.choice(["Bachelor", "Master", "PhD", "MBA"])
            field = random.choice(["Informatique", "Génie Logiciel", "Sciences des Données", 
                                  "Intelligence Artificielle", "Gestion", "Marketing"])
            school = random.choice(["Université de Paris", "École Polytechnique", "HEC Paris", 
                                   "ESSEC", "CentraleSupélec", "ENSAE", "Télécom Paris"])
            start_year = random.randint(2000, 2015)
            end_year = start_year + random.randint(2, 5)
            
            education.append({
                'degree': degree,
                'field': field,
                'school': school,
                'start_year': start_year,
                'end_year': end_year
            })
        
        # Générer des expériences professionnelles fictives
        experiences = []
        current_year = 2023
        for i in range(random.randint(1, 4)):
            duration = random.randint(1, 5)
            end_year = current_year - sum(exp.get('duration', 0) for exp in experiences)
            if end_year < 2005:  # Limiter l'historique
                break
                
            start_year = end_year - duration
            
            title = random.choice(["Développeur", "Ingénieur", "Chef de projet", "Consultant", 
                                  "Architecte", "Manager", "Directeur"])
            domain = random.choice(["Web", "Mobile", "Cloud", "Data", "IA", "DevOps", "Sécurité"])
            company = random.choice(["TechCorp", "DataSoft", "CloudNative", "AILabs", 
                                    "SecureNet", "MobileTech", "WebSolutions"])
            
            experiences.append({
                'title': f"{title} {domain}",
                'company': company,
                'start_year': start_year,
                'end_year': end_year if i > 0 else current_year,
                'duration': duration,
                'current': i == 0,
                'description': f"Travail sur des projets de {domain} utilisant diverses technologies."
            })
        
        # Générer des projets fictifs (surtout pour GitHub)
        projects = []
        if platform == 'github':
            for _ in range(random.randint(2, 5)):
                name = random.choice(["awesome-app", "data-analyzer", "web-framework", 
                                     "ml-toolkit", "cloud-manager", "security-scanner"])
                tech = random.choice(["Python", "JavaScript", "Java", "C++", "Go", "Rust"])
                stars = random.randint(5, 500)
                forks = random.randint(1, stars // 2)
                
                projects.append({
                    'name': name,
                    'description': f"A {tech} project for {name.replace('-', ' ')}",
                    'url': f"https://github.com/username/{name}",
                    'stars': stars,
                    'forks': forks,
                    'language': tech
                })
        
        # Générer des réponses fictives (surtout pour StackOverflow)
        contributions = []
        if platform == 'stackoverflow':
            for _ in range(random.randint(5, 20)):
                topic = random.choice(["Python", "JavaScript", "Java", "C++", "SQL", 
                                      "Docker", "Kubernetes", "AWS", "React", "Node.js"])
                votes = random.randint(1, 50)
                
                contributions.append({
                    'topic': topic,
                    'votes': votes,
                    'is_accepted': random.random() > 0.7
                })
        
        # Retourner les détails complets
        return {
            'id': candidate_id,
            'platform': platform,
            'profile_details': {
                'education': education,
                'experiences': experiences,
                'projects': projects,
                'contributions': contributions,
                'languages': random.sample(["Français", "Anglais", "Espagnol", "Allemand", "Italien"], 
                                          random.randint(1, 3)),
                'certifications': random.sample(["AWS Certified", "Google Cloud Professional", 
                                               "Microsoft Certified", "Scrum Master", "PMP", 
                                               "ITIL", "CISSP"], 
                                              random.randint(0, 3))
            }
        }
    
    def analyze_candidate_fit(self, candidate: Dict[Any, Any], job_description: str, 
                             required_skills: List[str]) -> Dict[Any, Any]:
        """
        Analyse l'adéquation d'un candidat pour un poste spécifique
        """
        logger.info(f"Analyse de l'adéquation du candidat {candidate['id']}")
        
        # Calculer le score de correspondance des compétences
        candidate_skills = set(candidate.get('skills', []))
        required_skills_set = set(required_skills)
        
        skills_match = len(candidate_skills.intersection(required_skills_set)) / len(required_skills_set) if required_skills_set else 0
        
        # Simuler l'analyse sémantique du profil par rapport à la description du poste
        # Dans une implémentation réelle, nous utiliserions Gensim pour l'analyse sémantique
        semantic_match = random.uniform(0.5, 1.0) * skills_match + random.uniform(0, 0.3)
        
        # Calculer un score global
        overall_score = (skills_match * 0.6) + (semantic_match * 0.4)
        
        # Identifier les forces et faiblesses
        strengths = list(candidate_skills.intersection(required_skills_set))
        weaknesses = list(required_skills_set - candidate_skills)
        
        # Générer des recommandations
        recommendations = []
        if weaknesses:
            recommendations.append(f"Le candidat manque de compétences en {', '.join(weaknesses[:3])}")
        
        if 'experiences' in candidate.get('profile_details', {}):
            exp_years = sum(exp.get('duration', 0) for exp in candidate['profile_details']['experiences'])
            if exp_years < 3:
                recommendations.append("Le candidat a relativement peu d'expérience professionnelle")
        
        # Retourner l'analyse
        return {
            'candidate_id': candidate['id'],
            'skills_match': round(skills_match * 100),
            'semantic_match': round(semantic_match * 100),
            'overall_score': round(overall_score * 100),
            'strengths': strengths,
            'weaknesses': weaknesses[:5],  # Limiter à 5 faiblesses
            'recommendations': recommendations,
            'potential_roles': self._suggest_alternative_roles(candidate_skills) if overall_score < 0.7 else []
        }
    
    def _suggest_alternative_roles(self, skills: set) -> List[str]:
        """
        Suggère des rôles alternatifs basés sur les compétences du candidat
        """
        # Mapping simplifié des compétences aux rôles
        skill_to_role = {
            "Python": ["Data Scientist", "Backend Developer", "ML Engineer"],
            "JavaScript": ["Frontend Developer", "Full Stack Developer", "Web Developer"],
            "Java": ["Backend Developer", "Android Developer", "Enterprise Developer"],
            "C++": ["Systems Engineer", "Game Developer", "Embedded Developer"],
            "Management": ["Project Manager", "Team Lead", "Product Owner"],
            "Marketing": ["Marketing Specialist", "Growth Hacker", "Content Strategist"],
            "Finance": ["Financial Analyst", "Controller", "CFO"],
            "Machine Learning": ["ML Engineer", "Data Scientist", "AI Researcher"],
            "Cloud": ["DevOps Engineer", "Cloud Architect", "SRE"],
            "Security": ["Security Engineer", "Penetration Tester", "Security Analyst"]
        }
        
        # Trouver les rôles correspondant aux compétences
        potential_roles = set()
        for skill in skills:
            if skill in skill_to_role:
                potential_roles.update(skill_to_role[skill])
        
        return list(potential_roles)[:3]  # Limiter à 3 suggestions
    
    def get_platform_status(self) -> Dict[str, Dict[str, Any]]:
        """
        Retourne le statut de chaque plateforme configurée
        """
        return {name: {'enabled': config['enabled']} for name, config in self.platforms.items()}
    
    def update_platform_status(self, platform: str, enabled: bool) -> bool:
        """
        Met à jour le statut d'une plateforme
        """
        if platform in self.platforms:
            self.platforms[platform]['enabled'] = enabled
            logger.info(f"Plateforme {platform} {'activée' if enabled else 'désactivée'}")
            return True
        return False
    
    def get_sourcing_statistics(self) -> Dict[str, Any]:
        """
        Retourne des statistiques sur le sourcing de candidats
        
        Note: Dans une implémentation réelle, ces statistiques seraient basées
        sur des données réelles. Pour cette simulation, nous générons des données fictives.
        """
        return {
            'total_candidates_found': random.randint(100, 500),
            'candidates_by_platform': {
                'linkedin': random.randint(50, 200),
                'github': random.randint(30, 150),
                'stackoverflow': random.randint(20, 100)
            },
            'average_match_score': random.randint(60, 85),
            'top_skills_found': ["Python", "JavaScript", "Java", "SQL", "AWS"],
            'sourcing_efficiency': {
                'time_per_candidate': random.uniform(0.5, 2.0),
                'candidates_per_query': random.uniform(5, 15)
            }
        }
