---
title: 'Développeur PHP / Symfony freelance à Toulouse'
description: 'Développeur PHP / Symfony freelance à Toulouse : renfort d’équipe, reprise de projet, montée de version, API Platform, EBICS. Sur site ou à distance, TJM de {{< freelance-rate >}}.'
# Sections rendered by layouts/_default/landing.html; text fields accept Markdown (links, bold)
layout: landing
cta:
    label: 'Échanger sur votre projet'
    url: '/#contact'
intro: 'Je suis **Guillaume Sainthillier**, développeur PHP / Symfony freelance basé à Toulouse. Depuis 2018, je réalise des missions sur des applications web métier construites avec Symfony : nouveaux développements, reprise de projets existants, montées de version et expertise technique.'
# tone: primary (indigo), accent (amber) or success (green) for the icon tile
missions:
    - icon: user-plus
      tone: primary
      title: Renfort de votre équipe
      text: 'J’intègre votre équipe de développement, dans vos locaux à Toulouse ou à distance, et je m’adapte à vos outils et à vos pratiques : revue de code, Git, intégration continue.'
      tags: [Revue de code, Git, Intégration continue]
    - icon: refresh-cw
      tone: accent
      title: Reprise d’un projet Symfony existant
      text: 'Votre prestataire est parti ou l’application a été développée en interne ? Je reprends le code, je le sécurise et je le fais évoluer. C’est le cas de [Solution SEPA](https://silarhi.fr/projets/solution-sepa), une application Symfony que j’ai reprise puis enrichie.'
      tags: [Reprise de code, Sécurité, Dette technique]
    - icon: circle-arrow-up
      tone: primary
      title: Montée de version Symfony
      text: 'Passage vers une version maintenue de Symfony et de PHP, correction des dépréciations et mise à jour des dépendances, en limitant l’impact sur votre activité. De Symfony 2 à Symfony 8.'
      tags: [Symfony 2 → 8, PHP 8, Dépréciations]
    - icon: webhook
      tone: primary
      title: API avec API Platform
      text: 'Conception d’API REST pour vos applications web et mobiles, comme pour [Netisio](https://silarhi.fr/projets/netisio), développé avec Symfony 7 et API Platform 4.'
      tags: [API Platform 4, REST, OpenAPI]
    - icon: landmark
      tone: success
      title: Intégrations bancaires EBICS et CFONB
      text: 'Échanges de fichiers bancaires via le protocole EBICS, virements et prélèvements SEPA, lecture des relevés au format CFONB. Je les ai mis en œuvre pour [Solution SEPA](https://silarhi.fr/projets/solution-sepa) et [Immobilus](https://silarhi.fr/projets/immobilus), et j’ai publié [cfonb-parser](https://github.com/silarhi/cfonb-parser), un parser PHP open source pour les formats CFONB 120 et 240.'
      tags: [EBICS, SEPA, CFONB 120 / 240]
    - icon: gauge
      tone: primary
      title: Audit, performance et industrialisation
      text: 'Audit de sécurité et de performances, infrastructure serveur ou cloud (Docker, AWS), mise en place de l’intégration et du déploiement continus.'
      tags: [Docker, AWS, CI / CD]
# Projects of the homepage portfolio (content/_index.md), picked by id: name, tagline, links and tags come from there
projects:
    - id: cibaru
      icon: hammer
      stack: Symfony 7
    - id: netisio
      icon: radio
      stack: Symfony 7 · API Platform 4
    - id: solution-sepa
      icon: banknote
      stack: Symfony 6 · EBICS
    - id: immobilus
      icon: house
      stack: Symfony 6 · EBICS
    - id: by-night
      icon: music
      stack: Symfony 7 · Elasticsearch
open_source:
    url: https://github.com/silarhi
    packages:
        - name: docker-php
          url: https://github.com/silarhi/docker-php
          text: images Docker PHP + Apache préconfigurées pour Symfony.
        - name: cfonb-parser
          url: https://github.com/silarhi/cfonb-parser
          text: parser PHP des relevés bancaires CFONB 120 et 240.
# "{{ rate }}" is replaced by the daily rate from config.toml
faq:
    - question: Quel est votre tarif journalier (TJM) ?
      answer: 'Mon TJM est de {{ rate }} selon la mission. Pour un projet au périmètre défini, je propose aussi un forfait sur devis gratuit.'
    - question: Travaillez-vous à distance ?
      answer: 'Oui : sur site dans vos locaux à Toulouse, en télétravail partout ailleurs.'
    - question: Quelle est la durée d’une mission ?
      answer: 'De 2 jours pour une intervention ponctuelle (audit, montée de version ciblée, déblocage technique) à 2 ans pour un accompagnement au long cours.'
    - question: Sur quelles versions de Symfony intervenez-vous ?
      answer: 'Sur les versions récentes comme sur des applications plus anciennes à faire évoluer : mes projets vont de Symfony 2 à Symfony 8.'
    - question: Un projet complet à confier ?
      answer: 'Pour un projet clé en main, découvrez [SILARHI](https://silarhi.fr/technologies/symfony), ma société de développement d’applications web.'
---
