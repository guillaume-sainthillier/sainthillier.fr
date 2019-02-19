<?php
require __DIR__ . '/../required/init.php';

$realisations = getRealisations();
$competences = getCompetences();
$experiences = getExperiences();
krsort($experiences); //Sort by year ASC
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#2d89ef">
    <meta name="theme-color" content="#ffffff">

    <meta name="keywords" content="developpeur, web, php, freelance, symfony, toulouse, guillaume, sainthillier, cv">
    <meta name="description"
          content="Développeur Web PHP Freelance à Toulouse. Un freelance pour vos projets informatiques. Contactez-moi et rencontrons-nous !">
    <meta name="author" content="Guillaume Sainthillier">
    <meta property="og:title" content="Développeur Web Freelance à Toulouse - Guillaume Sainthillier">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sainthillier.fr/">
    <meta property="og:image" content="https://sainthillier.fr/img/guillaume_sainthillier.png">
    <link rel="author" href="https://plus.google.com/+guillaumesainthillier">
    <link rel="publisher" href="https://plus.google.com/+guillaumesainthillier">
    <link rel="icon" type="image/x-icon" href="favicon.ico">

    <title>Développeur Web PHP Freelance à Toulouse - Guillaume Sainthillier</title>

    <!-- Custom fonts for this template -->
    <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700|Kaushan+Script:400|Droid+Serif:400,700,400italic,700italic|Roboto+Slab:400,100,300,700' rel='stylesheet' type='text/css'>

    <!-- Custom styles for this template -->
    <link href="vendor/bundle.min.css" rel="stylesheet">
    <link href="css/agency.min.css" rel="stylesheet">
    
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-44318869-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-44318869-1');
    </script>
    <script>
        var config = <?= json_encode(['recaptcha_site_key' => RECAPTCHA_SITE_KEY]) ?>;
    </script>
</head>

<body id="page-top">

<!-- Navigation -->
<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
    <div class="container">
        <a class="navbar-brand js-scroll-trigger" href="#page-top">Guillaume Sainthillier</a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                aria-label="Toggle navigation">
            Menu
            <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav text-uppercase ml-auto">
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#hello">Hello</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#services">Services</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#competences">Compétences</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#portfolio">Portfolio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#experiences">Expériences</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link js-scroll-trigger" href="#contact">Contact</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Header -->
<header class="masthead">
    <div class="masthead-content">
        <div class="container">
            <div class="intro-text">
                <h1 class="intro-lead-in">Freelance Web à Toulouse</h1>
                <div class="intro-heading text-uppercase">Développez votre activité</div>
                <a class="btn btn-primary btn-xl text-uppercase js-scroll-trigger" href="#hello">En savoir plus</a>
            </div>
        </div>
    </div>
</header>

<!-- About -->
<section id="hello">
    <div class="container">
        <div class="text-center">
            <h2 class="section-heading text-uppercase">Hello</h2>
            <h3 class="section-subheading text-muted">Je suis développeur Web Freelance basé à Toulouse.</h3>
        </div>
        <div class="row mb-5">
            <div class="col-md-4 col-lg-3">
                <img class="img-fluid rounded-circle d-block mx-auto"
                     src="img/about/guillaume_sainthillier.jpg"
                     srcset="img/about/guillaume_sainthillier@2x.jpg 2x"
                />
            </div>
            <div class="col-md-8">
                <h3>Concrétisez vos projets Web</h3>
                <p class="text-muted">Actuellement travailleur indépendant, je suis spécialisé dans le domaine du
                    développement d'applications Web PHP sous le framework Symfony.</p>
                <p class="text-muted">Parce que l'informatique doit être une solution et non une contrainte, j'aime
                    développer des outils qui se démarquent par leur valeur ajoutée pour votre activité.</p>
                <p class="text-muted">Expérimenté depuis maintenant plus de 5 ans, j'ai travaillé pour divers secteurs
                    d'activités : collectivités locales, santé, ressources humaines et industries aéronautiques.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 col-lg-3 order-md-2">
                <img class="img-fluid rounded-circle d-block mx-auto"
                     src="img/about/design.jpg"
                     srcset="img/about/design@2x.jpg 2x"
                     width="300"
                     height="300"
                />
            </div>
            <div class="col-md-8 order-md-1">
                <h3>Optez pour un développeur Freelance</h3>
                <p class="text-muted">J'interviens sur toutes les phases du projet : définition du besoin, analyse, conception, réalisation, tests, déploiement et maintenance.</p>
                <p class="text-muted">J'ai eu l'occasion de travailler sur des projets informatiques de différentes
                    natures :
                    applications métiers (desktop / tablette / mobile), extranet, intranet, site vitrine, référencement.</p>
                <p class="text-muted">Que vous soyez une petite entreprise, une agence Web ou une entreprise côtée en bourse, contactez-moi
                    et voyons ensemble comment développer votre activité !</p>
            </div>
        </div>
    </div>
</section>

