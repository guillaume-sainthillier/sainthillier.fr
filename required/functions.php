<?php

function sendMail($fromName, $to, $sujet, $body) {
    $transport = Swift_SmtpTransport::newInstance(EMAIL_SERVER, EMAIL_PORT, EMAIL_TRANSPORT)
        ->setUsername(EMAIL_USER)
        ->setPassword(EMAIL_PASSWORD)
    ;

    $mailer = Swift_Mailer::newInstance($transport);

    $message = Swift_Message::newInstance($sujet)
        ->setFrom([EMAIL_SENDER => $fromName])
        ->setTo(is_array($to) ? $to : [$to])
        ->setBody($body, 'text/html')
    ;

    return $mailer->send($message) > 0;
}

function isHTTPS() {
    return isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
}
function getLink($file = null, $absolute = true) {
    return 'http' . (isHTTPS() ? 's' : '') . '://' . str_replace('//', '/', $_SERVER['HTTP_HOST'] .
        $_SERVER['REQUEST_URI'] .
        $file);
}

function getDescriptions() {
    return [
        "Actuellement travailleur indépendant au statut freelance, je me spécialise dans le domaine du développement Web
et logiciel.",
        "J'aime travailler dans des entreprises résolument tournées vers les technologies innovantes, et m'intégrer au
        sein d'équipes dynamiques et passionnées."
    ];
}

function getCompetences()
{
    return [
        "PHP" => 90,
        "POO & Design Patterns" => 90,
        "Javascript & jQuery" => 85,
        "HTML5 & CSS3" => 80,
        "MySQL / Oracle / SQL Server" => 80,
        "Symfony 2/3/4" => 75,
    ];
}

function getDistinctKeyworkds($realisations) {
    $distinctKeywords = [];
    foreach($realisations as $realisation) {
        $distinctKeywords = array_merge($distinctKeywords, $realisation['keywords']);
    }

    return array_unique($distinctKeywords);
}

