---
title: 'Développeur web freelance à Toulouse'
description: 'Développeur web freelance PHP / Symfony à Toulouse : missions de 2 jours à 2 ans, sur site ou en télétravail. TJM de {{< freelance-rate >}} ou forfait sur devis.'
layout: homepage
# Technology chips (skills, services, projects): each tag is a name, or { name, highlight } where highlight is
# primary (indigo) or accent (amber)
# Skills section, one card per group
skill_groups:
    - title: Mon cœur de métier
      icon: code
      tags:
          - name: PHP (5.2 à 8+)
          - { name: Symfony (2 à 8), highlight: primary }
          - name: Doctrine ORM
          - name: API Platform
          - name: POO & Design Patterns
    - title: Cloud & DevOps
      icon: cloud
      tags:
          - name: Docker
          - name: Kubernetes (K8s)
          - name: AWS (S3, EC2)
          - name: Pipelines CI/CD
          - name: Git
          - name: Varnish Cache
    - title: Bases & Protocoles
      icon: database
      tags:
          - { name: EBICS, highlight: accent }
          - name: MySQL
          - name: PostgreSQL
          - name: Oracle
          - name: SQL Server
          - name: Redis
          - name: Elasticsearch
          - name: RabbitMQ
          - name: SAML / SSO
    - title: Front & Intégration
      icon: monitor-smartphone
      tags:
          - name: Responsive Design
          - name: SCSS / Sass
          - name: React
          - name: Intégration web
          - name: JavaScript ES6+
          - name: fPDF / Génération PDF
# "Vous vous reconnaissez dans l’une de ces situations ?" cards
situations:
    - label: Reprise & dette technique
      icon: wrench
      title: Application figée ou prestataire parti
      text: "Votre prestataire historique s’est désengagé ou reste injoignable. Le code accumule de la dette, chaque mise en production est redoutée et les anomalies du quotidien ralentissent vos utilisateurs comme votre développement commercial."
      answer_title: Cap sur la sérénité
      answer_icon: badge-check
      answer: "Audit de l’existant sous 48h, fiabilisation de l’architecture et reprise en main rapide et sécurisée des applications."
    - label: Protocoles & réglementation
      icon: landmark
      title: Virage bancaire & conformité réglementaire
      text: "L’intégration des télétransmissions bancaires via EBICS, l’orchestration des flux SEPA ou la réforme de la facturation électronique (2026-2027) représentent des défis critiques où l’improvisation n’a pas sa place face aux exigences légales."
      answer_title: Mise en conformité rapide
      answer_icon: shield-check
      answer: "Intégration EBICS de bout en bout, déjà en production : de la lettre d’initialisation remise à votre banque jusqu’à l’envoi automatisé de vos fichiers SEPA."
      accent: true
    - label: Vélocité & renfort
      icon: rocket
      title: Roadmap saturée & besoin d’un senior
      text: "Votre équipe croule sous les demandes métier, recruter en interne prend des mois et le recours aux ESN traditionnelles apporte souvent des profils juniors nécessitant un temps de formation que vous n’avez pas."
      answer_title: Autonomie immédiate
      answer_icon: zap
      answer: "Intégration directe à vos sprints dès le premier jour, décisions d’architecture tranchées, code propre et partage d’expérience continu avec vos équipes."
# Service pillars; "tone" picks the icon and check colors (primary, accent or tertiary)
services:
    - number: Métier
      icon: square-terminal
      tone: primary
      title: Développement web sur mesure
      intro: Conception d’outils métier fiables répondant aux spécificités de votre secteur.
      points:
          - Nouveau projet pour moderniser la gestion quotidienne de votre métier.
          - Projet complexe avec de nombreuses intégrations aux SI.
          - Reprise de code existant et résorption de dette technique.
          - Assistance technique et renfort d’équipe de développement.
      tags_label: Technologies clés
      tags: [PHP, { name: Symfony, highlight: primary }, API Platform, MySQL, React, Tailwind, GitLab]
    - number: Protocoles
      icon: landmark
      tone: accent
      title: Expertise & besoins avancés
      intro: Interventions sur des protocoles pointus, migrations et infrastructure haute disponibilité.
      points:
          - Migrations majeures de frameworks (Symfony, React…) et refactorisation.
          - 'CI/CD : mise en place ou optimisation sur GitLab, GitHub, Bitbucket…'
          - 'Protocole bancaire EBICS : intégration dans votre application PHP existante.'
          - Audit de performances, requêtes SQL et sécurité.
      tags_label: Normes & outils
      tags: [GitLab, { name: EBICS, highlight: accent }, AWS, Docker, CI/CD]
    - number: Mentorat
      icon: graduation-cap
      tone: tertiary
      title: Formation & mentorat
      intro: Partager la connaissance avec passion et former les équipes techniques aux meilleures pratiques logicielles.
      points:
          - Montée en compétences en entreprise des équipes techniques.
          - Interventions spécialisées en écoles d’ingénieurs et formation.
          - Modules universitaires de POO, design patterns et architecture.
          - Accompagnement méthodologique, tests et revues de code.
      tags_label: Modules clés
      tags: [PHP, POO, Doctrine, Docker, API Design, BDD]