<!-- Services -->
<section id="services" class="bg-light">
    <div class="container text-center">
        <h2 class="section-heading text-uppercase">Mes Services</h2>
        <h3 class="section-subheading text-muted">Donnons vie <span>ensemble</span> à vos projets informatiques.</h3>
        <div class="row">
            <div class="col-md-4">
                <span class="fa-stack fa-4x">
                  <i class="fas fa-circle fa-stack-2x text-primary"></i>
                  <i class="fas fa-walking fa-stack-1x fa-inverse"></i>
                </span>
                <h4 class="service-heading">Régie</h4>
                <p class="text-muted">Je travaille au sein de vos locaux pour une durée définie (qui peut bien sûr évoluer). Je peux intervenir seul
                    ou renforcer votre équipe.</p>
            </div>
            <div class="col-md-4">
                <span class="fa-stack fa-4x">
                  <i class="fas fa-circle fa-stack-2x text-primary"></i>
                  <i class="fas fa-book fa-stack-1x fa-inverse"></i>
                </span>
                <h4 class="service-heading">Forfait</h4>
                <p class="text-muted">Je réponds à votre cahier des charges et vous propose une réponse qui tente de répondre au mieux à votre besoin en termes de valeur ajoutée, de délais et de tarif.</p>
            </div>
            <div class="col-md-4">
                <span class="fa-stack fa-4x">
                  <i class="fas fa-circle fa-stack-2x text-primary"></i>
                  <i class="fas fa-brain fa-stack-1x fa-inverse"></i>
                </span>
                <h4 class="service-heading">Consulting</h4>
                <p class="text-muted">Je peux vous guider dans vos choix techniques (analyse, conception,
                    architecture, infrastructure, audit de sécurité ou de référencement) au cours d'une mission de courte durée.</p>
            </div>
        </div>
        <div class="service-contact">
            <a class="btn btn-primary btn-xl text-uppercase js-scroll-trigger" href="#contact">Contactez-moi</a>
        </div>
    </div>
</section>


<!-- Skills -->
<section id="competences">
    <div class="container">
        <div class="text-center">
            <h2 class="section-heading text-uppercase">Mes compétences</h2>
            <h3 class="section-subheading text-muted">Axée autour de l'univers du Web, mon
                expertise se concentre principalement autour du language PHP et du framework Symfony.</h3>
        </div>

        <div class="skills" data-skills="<?= htmlentities(json_encode($competences)) ?>">
            <ul>
                <?php foreach ($competences as $competence => $value) : ?>
                    <li><strong><?= $competence ?> à Toulouse</strong></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<!-- Portfolio Grid -->
<section class="bg-light" id="portfolio">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2 class="section-heading text-uppercase">Portfolio</h2>
                <h3 class="section-subheading text-muted">Coup d'œil sur mes derniers travaux.</h3>
            </div>
        </div>
        <div class="row">
            <?php foreach ($realisations as $i => $realisation): ?>
                <div class="col-md-6 col-xl-4">
                    <div class="portfolio-item">
                        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal<?= $i + 1; ?>">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content">
                                    <i class="fas fa-plus fa-3x"></i>
                                </div>
                            </div>
                            <img class="img-fluid" width="400" height="300"
                                 src="img/realisations/<?= $realisation['image']; ?>"
                                 srcset="img/realisations/<?= getRetina($realisation['image'], 2) ?> 2x"
                                 alt="<?= $realisation['nom']; ?>">
                        </a>
                        <div class="portfolio-caption">
                            <h4><?= $realisation['nom']; ?></h4>
                            <p class="text-muted"><?= $realisation['sous_titre'] ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- About -->
<section id="experiences">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2 class="section-heading text-uppercase">Expériences</h2>
                <h3 class="section-subheading text-muted">Mes expériences en régie chez le client.</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <ul class="timeline">
                    <?php foreach ($experiences as $i => $experience) : ?>
                        <li class="<?= $i % 2 ? "" : "timeline-inverted" ?>">
                            <div class="timeline-image">
                                <img class="rounded-circle img-fluid"
                                     src="img/logos/<?= $experience['logo']; ?>"
                                     srcset="img/logos/<?= getRetina($experience['logo'], 2); ?> 2x"
                                     width="200"
                                     height="200"
                                     alt="Logo <?= $experience['client'] ?>">
                            </div>
                            <div class="timeline-panel">
                                <div class="timeline-heading">
                                    <h4><?= $experience['periode'] ?></h4>
                                    <h4 class="subheading"><?= $experience['client'] ?></h4>
                                    <h5 class="text-muted"><?= $experience['titre'] ?></h5>
                                </div>
                                <div class="timeline-body">
                                    <p class="text-muted"><?= $experience['description'] ?></p>
                                    <?php if ($experience['entreprise']) : ?>
                                        <span class="text-muted">Via <?= $experience['entreprise']; ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </li>
                    <?php endforeach; ?>
                    <li class="timeline-inverted">
                        <div class="timeline-image">
                            <div class="d-table h-100">
                                <div class="d-table-cell align-middle">
                                    <h4>Rejoignez l'aventure !</h4>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Contact -->
