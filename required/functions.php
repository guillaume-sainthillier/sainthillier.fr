<?php

function render($template, array $parameters = [])
{
    $loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');

    $twig = new \Twig\Environment($loader, [
        'cache' => __DIR__ . '/../cache',
        'debug' => ENV === 'dev',
        'strict_variables' => ENV === 'dev'
    ]);

    $filter = new \Twig\TwigFilter('retina', 'getRetina');
    $twig->addFilter($filter);

    $twig->addGlobal('RECAPTCHA_SITE_KEY', RECAPTCHA_SITE_KEY);
    $twig->addGlobal('LINKED_IN', LINKED_IN);
    $twig->addGlobal('GITHUB', GITHUB);

    return $twig->render($template, $parameters);
}

function sendMail($fromName, $to, $sujet, $body)
{
    $transport = (new Swift_SmtpTransport(EMAIL_SERVER, EMAIL_PORT, EMAIL_TRANSPORT))
        ->setUsername(EMAIL_USER)
        ->setPassword(EMAIL_PASSWORD);

    $mailer = new Swift_Mailer($transport);

    $message = (new Swift_Message($sujet))
        ->setFrom([EMAIL_SENDER => $fromName])
        ->setTo(is_array($to) ? $to : [$to])
        ->setBody($body, 'text/html');

    return $mailer->send($message) > 0;
}

function getCompetences()
{
    return [
        "PHP" => 10,
        "Symfony" => 10,
        "PrestaShop" => 4,
        "WordPress" => 3,
        "Drupal 8" => 3,
        "Intégration Web" => 6,
        "Responsive Design" => 7,
        "Sass" => 6,
        "Gulp" => 5,
        "MySQL" => 8,
        "Oracle" => 5,
        "Scrum" => 4,
        "Git" => 6,
        "Docker" => 9,
        "DevOps" => 5,
        "App hybride" => 5,
        "ElasticSearch" => 5
    ];
}

function getRetina($image, $density)
{
    $infos = pathinfo($image);

    return sprintf('%s@%dx.%s', $infos['filename'], $density, $infos['extension']);
}

function getExperiences()
{
    return [
        [
            'periode' => 'Jan 2018 - Dec 2018',
            'logo' => 'Agoranet.jpg',
            'entreprise' => '<a itemprop="url" href="https://www.apside.com/" target="_blank">Apside</a>',
            'client' => 'Agoranet',
            'titre' => "Développeur Full Stack Freelance",
            'description' => "Réalisation de projets d'applications Web et sites vitrines, principalement pour le client Airbus.",
            'points' => [
            ],
        ], [
            'periode' => 'Sept 2015 - Jan 2018',
            'logo' => 'Latécoère.jpg',
            'client' => 'Groupe Latécoère',
            'entreprise' => '<a itemprop="url" href="https://www.apside.com/" target="_blank">Apside</a>',
            'titre' => "Développeur Full Stack",
            'description' => "Tierce Maintenance Applicative sur les applications métiers de l'entreprise (Manufacturing, RH, Finances).",
            'points' => [
                'Travail sur les domaines MES (production), RH et Finances',
                'Compréhension des besoins utilisateurs',
                'Analyse, chiffrage, développement et maintenances d\'applications Intranet (60+)',
                'Utilisation du Framework JS <a href="https://angular.io">AngularJS</a> et des composants Symfony 3',
            ],
        ], [
            'periode' => 'Août 2013 - Août 2015',
            'logo' => 'CHU_Toulouse.jpg',
            'client' => 'CCMM - SAMU 31',
            'entreprise' => null,
            'via' => '<a itemprop="url" title="Aller sur le site du Centre de Consultation Médicale Maritime" href=https://www.chu-toulouse.fr/-centre-de-consultation-medicale-maritime-ccmm-" target="_blank">CHU Purpan - CCMM/SAMU&nbsp;31</a>',
            'titre' => "Développeur Full Stack",
            'description' => "Conception, développement et maintenance de modules d’une application de gestion des dossiers patients.",
        ], [
            'periode' => 'Avr 2011 - Fév 2013',
            'logo' => 'ICM_Services.jpg',
            'client' => 'ICM Services',
            'entreprise' => null,
            'titre' => "Développeur Full Stack",
            'description' => "Maintenance et développement de modules sur une application à destination des Polices Municipales.",
        ]
    ];
}