faq:
    - question: Comment se déroule le premier échange de 15 minutes ?
      answer: "Un échange en visio ou par téléphone, sans engagement, pour comprendre vos enjeux, évaluer l’adéquation technique et vous proposer une première feuille de route."
    - question: Pouvez-vous intervenir sur une application legacy ou du code existant ?
      answer: "Oui, c’est une intervention fréquente : audit de code, reprise en main, refactorisation, résorption de dette technique et montées de version Symfony sans interruption d’activité."
    - question: Intervenez-vous au forfait ou en régie ?
      answer: 'Les deux modalités sont possibles : en régie ({{ rate }}) pour du renfort récurrent ou sur des chantiers agiles, ou au forfait pour des livrables aux spécifications arrêtées.'
    - question: Pouvez-vous intervenir via une ESN ou une plateforme de mise en relation ?
      answer: "Oui : je facture via ma société SILARHI, en direct ou en sous-traitance d’une ESN ou d’une plateforme. Seul le cadre contractuel change : vous gardez le même interlocuteur technique du début à la fin de la mission."
    - question: Quel est le délai de démarrage pour une mission ?
      answer: "Une mission peut démarrer sous 48h, selon mes disponibilités du moment et le degré d’urgence de votre projet."
    - question: Quel est votre usage de l’IA pour accélérer les développements ?
      answer: "J’intègre les outils d’IA (assistants de code, génération de tests automatisés, prototypage rapide, documentation) dans ma chaîne de production. Cela permet de livrer plus vite, d’éliminer les tâches répétitives et de concentrer la réflexion sur l’architecture, la robustesse métier et la sécurité de votre code."
# Contact form need types: the message placeholder and help text follow the selected need
contact_needs:
    - id: custom-app
      label: Nouvelle application sur mesure
      placeholder: 'Ex : cahier des charges, fonctionnalités clés (back-office, API, portail client), échéance souhaitée…'
      help: "Indiquez vos objectifs majeurs, l’échéance visée et les éventuelles contraintes d’infrastructure."
    - id: legacy-maintenance
      label: Reprise / maintenance d’une application existante
      placeholder: 'Ex : version Symfony / PHP actuelle, état de la documentation, bugs récurrents ou dette technique à résorber…'
      help: "Précisez l’accès au code existant, les versions actuelles et les points critiques de blocage."
    - id: tech-assistance
      label: Assistance technique
      placeholder: 'Ex : rôle recherché, charge estimée (jours / semaine), stack technique de votre équipe, date de début…'
      help: 'Indiquez les modalités de travail souhaitées (à distance ou sur site à Toulouse) et le volume de renfort envisagé.'
    - id: banking-ebics
      label: Intégration bancaire
      placeholder: 'Ex : protocole EBICS T, formats XML ISO 20022 / pain, banque partenaire, télétransmission de prélèvements ou virements…'
      help: 'Précisez la banque partenaire et les flux concernés (relevés camt.053, ordres pain.001 / pain.008).'
    - id: e-invoicing
      label: Mise en conformité à la facturation électronique
      placeholder: 'Ex : formats Factur-X / UBL, intégration à une plateforme agréée, volumétrie de factures…'
      help: 'Indiquez vos outils de facturation actuels et les échanges à mettre en place pour la réforme.'
    - id: training
      label: Formation
      placeholder: 'Ex : thématique (Symfony, Docker, PHP objet), profil des apprenants (salariés, étudiants), durée et format visés…'
      help: "Précisez le niveau technique d’entrée des participants et le nombre d’heures ou de jours envisagés."
    - id: other
      label: Autre
      placeholder: 'Ex : décrivez librement votre problématique technique ou laissez simplement vos coordonnées pour être rappelé…'
      help: "Résumez les grandes lignes de votre demande, je reviens vers vous rapidement."
