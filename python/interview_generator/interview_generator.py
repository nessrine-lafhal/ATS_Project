import os
import json
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, T5ForConditionalGeneration, T5Tokenizer
import re

class InterviewScenarioGenerator:
    """
    Classe pour générer des scénarios d'entretien personnalisés en utilisant GPT-2 et Rasa.
    """
    
    def __init__(self):
        """
        Initialise les modèles GPT-2 pour la génération de scénarios d'entretien.
        """
        print("Initialisation des modèles pour la génération de scénarios d'entretien...")
        
        # Initialiser GPT-2 pour la génération de texte
        self.gpt2_model_name = "gpt2"
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained(self.gpt2_model_name)
        self.gpt2_model = GPT2LMHeadModel.from_pretrained(self.gpt2_model_name)
        
        # Charger les templates et exemples pour les scénarios d'entretien
        self.templates = self._load_templates()
        self.examples = self._load_examples()
        
        # Catégories de questions d'entretien
        self.question_categories = {
            "technical": "Questions techniques pour évaluer les compétences spécifiques au poste",
            "behavioral": "Questions comportementales pour évaluer les soft skills et l'expérience passée",
            "situational": "Mises en situation pour évaluer la réaction face à des scénarios professionnels",
            "cultural_fit": "Questions pour évaluer l'adéquation avec la culture de l'entreprise",
            "motivation": "Questions pour évaluer la motivation et les aspirations du candidat"
        }
        
        print("Modèles pour la génération de scénarios d'entretien initialisés avec succès.")
    
    def _load_templates(self) -> Dict[str, List[str]]:
        """
        Charge les templates pour différentes catégories de questions d'entretien.
        """
        # Dans une implémentation réelle, ces templates seraient chargés depuis un fichier
        return {
            "technical": [
                "Pouvez-vous décrire votre expérience avec {technology}?",
                "Comment avez-vous utilisé {technology} dans vos projets précédents?",
                "Expliquez comment vous résoudriez {technical_problem}.",
                "Quelle est votre approche pour {technical_task}?",
                "Décrivez un projet où vous avez utilisé {technology} pour résoudre un problème complexe."
            ],
            "behavioral": [
                "Décrivez une situation où vous avez dû {behavioral_challenge}.",
                "Parlez-moi d'un moment où vous avez fait preuve de {soft_skill}.",
                "Comment avez-vous géré un conflit avec {stakeholder}?",
                "Donnez un exemple de situation où vous avez dû {behavioral_situation}.",
                "Racontez une expérience où vous avez dû vous adapter à un changement inattendu."
            ],
            "situational": [
                "Comment réagiriez-vous si {hypothetical_situation}?",
                "Que feriez-vous si {challenging_scenario}?",
                "Imaginez que {situation_setup}. Comment procéderiez-vous?",
                "Si vous étiez confronté à {difficult_choice}, quelle serait votre approche?",
                "Dans un scénario où {problem_scenario}, quelle serait votre stratégie?"
            ],
            "cultural_fit": [
                "Comment décririez-vous votre environnement de travail idéal?",
                "Quelles valeurs d'entreprise sont importantes pour vous?",
                "Comment contribuez-vous à une culture d'équipe positive?",
                "Décrivez votre style de travail et comment vous collaborez avec les autres.",
                "Qu'est-ce qui vous motive au-delà du salaire dans votre carrière?"
            ],
            "motivation": [
                "Pourquoi êtes-vous intéressé par ce poste en particulier?",
                "Où vous voyez-vous professionnellement dans 5 ans?",
                "Qu'est-ce qui vous passionne dans {industry}?",
                "Comment ce poste s'inscrit-il dans votre parcours professionnel?",
                "Quels aspects de ce rôle vous enthousiasment le plus?"
            ]
        }
    
    def _load_examples(self) -> Dict[str, Dict[str, List[str]]]:
        """
        Charge des exemples de questions d'entretien de haute qualité pour différents domaines.
        """
        # Dans une implémentation réelle, ces exemples seraient chargés depuis une base de données
        return {
            "tech": {
                "technical": [
                    "Expliquez le concept de polymorphisme en programmation orientée objet et donnez un exemple concret.",
                    "Décrivez les différences entre REST et GraphQL. Quand préféreriez-vous utiliser l'un plutôt que l'autre?",
                    "Comment optimiseriez-vous les performances d'une application web qui charge lentement?",
                    "Expliquez comment fonctionne la gestion de la mémoire dans JavaScript.",
                    "Décrivez votre approche pour assurer la sécurité des données dans une application."
                ],
                "behavioral": [
                    "Décrivez un projet technique complexe que vous avez dirigé. Quels défis avez-vous rencontrés et comment les avez-vous surmontés?",
                    "Parlez-moi d'une situation où vous avez dû expliquer un concept technique à un public non technique.",
                    "Comment avez-vous géré une situation où vous n'étiez pas d'accord avec l'approche technique d'un collègue?",
                    "Racontez une expérience où vous avez dû respecter un délai serré pour un projet technique.",
                    "Décrivez comment vous restez à jour avec les nouvelles technologies dans votre domaine."
                ]
            },
            "marketing": {
                "technical": [
                    "Quels outils d'analyse marketing utilisez-vous et comment interprétez-vous les données pour prendre des décisions?",
                    "Décrivez une campagne marketing que vous avez conçue et comment vous avez mesuré son succès.",
                    "Comment adaptez-vous votre stratégie de contenu pour différentes plateformes de médias sociaux?",
                    "Expliquez votre approche pour l'optimisation du taux de conversion (CRO).",
                    "Quelles méthodes utilisez-vous pour identifier et cibler des segments d'audience spécifiques?"
                ],
                "behavioral": [
                    "Parlez-moi d'une campagne marketing qui n'a pas atteint ses objectifs. Qu'avez-vous appris et comment avez-vous ajusté votre approche?",
                    "Décrivez comment vous avez collaboré avec d'autres départements pour lancer un nouveau produit ou service.",
                    "Comment gérez-vous les retours négatifs sur une campagne ou un contenu que vous avez créé?",
                    "Racontez une situation où vous avez dû adapter rapidement votre stratégie marketing en réponse à un changement du marché.",
                    "Décrivez comment vous équilibrez créativité et données dans votre processus décisionnel marketing."
                ]
            },
            "sales": {
                "technical": [
                    "Décrivez votre processus de prospection et de qualification des leads.",
                    "Quelles techniques utilisez-vous pour surmonter les objections des clients?",
                    "Comment adaptez-vous votre approche de vente à différents types de clients?",
                    "Expliquez comment vous utilisez un CRM pour gérer votre pipeline de ventes.",
                    "Quelle est votre approche pour établir un prix et négocier avec les clients?"
                ],
                "behavioral": [
                    "Racontez une situation où vous avez réussi à convertir un client particulièrement difficile.",
                    "Comment avez-vous géré une situation où vous n'avez pas atteint vos objectifs de vente?",
                    "Décrivez comment vous avez développé une relation à long terme avec un client clé.",
                    "Parlez-moi d'une situation où vous avez dû collaborer avec l'équipe marketing ou produit pour conclure une vente.",
                    "Comment restez-vous motivé face aux refus fréquents dans le processus de vente?"
                ]
            }
        }
    
    def generate_interview_scenarios(self, job_description: str, candidate_profile: Dict[str, Any], 
                                    company_info: Dict[str, str], scenario_types: List[str] = None,
                                    num_questions: int = 5) -> Dict[str, Any]:
        """
        Génère des scénarios d'entretien personnalisés basés sur la description du poste et le profil du candidat.
        
        Args:
            job_description: Description du poste
            candidate_profile: Profil du candidat (compétences, expérience, etc.)
            company_info: Informations sur l'entreprise
            scenario_types: Types de scénarios à générer (technical, behavioral, situational, etc.)
            num_questions: Nombre de questions à générer par type
            
        Returns:
            Dictionnaire contenant les scénarios d'entretien générés
        """
        if scenario_types is None:
            scenario_types = list(self.question_categories.keys())
        
        # Extraire les informations clés du job_description
        job_category = self._determine_job_category(job_description)
        key_skills = self._extract_key_skills(job_description)
        key_responsibilities = self._extract_key_responsibilities(job_description)
        
        # Extraire les informations clés du profil du candidat
        candidate_skills = candidate_profile.get("skills", [])
        candidate_experience = candidate_profile.get("experience", [])
        
        # Générer des scénarios pour chaque type demandé
        scenarios = {}
        
        for scenario_type in scenario_types:
            if scenario_type in self.templates:
                # Générer des questions basées sur les templates
                questions = self._generate_questions_from_templates(
                    scenario_type, job_category, key_skills, key_responsibilities, 
                    candidate_skills, candidate_experience, company_info, num_questions
                )
                
                # Ajouter des questions générées par GPT-2 si nécessaire
                if len(questions) < num_questions:
                    additional_questions = self._generate_questions_with_gpt2(
                        scenario_type, job_description, candidate_profile, 
                        company_info, num_questions - len(questions)
                    )
                    questions.extend(additional_questions)
                
                scenarios[scenario_type] = questions[:num_questions]
        
        # Ajouter des scénarios de jeu de rôle si demandé
        if "roleplay" in scenario_types:
            scenarios["roleplay"] = self._generate_roleplay_scenarios(
                job_description, candidate_profile, company_info, num_questions
            )
        
        return {
            "job_category": job_category,
            "key_skills": key_skills,
            "key_responsibilities": key_responsibilities,
            "scenarios": scenarios,
            "timestamp": datetime.now().isoformat()
        }
    
    def _determine_job_category(self, job_description: str) -> str:
        """
        Détermine la catégorie du poste à partir de la description.
        """
        # Mots-clés pour différentes catégories
        categories = {
            "tech": ["développeur", "ingénieur", "programmeur", "technique", "logiciel", "système", "data", "IT", "informatique", "DevOps", "cloud", "web", "mobile", "frontend", "backend", "fullstack"],
            "marketing": ["marketing", "communication", "contenu", "SEO", "SEM", "médias sociaux", "digital", "marque", "produit", "marché", "campagne", "acquisition", "growth"],
            "sales": ["ventes", "commercial", "business development", "account manager", "client", "revenu", "chiffre d'affaires", "négociation", "prospection"],
            "hr": ["ressources humaines", "RH", "recrutement", "talent", "personnel", "formation", "développement", "compétences", "carrière"],
            "finance": ["finance", "comptabilité", "comptable", "financier", "budget", "investissement", "trésorerie", "audit", "contrôle de gestion"],
            "design": ["design", "UX", "UI", "expérience utilisateur", "interface", "graphique", "créatif", "visuel"],
            "product": ["produit", "product owner", "product manager", "fonctionnalités", "roadmap", "backlog", "agile", "scrum"]
        }
        
        # Compter les occurrences de mots-clés pour chaque catégorie
        scores = {category: 0 for category in categories}
        
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword.lower() in job_description.lower():
                    scores[category] += 1
        
        # Retourner la catégorie avec le score le plus élevé
        if max(scores.values()) > 0:
            return max(scores.items(), key=lambda x: x[1])[0]
        
        # Par défaut, retourner "general"
        return "general"
    
    def _extract_key_skills(self, job_description: str) -> List[str]:
        """
        Extrait les compétences clés de la description du poste.
        """
        # Liste de compétences techniques courantes
        technical_skills = [
            "Python", "Java", "JavaScript", "C#", "C++", "Ruby", "PHP", "Swift", "Kotlin", "Go",
            "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring", "ASP.NET",
            "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Redis",
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "DevOps",
            "Machine Learning", "Deep Learning", "AI", "Data Science", "Big Data", "Hadoop", "Spark",
            "HTML", "CSS", "SASS", "LESS", "Bootstrap", "Tailwind",
            "Git", "SVN", "Agile", "Scrum", "Kanban", "Jira", "Confluence"
        ]
        
        # Liste de soft skills courantes
        soft_skills = [
            "communication", "travail d'équipe", "leadership", "gestion de projet", "résolution de problèmes",
            "pensée critique", "créativité", "adaptabilité", "organisation", "gestion du temps",
            "négociation", "présentation", "écoute active", "empathie", "intelligence émotionnelle",
            "prise de décision", "autonomie", "initiative", "persévérance", "flexibilité"
        ]
        
        # Rechercher les compétences dans la description
        found_skills = []
        
        for skill in technical_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', job_description, re.IGNORECASE):
                found_skills.append(skill)
        
        for skill in soft_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', job_description, re.IGNORECASE):
                found_skills.append(skill)
        
        # Limiter à 10 compétences maximum
        return found_skills[:10]
    
    def _extract_key_responsibilities(self, job_description: str) -> List[str]:
        """
        Extrait les responsabilités clés de la description du poste.
        """
        # Rechercher une section de responsabilités
        responsibility_section = ""
        
        # Patterns courants pour les sections de responsabilités
        patterns = [
            r"(?:Responsabilités|Missions|Tâches)[\s:]+(.+?)(?:\n\n|\n[A-Z])",
            r"(?:Vous serez chargé de|Vous serez responsable de)[\s:]+(.+?)(?:\n\n|\n[A-Z])",
            r"(?:Le poste consiste à|Le rôle consiste à)[\s:]+(.+?)(?:\n\n|\n[A-Z])"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, job_description, re.DOTALL | re.IGNORECASE)
            if match:
                responsibility_section = match.group(1)
                break
        
        # Si aucune section n'est trouvée, utiliser toute la description
        if not responsibility_section:
            responsibility_section = job_description
        
        # Extraire les points individuels (souvent sous forme de liste à puces)
        responsibilities = []
        
        # Rechercher des listes à puces
        bullet_points = re.findall(r'[-•*]\s*([^\n]+)', responsibility_section)
        if bullet_points:
            responsibilities.extend(bullet_points)
        
        # Si pas de liste à puces, diviser en phrases
        if not responsibilities:
            sentences = re.split(r'[.!?]+', responsibility_section)
            responsibilities = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        # Limiter à 5 responsabilités maximum
        return responsibilities[:5]
    
    def _generate_questions_from_templates(self, scenario_type: str, job_category: str, 
                                         key_skills: List[str], key_responsibilities: List[str],
                                         candidate_skills: List[str], candidate_experience: List[str],
                                         company_info: Dict[str, str], num_questions: int) -> List[str]:
        """
        Génère des questions à partir des templates en remplaçant les placeholders.
        """
        if scenario_type not in self.templates:
            return []
        
        templates = self.templates[scenario_type]
        questions = []
        
        # Variables pour remplacer les placeholders
        replacements = {
            "{technology}": key_skills + candidate_skills,
            "{technical_problem}": ["un problème de performance", "une faille de sécurité", "un bug critique", 
                                  "une intégration complexe", "une migration de données"],
            "{technical_task}": ["optimiser une base de données", "concevoir une API RESTful", 
                               "implémenter une fonctionnalité complexe", "déboguer une application"],
            "{behavioral_challenge}": ["gérer un conflit d'équipe", "respecter un délai serré", 
                                     "vous adapter à un changement de priorités", "apprendre une nouvelle technologie rapidement"],
            "{soft_skill}": ["leadership", "travail d'équipe", "communication", "résolution de problèmes", 
                           "adaptabilité", "créativité", "initiative"],
            "{stakeholder}": ["un collègue", "un manager", "un client", "une équipe partenaire"],
            "{behavioral_situation}": ["donner un feedback difficile", "prendre une décision importante", 
                                     "gérer plusieurs priorités", "proposer une idée innovante"],
            "{hypothetical_situation}": ["un client était insatisfait de votre livraison", 
                                       "vous découvriez une erreur majeure juste avant une deadline",
                                       "votre équipe était en désaccord sur l'approche technique"],
            "{challenging_scenario}": ["vous deviez livrer un projet avec des ressources limitées",
                                     "vous receviez des exigences contradictoires de différentes parties prenantes",
                                     "vous deviez reprendre un projet mal documenté"],
            "{situation_setup}": ["vous êtes en charge d'un projet critique qui prend du retard",
                                "vous devez présenter une solution technique à des décideurs non techniques",
                                "vous identifiez un problème majeur dans l'approche de votre équipe"],
            "{difficult_choice}": ["choisir entre qualité et respect des délais",
                                 "prioriser entre deux fonctionnalités importantes",
                                 "décider d'utiliser une nouvelle technologie ou rester avec l'existante"],
            "{problem_scenario}": ["un membre clé de l'équipe quitte en plein projet",
                                 "les exigences du projet changent significativement en cours de route",
                                 "vous découvrez que la solution actuelle ne passera pas à l'échelle"],
            "{industry}": [company_info.get("industry", "notre secteur")]
        }
        
        # Générer des questions en remplaçant les placeholders
        for template in templates:
            for placeholder, options in replacements.items():
                if placeholder in template and options:
                    # Choisir une option aléatoire
                    replacement = np.random.choice(options)
                    template = template.replace(placeholder, replacement)
            
            questions.append(template)
            
            if len(questions) >= num_questions:
                break
        
        # Si nous avons des exemples pour cette catégorie, les utiliser aussi
        if job_category in self.examples and scenario_type in self.examples[job_category]:
            examples = self.examples[job_category][scenario_type]
            # Mélanger les exemples
            np.random.shuffle(examples)
            
            # Ajouter des exemples jusqu'à atteindre num_questions
            for example in examples:
                if example not in questions:
                    questions.append(example)
                    
                    if len(questions) >= num_questions:
                        break
        
        return questions
    
    def _generate_questions_with_gpt2(self, scenario_type: str, job_description: str, 
                                    candidate_profile: Dict[str, Any], company_info: Dict[str, str],
                                    num_questions: int) -> List[str]:
        """
        Génère des questions d'entretien en utilisant GPT-2.
        """
        # Construire un prompt pour GPT-2
        prompt = f"Générer {num_questions} questions d'entretien de type {scenario_type} pour un poste de {candidate_profile.get('job_title', 'professionnel')}.\n\n"
        
        # Ajouter des informations sur le poste
        prompt += f"Description du poste: {job_description[:500]}...\n\n"
        
        # Ajouter des informations sur le candidat
        if candidate_profile.get("skills"):
            prompt += f"Compétences du candidat: {', '.join(candidate_profile.get('skills', [])[:5])}\n"
        
        if candidate_profile.get("experience"):
            prompt += f"Expérience du candidat: {', '.join(candidate_profile.get('experience', [])[:3])}\n\n"
        
        # Ajouter des exemples de questions pour ce type
        prompt += f"Exemples de questions de type {scenario_type}:\n"
        
        if scenario_type == "technical":
            prompt += "1. Décrivez votre expérience avec [technologie].\n"
            prompt += "2. Comment résoudriez-vous [problème technique]?\n"
        elif scenario_type == "behavioral":
            prompt += "1. Parlez-moi d'une situation où vous avez dû [défi comportemental].\n"
            prompt += "2. Comment avez-vous géré un conflit avec [partie prenante]?\n"
        elif scenario_type == "situational":
            prompt += "1. Que feriez-vous si [scénario hypothétique]?\n"
            prompt += "2. Comment réagiriez-vous si [situation difficile]?\n"
        
        prompt += "\nQuestions d'entretien générées:\n"
        
        # Générer les questions avec GPT-2
        input_ids = self.gpt2_tokenizer.encode(prompt, return_tensors="pt")
        output = self.gpt2_model.generate(
            input_ids,
            max_length=1024,
            temperature=0.8,
            top_k=50,
            top_p=0.95,
            repetition_penalty=1.2,
            do_sample=True,
            num_return_sequences=1
        )
        
        generated_text = self.gpt2_tokenizer.decode(output[0], skip_special_tokens=True)
        
        # Extraire uniquement la partie générée après "Questions d'entretien générées:"
        generated_questions = generated_text.split("Questions d'entretien générées:")[-1].strip()
        
        # Diviser en questions individuelles
        questions = []
        
        # Rechercher des questions numérotées
        numbered_questions = re.findall(r'\d+\.\s*([^\n]+)', generated_questions)
        if numbered_questions:
            questions.extend(numbered_questions)
        
        # Si pas assez de questions numérotées, diviser par lignes
        if len(questions) < num_questions:
            lines = [line.strip() for line in generated_questions.split('\n') if line.strip()]
            for line in lines:
                # Ignorer les lignes qui ne ressemblent pas à des questions
                if len(line) > 20 and ('?' in line or line.startswith('Comment') or line.startswith('Décrivez') or line.startswith('Expliquez')):
                    if line not in questions:
                        questions.append(line)
        
        # Limiter au nombre demandé
        return questions[:num_questions]
    
    def _generate_roleplay_scenarios(self, job_description: str, candidate_profile: Dict[str, Any],
                                   company_info: Dict[str, str], num_scenarios: int) -> List[Dict[str, str]]:
        """
        Génère des scénarios de jeu de rôle pour l'entretien.
        """
        # Déterminer le type de poste pour générer des scénarios appropriés
        job_category = self._determine_job_category(job_description)
        
        # Scénarios prédéfinis par catégorie
        predefined_scenarios = {
            "tech": [
                {
                    "title": "Explication technique à un client non technique",
                    "description": "Vous devez expliquer un problème technique complexe à un client qui n'a pas de connaissances techniques. Comment procédez-vous pour vous assurer qu'il comprend les enjeux?",
                    "evaluation_criteria": "Clarté de la communication, capacité à vulgariser, empathie, vérification de la compréhension"
                },
                {
                    "title": "Résolution de problème en équipe",
                    "description": "Votre équipe est bloquée sur un bug critique qui affecte la production. Comment organisez-vous la résolution du problème?",
                    "evaluation_criteria": "Méthodologie de résolution de problèmes, collaboration, gestion du stress, communication"
                },
                {
                    "title": "Revue de code avec un développeur junior",
                    "description": "Vous devez faire une revue de code avec un développeur junior qui a commis plusieurs erreurs. Comment abordez-vous cette situation?",
                    "evaluation_criteria": "Pédagogie, feedback constructif, patience, capacité à mentorer"
                }
            ],
            "marketing": [
                {
                    "title": "Présentation d'une stratégie marketing à la direction",
                    "description": "Vous devez présenter une nouvelle stratégie marketing à la direction. Comment structurez-vous votre présentation pour convaincre?",
                    "evaluation_criteria": "Capacité à convaincre, structure de la présentation, anticipation des questions, connaissance du sujet"
                },
                {
                    "title": "Gestion d'une crise sur les réseaux sociaux",
                    "description": "Votre entreprise fait face à une crise sur les réseaux sociaux suite à un commentaire mal interprété. Comment gérez-vous la situation?",
                    "evaluation_criteria": "Réactivité, gestion de crise, communication externe, résolution de problèmes"
                },
                {
                    "title": "Négociation avec une agence externe",
                    "description": "Vous devez négocier avec une agence externe pour obtenir de meilleures conditions pour une campagne marketing. Comment abordez-vous cette négociation?",
                    "evaluation_criteria": "Compétences en négociation, préparation, argumentation, résolution de conflits"
                }
            ],
            "sales": [
                {
                    "title": "Démonstration de produit à un client potentiel",  [
                {
                    "title": "Démonstration de produit à un client potentiel",
                    "description": "Vous rencontrez un client potentiel important pour une démonstration de produit. Comment menez-vous cette démonstration?",
                    "evaluation_criteria": "Techniques de vente, connaissance du produit, écoute active, gestion des objections"
                },
                {
                    "title": "Négociation de contrat avec un client difficile",
                    "description": "Un client important souhaite renégocier les termes de son contrat à la baisse. Comment gérez-vous cette négociation?",
                    "evaluation_criteria": "Compétences en négociation, défense de la valeur, recherche de compromis, relation client"
                },
                {
                    "title": "Récupération d'un client insatisfait",
                    "description": "Un client important est insatisfait du service et menace de ne pas renouveler son contrat. Comment tentez-vous de récupérer ce client?",
                    "evaluation_criteria": "Gestion des réclamations, empathie, résolution de problèmes, fidélisation client"
                }
            ],
            "hr": [
                {
                    "title": "Entretien d'évaluation difficile",
                    "description": "Vous devez mener un entretien d'évaluation avec un employé dont les performances sont insuffisantes. Comment abordez-vous cet entretien?",
                    "evaluation_criteria": "Feedback constructif, gestion des conflits, communication difficile, plan d'amélioration"
                },
                {
                    "title": "Médiation de conflit entre deux employés",
                    "description": "Deux employés de votre équipe sont en conflit ouvert, ce qui affecte l'ambiance de travail. Comment organisez-vous une médiation?",
                    "evaluation_criteria": "Compétences en médiation, impartialité, résolution de conflits, communication"
                },
                {
                    "title": "Annonce d'une restructuration à l'équipe",
                    "description": "Vous devez annoncer une restructuration qui implique des suppressions de postes à votre équipe. Comment gérez-vous cette communication?",
                    "evaluation_criteria": "Communication de crise, empathie, gestion des émotions, transparence"
                }
            ],
            "general": [
                {
                    "title": "Présentation d'un projet à des parties prenantes",
                    "description": "Vous devez présenter l'avancement d'un projet important à diverses parties prenantes. Comment structurez-vous votre présentation?",
                    "evaluation_criteria": "Communication, synthèse, adaptation au public, gestion des attentes"
                },
                {
                    "title": "Gestion d'un conflit d'équipe",
                    "description": "Deux membres de votre équipe sont en désaccord sur l'approche à adopter pour un projet. Comment facilitez-vous la résolution de ce conflit?",
                    "evaluation_criteria": "Leadership, médiation, prise de décision, communication"
                },
                {
                    "title": "Adaptation à un changement imprévu",
                    "description": "Un changement majeur et imprévu affecte votre projet (budget réduit, délai raccourci, etc.). Comment réagissez-vous et adaptez-vous votre plan?",
                    "evaluation_criteria": "Adaptabilité, résolution de problèmes, gestion du stress, planification"
                }
            ]
        }
        
        # Sélectionner les scénarios appropriés
        if job_category in predefined_scenarios:
            scenarios = predefined_scenarios[job_category]
        else:
            scenarios = predefined_scenarios["general"]
        
        # Mélanger les scénarios
        np.random.shuffle(scenarios)
        
        # Limiter au nombre demandé
        return scenarios[:num_scenarios]
    
    def generate_interview_script(self, job_title: str, scenarios: Dict[str, List[str]],
                                company_info: Dict[str, str]) -> str:
        """
        Génère un script d'entretien complet basé sur les scénarios générés.
        """
        script = f"# Script d'entretien pour le poste de {job_title}\n\n"
        
        # Introduction
        script += "## Introduction\n\n"
        script += f"Bonjour et bienvenue chez {company_info.get('name', 'notre entreprise')}. "
        script += "Je m'appelle [Nom de l'intervieweur] et je suis [Poste de l'intervieweur]. "
        script += f"Nous sommes ravis de vous rencontrer aujourd'hui pour discuter du poste de {job_title}.\n\n"
        script += "Avant de commencer, laissez-moi vous présenter brièvement notre entreprise et le déroulement de cet entretien.\n\n"
        
        # Présentation de l'entreprise
        script += "## Présentation de l'entreprise\n\n"
        if company_info.get('description'):
            script += f"{company_info.get('description')}\n\n"
        else:
            script += "[Insérer une brève présentation de l'entreprise, sa mission, ses valeurs et sa culture.]\n\n"
        
        # Structure de l'entretien
        script += "## Structure de l'entretien\n\n"
        script += "Notre entretien d'aujourd'hui se déroulera en plusieurs parties:\n"
        script += "1. Questions sur votre parcours et votre expérience\n"
        script += "2. Questions techniques spécifiques au poste\n"
        script += "3. Questions comportementales et situationnelles\n"
        script += "4. Mise en situation ou jeu de rôle\n"
        script += "5. Vos questions sur le poste et l'entreprise\n\n"
        script += "L'entretien devrait durer environ [durée prévue] minutes. Avez-vous des questions avant que nous commencions?\n\n"
        
        # Questions par catégorie
        for category, questions in scenarios.items():
            if category == "technical":
                script += "## Questions techniques\n\n"
            elif category == "behavioral":
                script += "## Questions comportementales\n\n"
            elif category == "situational":
                script += "## Questions situationnelles\n\n"
            elif category == "cultural_fit":
                script += "## Questions sur l'adéquation culturelle\n\n"
            elif category == "motivation":
                script += "## Questions sur la motivation\n\n"
            else:
                script += f"## Questions de type {category}\n\n"
            
            for i, question in enumerate(questions, 1):
                script += f"{i}. {question}\n"
                script += "   - [Noter les points clés de la réponse]\n"
                script += "   - [Points à approfondir si nécessaire]\n\n"
        
        # Jeux de rôle
        if "roleplay" in scenarios and isinstance(scenarios["roleplay"], list) and len(scenarios["roleplay"]) > 0:
            script += "## Mise en situation / Jeu de rôle\n\n"
            
            for i, scenario in enumerate(scenarios["roleplay"], 1):
                if isinstance(scenario, dict):
                    script += f"{i}. **{scenario.get('title', 'Scénario')}**\n\n"
                    script += f"   {scenario.get('description', '')}\n\n"
                    if scenario.get('evaluation_criteria'):
                        script += f"   *Critères d'évaluation: {scenario.get('evaluation_criteria')}*\n\n"
                else:
                    script += f"{i}. **Scénario**\n\n"
                    script += f"   {scenario}\n\n"
        
        # Questions du candidat
        script += "## Questions du candidat\n\n"
        script += "Avez-vous des questions sur le poste, l'équipe ou l'entreprise?\n\n"
        script += "[Réserver du temps pour répondre aux questions du candidat]\n\n"
        
        # Conclusion
        script += "## Conclusion\n\n"
        script += "Merci pour cet entretien. Voici les prochaines étapes du processus de recrutement:\n"
        script += "- [Détailler les prochaines étapes]\n"
        script += "- [Mentionner quand et comment le candidat sera recontacté]\n\n"
        script += "Avez-vous d'autres questions avant que nous terminions?\n\n"
        script += "Merci encore pour votre temps et votre intérêt pour [nom de l'entreprise].\n"
        
        return script

# Fonction pour simuler la génération de scénarios d'entretien (pour les tests)
def simulate_interview_scenario_generation(job_description, candidate_profile, company_info, scenario_types=None, num_questions=5):
    """
    Simule la génération de scénarios d'entretien sans charger les modèles.
    Utilisé pour les tests et le développement.
    """
    if scenario_types is None:
        scenario_types = ["technical", "behavioral", "situational", "roleplay"]
    
    # Simuler une analyse du job_description
    job_category = "tech"  # Par défaut
    
    if "marketing" in job_description.lower():
        job_category = "marketing"
    elif "vente" in job_description.lower() or "commercial" in job_description.lower():
        job_category = "sales"
    elif "ressources humaines" in job_description.lower() or "RH" in job_description.lower():
        job_category = "hr"
    
    # Simuler l'extraction de compétences clés
    key_skills = ["Python", "JavaScript", "React", "SQL", "AWS"] if job_category == "tech" else ["Communication", "Analyse", "Stratégie", "Gestion de projet"]
    
    # Simuler l'extraction de responsabilités clés
    key_responsibilities = [
        "Développer et maintenir des applications web",
        "Collaborer avec les équipes produit et design",
        "Participer à la revue de code et au debugging",
        "Optimiser les performances des applications",
        "Contribuer à l'amélioration continue des processus"
    ] if job_category == "tech" else [
        "Élaborer et mettre en œuvre des stratégies marketing",
        "Analyser les tendances du marché et la concurrence",
        "Gérer les campagnes publicitaires et promotionnelles",
        "Collaborer avec les équipes de vente et de produit",
        "Mesurer et analyser les performances des actions marketing"
    ]
    
    # Générer des scénarios simulés
    scenarios = {}
    
    if "technical" in scenario_types:
        scenarios["technical"] = [
            "Pouvez-vous décrire votre expérience avec Python et comment vous l'avez utilisé dans vos projets précédents?",
            "Comment optimiseriez-vous les performances d'une application web qui charge lentement?",
            "Expliquez comment vous aborderiez la mise en place d'une architecture microservices.",
            "Quelle est votre approche pour assurer la sécurité des données dans une application?",
            "Décrivez un projet technique complexe sur lequel vous avez travaillé et les défis que vous avez surmontés."
        ] if job_category == "tech" else [
            "Quels outils d'analyse marketing utilisez-vous et comment interprétez-vous les données?",
            "Comment élaborez-vous une stratégie de contenu pour différentes plateformes?",
            "Décrivez votre approche pour mesurer le ROI des campagnes marketing.",
            "Comment segmentez-vous une audience pour une campagne ciblée?",
            "Quelles méthodes utilisez-vous pour l'optimisation du taux de conversion?"
        ]
    
    if "behavioral" in scenario_types:
        scenarios["behavioral"] = [
            "Décrivez une situation où vous avez dû résoudre un conflit au sein d'une équipe technique.",
            "Parlez-moi d'un moment où vous avez fait preuve d'initiative pour résoudre un problème technique.",
            "Comment gérez-vous les délais serrés et la pression dans un environnement de développement?",
            "Donnez un exemple de situation où vous avez dû apprendre rapidement une nouvelle technologie.",
            "Racontez une expérience où vous avez dû expliquer un concept technique complexe à un public non technique."
        ] if job_category == "tech" else [
            "Décrivez une campagne marketing que vous avez dirigée et qui a dépassé les objectifs.",
            "Parlez-moi d'une situation où vous avez dû vous adapter rapidement à un changement de stratégie.",
            "Comment avez-vous géré un projet marketing avec un budget limité?",
            "Donnez un exemple de situation où vous avez utilisé les données pour ajuster une stratégie marketing.",
            "Racontez une expérience où vous avez dû convaincre des parties prenantes d'adopter votre approche marketing."
        ]
    
    if "situational" in scenario_types:
        scenarios["situational"] = [
            "Comment réagiriez-vous si vous découvriez une faille de sécurité critique juste avant une mise en production?",
            "Que feriez-vous si un membre clé de l'équipe quittait le projet en plein développement?",
            "Comment procéderiez-vous si vous deviez reprendre un projet mal documenté avec un code legacy complexe?",
            "Quelle serait votre approche si vous étiez en désaccord avec la direction technique prise par votre équipe?",
            "Comment géreriez-vous une situation où les exigences du projet changent significativement en cours de route?"
        ] if job_category == "tech" else [
            "Comment réagiriez-vous si une campagne marketing importante ne donnait pas les résultats escomptés?",
            "Que feriez-vous si vous découvriez qu'un concurrent a lancé un produit similaire juste avant votre lancement?",
            "Comment procéderiez-vous si votre budget marketing était soudainement réduit de moitié?",
            "Quelle serait votre approche si vous receviez des retours négatifs sur une campagne que vous avez conçue?",
            "Comment géreriez-vous une crise de réputation sur les réseaux sociaux?"
        ]
    
    if "roleplay" in scenario_types:
        scenarios["roleplay"] = [
            {
                "title": "Explication technique à un client non technique",
                "description": "Vous devez expliquer un problème technique complexe à un client qui n'a pas de connaissances techniques. Comment procédez-vous pour vous assurer qu'il comprend les enjeux?",
                "evaluation_criteria": "Clarté de la communication, capacité à vulgariser, empathie, vérification de la compréhension"
            },
            {
                "title": "Résolution de problème en équipe",
                "description": "Votre équipe est bloquée sur un bug critique qui affecte la production. Comment organisez-vous la résolution du problème?",
                "evaluation_criteria": "Méthodologie de résolution de problèmes, collaboration, gestion du stress, communication"
            },
            {
                "title": "Revue de code avec un développeur junior",
                "description": "Vous devez faire une revue de code avec un développeur junior qui a commis plusieurs erreurs. Comment abordez-vous cette situation?",
                "evaluation_criteria": "Pédagogie, feedback constructif, patience, capacité à mentorer"
            }
        ] if job_category == "tech" else [
            {
                "title": "Présentation d'une stratégie marketing à la direction",
                "description": "Vous devez présenter une nouvelle stratégie marketing à la direction. Comment structurez-vous votre présentation pour convaincre?",
                "evaluation_criteria": "Capacité à convaincre, structure de la présentation, anticipation des questions, connaissance du sujet"
            },
            {
                "title": "Gestion d'une crise sur les réseaux sociaux",
                "description": "Votre entreprise fait face à une crise sur les réseaux sociaux suite à un commentaire mal interprété. Comment gérez-vous la situation?",
                "evaluation_criteria": "Réactivité, gestion de crise, communication externe, résolution de problèmes"
            },
            {
                "title": "Négociation avec une agence externe",
                "description": "Vous devez négocier avec une agence externe pour obtenir de meilleures conditions pour une campagne marketing. Comment abordez-vous cette négociation?",
                "evaluation_criteria": "Compétences en négociation, préparation, argumentation, résolution de conflits"
            }
        ]
    
    return {
        "job_category": job_category,
        "key_skills": key_skills,
        "key_responsibilities": key_responsibilities,
        "scenarios": scenarios,
        "timestamp": datetime.now().isoformat()
    }