function getFormations()
{
    return [
        [
            'periode' => '2013 - 2015',
            'nom' => 'Master <abbr title="Informatique Collaborative en Entreprise">ICE</abbr>, Toulouse. France',
            'titre' => 'BAC +5 niveau I',
            'description' => 'Le Master ICE apporte la nécessaire maîtrise des techniques et outils de développement informatiques, tout particulièrement dans un contexte collaboratif.',
            'points' => [
                'Outils collaboratifs',
                'Gestion de projet',
                'Alernance',
            ],
        ], [
            'periode' => '2012 - 2013',
            'nom' => 'Licence L3 <abbr title="Mathématiques et Informatique Appliqués aux Sciences Humaines et Sociales">MIASHS</abbr>, Toulouse. France',
            'titre' => 'BAC +3 niveau II',
            'description' => 'La Licence MIASHS associe l\'étude des mathématiques et de l\'informatique à l\'étude d\'une discipline dans le domaine des sciences humaines et sociales.',
            'points' => [
                'Programmation Fonctionnelle',
                'Sciences Humaines',
                'Stage',
            ],
        ], [
            'periode' => '2009 - 2012',
            'nom' => 'DUT Informatique et Gestion, Blagnac. France',
            'titre' => 'BAC +2 niveau III',
            'description' => 'Le département informatique de l’IUT de Blagnac a pour vocation d’apporter les compétences techniques et les aptitudes professionnelles nécessaires au développement et à la mise en œuvre d’outils informatiques dans les entreprises.',
            'points' => [
                'Programmation Web et logicielle',
                'Gestion de parcs informatiques',
                'Stage',
            ],
        ],
    ];
}

function getRealisations()
{
    return [
        [
            'nom' => 'By Night',
            'sous_titre' => 'Projet personnel',
            'date' => 'Octobre 2013 - En Cours',
            'description' => "<p>By Night est une plateforme d'aggrégation d'événements qui a pour vocation de simplifier la recherche des événements culturels dans les plus grandes villes de France telles que Paris, Toulouse, Lyon, Bordeaux ou Montpellier.</p>
<p class='mb-2'>Un accès libre permet également à des organisateurs d'événements de :</p>
<ul class='fa-ul'>
    <li><i class='fa-li fa fa-angle-right'></i>Créer de nouveaux événements</li>
    <li><i class='fa-li fa fa-angle-right'></i>Importer leurs événements depuis Facebook vers l'application</li>
    <li><i class='fa-li fa fa-angle-right'></i>Exporter des événements de la plateforme vers les autres réseaux sociaux</li>
    <li><i class='fa-li fa fa-angle-right'></i>Analyser la portée de leurs événements</li>
</ul>",
            'url' => 'http://by-night.fr',
            'image' => 'by-night.jpg',
            'keywords' => ['PHP', 'Symfony 4', 'Docker', 'MySQL', 'ElasticSearch', 'LESS', 'Responsive Design', 'OpenData']
        ], [
            'nom' => 'Airbus Publishing',
            'sous_titre' => 'Développeur Full Stack Freelance',
            'date' => 'Mars 2018 - Juin 2018',
            'description' => "<p>Pour le service Airbus MultiMedia Support. Ce service Web permet en interne la demande de travaux graphiques au sein du Groupe Airbus.</p>",
            'image' => 'mms.jpg',
            'keywords' => ['PHP', 'Symfony 4', 'Docker', 'MySQL', 'SASS', 'Responsive Design', 'SSO', 'SAML']
        ], [
            'nom' => 'Exterior Walkaround',
            'sous_titre' => 'Développeur Full Stack Freelance',
            'date' => 'Juin 2018',
            'description' => "<p>Pour le service Airbus MultiMedia Support. Cette application mobile permet aux pilotes de ligne de vérifier avant le décollage certains points de contrôle de l'extérieur de l'avion avec des exemples illustrés de problèmes déjà rencontrés à ces endroits.</p>",
            'image' => 'exterior-walkaround.jpg',
            'keywords' => ['PHP', 'Symfony 4', 'Docker', 'MySQL', 'SASS']
        ], [
            'nom' => 'Safety Index',
            'sous_titre' => 'Développeur Full Stack Freelance',
            'date' => 'Mai 2018',
            'description' => "<p>Pour le service Airbus MultiMedia Support. Cette application mobile permet aux “Safety Officers“ de vérifier quelles améliorations physiques ou logicielles peuvent être effectuées sur les composants de leur flotte d'avion.</p>",
            'image' => 'safety-index.jpg',
            'keywords' => ['PHP', 'Symfony 4', 'Docker', 'MySQL', 'SASS', 'Responsive Design']
        ], [
            'nom' => 'Open ePM',
            'sous_titre' => 'Développeur Full Stack',
            'date' => 'Avril 2011 - Février 2013',
            'description' => "<p>Pour la société ICM Services. Open ePM est une application Web Open Source à destination des Polices Municipales.</p>
<p class='mb-2'>Elle permet, en outre, de gérer:</p>
<ul class='fa-ul'>
    <li><i class='fa fa-li fa-angle-right'></i>Les main courantes et les affaires</li>
    <li><i class='fa fa-li fa-angle-right'></i>La production des rapports PV</li>
    <li><i class='fa fa-li fa-angle-right'></i>La déclaration et suivi des animaux dangereux</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des objets perdus et trouvés</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des OTV, OTS, surveillances Magasins..</li>
    <li><i class='fa fa-li fa-angle-right'></i>La mise en fourrière des véhicules</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des vacations funéraires</li>
</ul>
<p class='mb-2'>Sous la direction d'Antoine Coelho et Denis Coujou</p>",
            'url' => 'https://prod.logilibres.org/epmdemo',
            'image' => 'epm.jpg',
            'keywords' => ['PHP', 'OpenMairie', 'fPDF', 'jQuery UI']
        ]
    ];
}