# Career timeline, shown in reverse order: the last entry comes first and is highlighted as the current position;
# "employer" is the consulting firm the mission went through (linked to "employer_url" when set), "badge" an optional
# label next to the title
experiences:
    - period: Avr 2011 - Fév 2013
      logo: images/logos/ICM_Services.jpg
      client: ICM Services
      title: Développeur Full Stack
      description: Maintenance et développement de modules sur une application à destination des polices municipales.
      tags: [Collectivités, Open Source, PHP, MySQL, tcPDF]
    - period: Août 2013 - Août 2015
      logo: images/logos/CHU_Toulouse.jpg
      client: CCMM - SAMU 31
      title: Développeur Full Stack
      description: Conception, développement et maintenance de modules d’une application de gestion des dossiers patients.
      tags: [Santé, Urgence, Haute Disponibilité, PHP, MySQL]
    - period: Sept 2015 - Jan 2018
      logo: images/logos/Latecoere.jpg
      client: Groupe Latécoère
      employer: Apside
      employer_url: https://apside.com
      title: Développeur Full Stack
      description: Tierce Maintenance Applicative (TMA) et évolutions majeures sur les applications métier de l’avionneur (Manufacturing, RH, Finances).
      tags: [Aéronautique, Manufacturing, ERP, OracleDB, PHP]
    - period: Jan 2018 - Déc 2018
      logo: images/logos/Agoranet.jpg
      employer: Apside
      employer_url: https://apside.com
      client: Agoranet
      title: Développeur Full Stack freelance
      description: Réalisation de projets d’applications web et sites vitrines, principalement pour le client Airbus.
      tags: [Agence de communication, Symfony, Docker, SSO-SAML]
    - period: Sept 2020 - Sept 2021
      logo: images/logos/Webforce3.jpg
      client: Webforce3
      title: Formateur freelance
      description: Animation de sessions de formation dans le domaine du développement web, autour de la programmation orientée objet.
      tags: [Formation, Pédagogie, PHP, POO, Mentorat]
    - period: Août 2018 - Aujourd’hui
      logo: images/logos/Silarhi.jpg
      client: SILARHI
      title: Développeur Full Stack freelance
      badge: Gérant
      description: "Création de l’entreprise de développement d’applications web. Ma mission : donner vie à vos projets web avec robustesse et sérénité. Édition SaaS et accompagnement direct de clients variés : de la jeune start-up aux grands groupes."
      tags: [Freelance, Symfony, Architecture SaaS, EBICS, Toulouse]
# Education, kept for reference: no template displays it for now
education:
    - period: 2013 - 2015
      name: Master <abbr title="Informatique Collaborative en Entreprise">ICE</abbr>, Toulouse.
          France
      title: BAC +5 niveau I
      description: Le Master ICE apporte la nécessaire maîtrise des techniques et outils
          de développement informatiques, tout particulièrement dans un contexte collaboratif.
      points:
          - Outils collaboratifs
          - Gestion de projet
          - Alternance
    - period: 2012 - 2013
      name: Licence L3 <abbr title="Mathématiques et Informatique Appliqués aux Sciences
          Humaines et Sociales">MIASHS</abbr>, Toulouse. France
      title: BAC +3 niveau II
      description: La Licence MIASHS associe l’étude des mathématiques et de l’informatique
          à l’étude d’une discipline dans le domaine des sciences humaines et sociales.
      points:
          - Programmation Fonctionnelle
          - Sciences Humaines
          - Stage
    - period: 2009 - 2012
      name: DUT Informatique et Gestion, Blagnac. France
      title: BAC +2 niveau III
      description: Le département informatique de l’IUT de Blagnac a pour vocation d’apporter
          les compétences techniques et les aptitudes professionnelles nécessaires au développement
          et à la mise en œuvre d’outils informatiques dans les entreprises.
      points:
          - Programmation Web et logicielle
          - Gestion de parcs informatiques
          - Stage
# Portfolio filter buttons; projects reference them by id in "categories"
portfolio_filters:
    - id: fintech
      label: Fintech & EBICS
    - id: real-estate
      label: Immobilier & BTP
    - id: data
      label: Data & Scale
    - id: industry
      label: Industrie