function getExperiences()
{
    return [
        [
            'periode' => 'Jan 2018 - En cours',
            'entreprise' => 'Freelance',
            'titre' => "Développeur Web PHP",
            'description' => "Développement Web PHP pour Agoranet (groupe ERRA), Toulouse",
            'points' => [
            ],
        ], [
            'periode' => 'Sept 2015 - Jan 2018',
            'entreprise' => '<a itemprop="url" href="http://www.apside.fr/" target="_blank">Apside</a>',
            'titre' => "Ingénieur d'études",
            'description' => "Développement Web PHP pour Latécoère, Toulouse",
            'points' => [
                'Travail sur les domaines MES (production), RH et Finances',
                'Compréhension des besoins utilisateurs',
                'Analyse, chiffrage, développement et maintenances d\'applications Intranet (60+)',
                'Utilisation du Framework JS <a href="http://angular.io">AngularJS</a> et des composants Symfony 3',
            ],
        ], [
            'periode' => 'Août 2013 - Août 2015',
            'entreprise' => '<a itemprop="url" title="Aller sur le site du Centre de Consultation Médicale Maritime" href="http://www.chu-toulouse.fr/-centre-de-consultation-medicale-maritime-ccmm-" target="_blank">CHU Purpan - CCMM/SAMU&nbsp;31</a>',
            'titre' => "Développeur PHP",
            'description' => "Conception, développement et maintenance de modules d’une application de gestion des dossiers patients:",
            'points' => [
                'Développement <a href="http://symfony.com/">Symfony2</a>.',
                'Amélioration des interfaces homme-machine.',
                'Amélioration du système de reporting.',
                'Sécurisation des données médicales.',
                'Ouverture du système aux différents partenaires de l\'assistance médicale en mer.',
                'Utilisation de SVN et Git pour les applications de l\'entreprise.',
            ],
        ], [
            'periode' => 'Fév 2013 - Mai 2013',
            'entreprise' => '<a itemprop="url" title="Aller sur le site de TripAndTeuf" href="http://www.tripandteuf.com">TripAndTeuf</a>',
            'titre' => "Développeur PHP",
            'description' => "Maintenance du site de l'association:",
            'points' => [
                'Conception et développement d\'un mini-framework.',
                'Migration du site de PHP 4 à PHP 5.3.',
                'Utilisation de SVN pour le site de l\'association.'
            ],
        ], [
            'periode' => 'Jan 2011 - Fév 2013',
            'entreprise' => '<a itemprop="url" href="http://www.icm-services.fr/" title="Aller sur le site d\'ICM Services">ICM Services</a>',
            'titre' => "Développeur PHP",
            'description' => "Maintenance et développement de modules sur une application à destination des Polices Municipales:",
            'points' => [
                'Utilisation de framework PHP : <a title="Aller sur le site d\'OpenMairie" href="http://www.openmairie.org/">OpenMairie</a>.',
                'Amélioration du Framework.',
                'Développement d\'une plateforme de statistiques.',
                'Conception et développement d\'outils back-end.',
                'Automatisation du déploiement des solutions.',
                'Mise en place et utilisation de SVN pour les sites de l\'entreprise.',
            ],
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
            'description' => "<p>By Night est une plateforme d'agrégation d'événements qui a pour vocation de simplifier la recherche des différents événements culturels dans les plus grandes villes de France telles que Paris et Toulouse, et bientôt Marseille, Lyon et Montpellier.</p>
<p>Un accès libre permet également à des organisateurs d'événements de :</p>
<ul class='fa-ul'>
    <li><i class='fa-li fa fa-angle-right'></i> Créer de nouveaux événements</li>
    <li><i class='fa fa-li fa-angle-right'></i> Importer ses événements Facebook sur la plateforme</li>
    <li><i class='fa-li fa fa-angle-right'></i> Diffuser ses événements de la plateforme vers les réseaux sociaux</li>
    <li><i class='fa-li fa fa-angle-right'></i> Analyser la portée de leurs événements</li>
</ul>",
            'licence' => 'http://opensource.org/licenses/MIT',
            'url' => 'http://by-night.fr',
            'image' => 'by-night.png',
            'keywords' => ['OpenData', 'PHP', 'Responsive Design', 'Symfony 4', 'Docker', 'ElasticSearch']
        ], [
            'nom' => 'Open ePM',
            'description' => "<p>Open ePM est une application Web open source, à destination des Polices Municipales.</p>
<p>Elle permet, en outre, de gérer:</p>
<ul class='fa-ul'>
    <li><i class='fa fa-li fa-angle-right'></i>Les main courantes et les affaires</li>
    <li><i class='fa fa-li fa-angle-right'></i>La production des rapports PV</li>
    <li><i class='fa fa-li fa-angle-right'></i>La déclaration et suivi des animaux dangereux</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des objets perdus et trouvés</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des OTV, OTS, surveillances Magasins..</li>
    <li><i class='fa fa-li fa-angle-right'></i>La mise en fourrière des véhicules</li>
    <li><i class='fa fa-li fa-angle-right'></i>La gestion des vacations funéraires</li>
</ul>
<i class='fa fa-group'></i> Sous la direction d'Antoine Coelho et Denis Coujou",
            'licence' => 'http://opensource.org/licenses/MIT',
            'url' => 'https://prod.logilibres.org/epmdemo',
            'image' => 'epm.png',
            'keywords' => ['OpenMairie', 'PHP']
        ], [
            'nom' => 'Les Mots à la Pelle',
            'description' => "<p><i class='icon-li icon-quote-left'></i>Les Mots à La Pelle sont nés de 4 volontés individuelles désirant œuvrer de manière collective dans le champ de la langue et de l’écriture. <i class='icon-li icon-quote-right'></i></p>
<p>Membres fondatrices:</p>
<ul class='icons-ul'>
    <li><i class='icon-li icon-double-angle-right '></i>Audrey Chalumeau</li>
    <li><i class='icon-li icon-double-angle-right '></i>Florence Hude</li>
    <li><i class='icon-li icon-double-angle-right '></i>Sophie Negrin</li>
    <li><i class='icon-li icon-double-angle-right '></i>Aurélie Guilbaud</li>
</ul>
<i class='fa fa-group'></i> En collaboration avec Florian&nbsp;Baillagou, Romain&nbsp;Lenormand et Fabien&nbsp;Puchol",
            'licence' => 'http://opensource.org/licenses/MIT',
            'url' => 'http://malp.sainthillier.fr',
            'image' => 'malp.png',
            'keywords' => ['PHP', 'WebSocket']
        ], [
            'nom' => 'iScore',
            'description' => "<p>iScore est l'interface d'administration d'un projet de gestion de concerts de musique.</p>
<p>Dans le cadre d'une collaboration avec des étudiants de 5<sup>ème</sup> année, l'application permet de gérer un parc d'instruments de musique et de musiciens, mais aussi de créer des configuration de concerts qui seront utilisés par les musiciens lors de leur répétition.</p>
<i class='fa fa-group'></i> En collaboration avec Alexandre&nbsp;Bongard et Thomas&nbsp;Folguerald",
            'licence' => 'http://opensource.org/licenses/MIT',
            'url' => 'http://iscore.sainthillier.fr',
            'image' => 'iscore.png',
            'keywords' => ['PHP', 'SVG']
        ],
    ];
}