<section class="bg-light" id="contact">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2 class="section-heading text-uppercase">Contact</h2>
                <h3 class="section-subheading text-muted">Laissez-moi quelques mots sur votre projet et je vous
                    rappelerai.</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-3">
                <ul class="list-unstyled row">
                    <li class="col-lg-3 col-sm-6 col-xl-12">
                        <i class="icon fa fa-map-marker-alt"></i>
                        <span class="text-muted">
                            SILARHI
                            <br/>116 Route d'Espagne
                            <br/>HELIOPOLIS 4, BAT 3
                            <br />BAL 411
                            <br/>31100 Toulouse
                        </span>
                    </li>
                    <li class="col-lg-3 col-sm-6 col-xl-12">
                        <i class="icon fa fa-clock"></i>
                        <span class="text-muted">
                            Du lundi au vendredi
                            <br>De 9h à 18h
                        </span>
                    </li>
                    <li class="col-lg-3 col-sm-6 col-xl-12">
                        <i class="icon fa fa-phone"></i>
                        <span class="text-muted">
                            <a href="tel:+33607275826">0 607.275.826</a>
                        </span>
                    </li>
                    <li class="col-lg-3 col-sm-6 col-xl-12">
                        <i class="icon fa fa-envelope"></i>
                        <span class="text-muted">
                            <a href='&#109;ai&#108;to&#58;&#37;68ell&#37;6F&#64;si%&#54;Ca&#37;72hi&#46;f&#114;'>hello&#64;silar&#104;i&#46;&#102;r</a>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="col-xl-9">
                <form id="contactForm" name="sentMessage" novalidate="novalidate">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <input class="form-control" id="name" type="text" placeholder="Votre nom *"
                                       required="required"
                                       data-validation-required-message="Merci de renseigner votre nom.">
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="form-group">
                                <input class="form-control" id="email" type="email" placeholder="Votre email *"
                                       required="required"
                                       data-validation-required-message="Merci de renseigner votre email.">
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="form-group">
                                <input class="form-control" id="phone" type="tel" placeholder="Votre téléphone *"
                                       required="required"
                                       data-validation-required-message="Merci de renseigner votre numéro de téléphone.">
                                <p class="help-block text-danger"></p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <textarea class="form-control" id="message" placeholder="Votre message *"
                                          required="required"
                                          data-validation-required-message="Merci de renseigner votre message."></textarea>
                                <p class="help-block text-danger"></p>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-lg-12 text-center">
                            <div id="success"></div>
                            <button id="sendMessageButton" class="btn btn-primary btn-xl text-uppercase" type="submit">
                                Envoyer le message
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- Footer -->
<footer>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <p class="text-muted">Guillaume Sainthillier - Développeur Web Freelance à Toulouse</p>
                <p class="text-muted">SASU SILARHI - N° SIRET 84154166700017</p>
            </div>
            <div class="col-md-4">
                <ul class="list-inline social-buttons">
                    <li class="list-inline-item">
                        <a href="<?= LINKED_IN; ?>">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="<?= GITHUB; ?>">
                            <i class="fab fa-github"></i>
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="pdf/CV-SAINTHILLIER-Guillaume.pdf">
                            <i class="fa fa-file-alt"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</footer>

<?php foreach ($realisations as $i => $realisation): ?>
    <div class="portfolio-modal modal fade" id="portfolioModal<?= $i + 1; ?>" tabindex="-1" role="dialog"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="close-modal" data-dismiss="modal">
                    <div class="lr">
                        <div class="rl"></div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto">
                            <div class="modal-body">
                                <!-- Project Details Go Here -->
                                <h2 class="text-uppercase"><?= $realisation['nom'] ?></h2>
                                <p class="item-intro text-muted"><?= $realisation['sous_titre'] ?></p>
                                <img class="img-fluid d-block mx-auto"
                                     src="img/realisations/<?= $realisation['image'] ?>"
                                     srcset="img/realisations/<?= getRetina($realisation['image'], 2) ?> 2x"
                                     alt="<?= $realisation['nom']; ?>"
                                     title="<?= $realisation['nom']; ?> par un Freelance Web à Toulouse">

                                <div class="modal-description">
                                    <?= $realisation['description']; ?>
                                    <ul class="list-inline">
                                        <li>Date : <?= $realisation['date']; ?></li>
                                        <li>Technologies :
                                            <?php foreach ($realisation['keywords'] as $keyword) : ?>
                                                <span class="badge badge-secondary"><?= $keyword; ?></span>
                                            <?php endforeach; ?>
                                        </li>
                                    </ul>
                                </div>
                                <?php if($realisation['url']) : ?>
                                <a href="<?= $realisation['url']; ?>" class="btn btn-secondary" target="_blank">
                                    <i class="fas fa-globe"></i>
                                    Visiter
                                </a>
                                <?php endif; ?>
                                <button class="btn btn-primary" data-dismiss="modal" type="button">
                                    <i class="fas fa-times"></i>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php endforeach; ?>

<script src='https://www.google.com/recaptcha/api.js?render=<?= RECAPTCHA_SITE_KEY ?>'></script>
<script src="vendor/bundle.min.js"></script>
<script src="js/agency.min.js"></script>
</body>
</html>