# Projects shown before the "Afficher tous les projets" button
portfolio_visible: 6
# Projects: "tagline" is the one-line subtitle, "status" an optional badge on the picture; the picture is a 16:10
# screenshot cropped from the top, "image_position: center" keeps a phone mockup centered instead
projects:
    - id: cibaru
      name: CIBARU
      tagline: Gestion de mandats de travaux & sous-traitance
      status: En production
      date: Juil 2025 - En cours
      description: Application web permettant aux mandataires de gérer leurs demandes de travaux, d’orchestrer la sous-traitance à des collaborateurs et d’assurer le suivi direct de leur facturation.
      url: https://cibaru.fr
      case_study: https://silarhi.fr/projets/cibaru
      image: images/realisations/cibaru.jpg
      categories: [real-estate]
      tags: [PHP, Symfony, MySQL, SCSS, AWS]
    - id: netisio
      name: Netisio
      tagline: Télérelève d’eau & d’énergie pour copropriétés
      status: En production
      date: Avr 2024 - En cours
      description: "Suivi de consommation d’équipements pour copropriétés : détection en temps réel des fuites et mise en conformité avec la nouvelle tarification réglementaire de l’eau."
      url: https://netisio.fr
      case_study: https://silarhi.fr/projets/netisio
      image: images/realisations/netisio.jpg
      categories: [real-estate, data]
      tags: [PHP, Symfony, API Platform, MySQL, Responsive]
    - id: solution-sepa
      name: Solution SEPA
      tagline: Gestion des prélèvements et virements bancaires
      status: Reprise de projet
      date: Avr 2022 - En cours
      description: Gestion automatisée des prélèvements et virements bancaires (uniques ou récurrents) via le protocole sécurisé EBICS et suivi rigoureux de l’exécution bancaire.
      url: https://solution-sepa.fr
      case_study: https://silarhi.fr/projets/solution-sepa
      image: images/realisations/solution-sepa.jpg
      categories: [fintech]
      tags: [EBICS, Symfony, MySQL, S3, SCSS]
    - id: dosloc
      name: DosLoc
      tagline: Gestion des candidatures locatives
      date: Avr 2020 - En cours
      description: Dépôt et partage des pièces justificatives des locataires, centralisation côté bailleur, génération automatisée de dossiers PDF et préparation immédiate du bail locatif.
      url: https://dosloc.fr
      case_study: https://silarhi.fr/projets/dosloc
      image: images/realisations/dosloc.jpg
      categories: [real-estate]
      tags: [PHP, Symfony, MySQL, fPDF]
    - id: immobilus
      name: Immobilus
      tagline: Digitalisation de la gestion immobilière
      date: Mars 2019 - En cours
      description: Enregistrement des locataires, automatisation des loyers et couplage avec le protocole EBICS pour récupérer automatiquement les flux bancaires et rapprocher les relevés.
      url: https://immobilus.fr
      case_study: https://silarhi.fr/projets/immobilus
      image: images/realisations/immobilus.jpg
      categories: [real-estate, fintech]
      tags: [PHP, Symfony, EBICS, MySQL, Responsive]
    - id: by-night
      name: By Night
      tagline: Plateforme d’agrégation d’événements culturels
      date: Oct 2013 - En cours
      description: Plateforme à forte volumétrie (Paris, Toulouse, Lyon, Bordeaux). Import multi-sources, synchronisation Open Data et recherche temps réel avec Varnish & Elasticsearch.
      url: https://by-night.fr
      image: images/realisations/by-night.jpg
      categories: [data]
      tags: [PHP, Symfony, Elasticsearch, RabbitMQ, Docker, S3]
    - id: airbus-publishing
      name: Airbus Publishing
      tagline: Demandes de travaux graphiques
      date: Mars 2018 - Juin 2018
      description: Pour le service Airbus MultiMedia Support. Ce service web permet en interne la demande de travaux graphiques au sein du Groupe Airbus.
      case_study: https://silarhi.fr/projets/airbus-multi-media-support
      image: images/realisations/mms.jpg
      categories: [industry]
      tags: [PHP, Symfony, AWS, Docker, MySQL, SSO, SAML]
    - id: exterior-walkaround
      name: Exterior Walkaround
      tagline: Application web mobile pour pilotes de ligne
      date: Juin 2018
      description: "Pour le service Airbus MultiMedia Support. Cette application web mobile permet aux pilotes de ligne de vérifier avant le décollage certains points de contrôle de l’extérieur de l’avion, avec des exemples illustrés de problèmes déjà rencontrés."
      image: images/realisations/exterior-walkaround.jpg
      image_position: center
      categories: [industry]
      tags: [PHP, Symfony 4, Docker, MySQL, SCSS]
    - id: safety-index
      name: Safety Index
      tagline: Suivi des améliorations de flotte
      date: Mai 2018
      description: Pour le service Airbus MultiMedia Support. Cette application web mobile permet aux « Safety Officers » de vérifier quelles améliorations physiques ou logicielles peuvent être effectuées sur les composants de leur flotte d’avions.
      image: images/realisations/safety-index.jpg
      image_position: center
      categories: [industry]
      tags: [PHP, Symfony 4, Docker, MySQL, SCSS]
    - id: open-epm
      name: Open ePM
      tagline: Logiciel open source pour polices municipales
      date: Avr 2011 - Fév 2013
      description: Pour la société ICM Services. Application web open source de gestion des mains courantes, rapports PV, objets trouvés, mises en fourrière et vacations funéraires.
      url: https://newapp.logilibres.org/
      image: images/realisations/epm.jpg
      categories: []
      tags: [PHP, OpenMairie, fPDF, jQuery UI]
---
