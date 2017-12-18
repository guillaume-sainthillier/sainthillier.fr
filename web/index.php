<?php
require_once '../required/init.php';

$competences = getCompetences();
$realisations = array_map(function ($realisation) {
    $keywords = [];
    foreach ($realisation['keywords'] as $keyword) {
        $escaped = preg_replace('/\W/', '_', $keyword);
        $keywords[$escaped] = $keyword;
    }
    $realisation['keywords'] = $keywords;
    return $realisation;
}, getRealisations());
$experiences = getExperiences();
$formations = getFormations();
$distinctKeywords = getDistinctKeyworkds($realisations);
$descriptions = getDescriptions();

?>
<!DOCTYPE HTML>
<html prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#" lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title><?php echo APP; ?> - <?php echo NAME; ?></title>
    <meta name="keywords" content="developpeur, web, php, symfony, toulouse, guillaume, sainthillier, cv">
    <meta name="description" content="<?php echo APP; ?>. Contactez-moi et rencontrons-nous !">
    <meta name="author" content="<?php echo NAME; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="<?php echo APP; ?> - <?php echo NAME; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo getLink(); ?>">
    <meta property="og:image" content="<?php echo getLink('img/guillaume_sainthillier.png'); ?>">
    <link rel="author" href="https://plus.google.com/+guillaumesainthillier">
    <link rel="publisher" href="https://plus.google.com/+guillaumesainthillier">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <meta name="geo.region" content="FR">
    <meta name="geo.placename" content="Toulouse">

    <!-- CSS -->
    <link href="//fonts.googleapis.com/css?family=Arvo:400,700|Droid+Sans:400,700|Pacifico:400,700" rel="stylesheet"
          type="text/css">
    <link rel="stylesheet" href="prod/css/style.min.css" type="text/css" media="screen">
    <!-- ./CSS -->
    <!--[if lt IE 9]>
    <script src="//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<!-- Menu -->
<div id="navbar" class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li><a href="#about">A propos</a></li>
                <li><a href="#competences">Compétences</a></li>
                <li><a href="#experience">Expérience</a></li>
                <li><a href="#formation">Formation</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </div>
</div>
<!-- ./Menu -->
<div itemscope itemtype="http://schema.org/Person">
    <meta itemprop="url" content="<?php echo getLink('/'); ?>">
    <meta itemprop="email" content="guillaume@sainthillier.fr">
    <div id="header_wrapper">
        <div class="container" id="about">
            <div class="row">
                <div class="col-md-6">
                    <div id="top_logo" class="text-left">
                        <h1><span itemprop="name"><?php echo NAME; ?></span></h1>
                    </div>
                </div>
                <div class="col-md-6">
                    <div id="top_download" class="text-right">
                        <a rel="me" itemprop="url" href="<?php echo getLink('pdf/CV-SAINTHILLIER-Guillaume.pdf'); ?>" target="_blank">Téléchargez mon CV</a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-7 presentation">
                    <div class="row">
                        <div class="col-xs-3">
                            <img src="<?php echo getLink('img/guillaume_sainthillier.png'); ?>"
                                 class="img-rounded img-responsive main_image" height="177" width="177" itemprop="image"
                                 alt="<?php echo NAME; ?>">
                        </div>
                        <div class="col-xs-9">
                            <h3><span itemprop="jobTitle"><?php echo APP; ?></span></h3>
                            <?php
                            foreach ($descriptions as $description) {
                                echo "<p>" . $description . "</p>";
                            }
                            ?>
                            <p><span class="signature"><?php echo NAME; ?></span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 about_links">
                    <div class="row">
                        <div class="col-lg-11 col-lg-offset-1">
                            <div class="text-center socials">
                                <a rel="me" itemprop="url"
                                   href="<?php echo LINKED_IN; ?>"
                                   class="fa-stack icon_link">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="icon fa fa-linkedin fa-stack-1x"></i>
                                </a>
                                <a rel="me" itemprop="url" href="<?php echo VIADEO; ?>"
                                   class="fa-stack icon_link">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="icon fa fa-vimeo fa-stack-1x"></i>
                                </a>
                                <a rel="me" itemprop="url" href="<?php echo GITHUB; ?>"
                                   class="fa-stack icon_link">
                                    <i class="fa fa-circle fa-stack-2x"></i>
                                    <i class="icon fa fa-github fa-stack-1x"></i>
                                </a>
                            </div>
                            <div class="row">
                                <div class="col-xs-6">
                                    <div class="about_link">
                                        <i class="fa fa-2x fa-globe"></i>
                                        <a rel="me" itemprop="url" href="<?php echo getLink(); ?>">sainthillier.fr</a>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="about_link" itemprop="address" itemscope
                                         itemtype="http://schema.org/PostalAddress">
                                        <i class="fa fa-2x fa-map-marker"></i><span
                                            itemprop="addressLocality">Toulouse</span>, <span itemprop="addressCountry">France</span>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="about_link">
                                        <i class="fa fa-2x fa-envelope"></i>
                                        <a href="#" class="email-nospam mailto" data-subject="Rencontrons-nous !"></a>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="about_link">
                                        <i class="fa fa-2x fa-users"></i>
                                        <span class="label label-primary">Développe son réseau</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="page">
    <div class="container">
        <!-- Compétences -->
        <section class="row competences" id="competences">
            <div itemscope itemtype="http://schema.org/ItemList">
                <aside class="col-sm-3 aside_el">
                    <h2><span itemprop="name">Compétences</span></h2>
                    <h5>Technologies favorites</h5>
                </aside>
                <div class="col-sm-9 borderleft">
                    <div class="row skills">
                        <?php foreach ($competences as $nom => $competence) { ?>
                            <div class=" col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-6 col-md-5">
                                <h4>
                                    <span itemprop="itemListElement"><?php echo htmlentities($nom); ?></span></h4>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped" role="progressbar"
                                         aria-valuenow="<?php echo $competence; ?>" aria-valuemin="0"
                                         aria-valuemax="100"
                                         style="width: <?php echo $competence; ?>%;"><?php echo $competence; ?>%
                                    </div>
                                </div>
                                <h4>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </section>
        <!-- ./Compétences -->

        <!-- Expérience -->
        <section class="row experience" id="experience">
            <aside class="col-sm-3 aside_el">
                <h2>Expérience</h2>
                <h5>Depuis 2011</h5>
            </aside>
            <div class="borderleft col-sm-9">
                <?php foreach ($experiences as $experience) { ?>
                    <div itemscope itemtype="http://schema.org/Organization">
                        <article class="par_el in_spacing">
                            <span class="periode label label-primary"><?php echo $experience['periode']; ?></span>
                            <div class="bigspacing">
                                <header>
                                    <h2><span itemprop="name"><?php echo $experience['entreprise']; ?></span></h2>
                                    <h3><?php echo $experience['titre']; ?></h3>
                                </header>
                                <p itemprop="description"><?php echo $experience['description']; ?></p>
                                <ul class="fa-ul">
                                    <?php foreach ($experience['points'] as $point) { ?>
                                        <li><i class="fa fa-li fa-angle-double-right"></i> <?php echo $point; ?></li>
                                    <?php } ?>
                                </ul>
                            </div>
                        </article>
                    </div>
                <?php } ?>
            </div>
        </section>
        <!-- ./Expérience -->

        <!-- Formation -->
        <section class="row formation" id="formation">
            <aside class="col-sm-3 aside_el">
                <h2>Formation</h2>
                <h5>Depuis 2009</h5>
            </aside>
            <div class="borderleft col-sm-9">
                <?php foreach ($formations as $formation) { ?>
                    <div itemscope itemtype="http://schema.org/EducationalOrganization">
                        <article class="par_el in_spacing">
                            <span class="periode label label-primary"><?php echo $formation['periode']; ?></span>
                            <div class="bigspacing">
                                <header>
                                    <h2><span itemprop="name"><?php echo $formation['nom']; ?></h2>
                                    <h3><span itemprop="name"><?php echo $formation['titre']; ?></span></h3>
                                </header>
                                <p itemprop="description"><?php echo $formation['description']; ?></p>
                                <ul class="fa-ul">
                                    <?php foreach ($formation['points'] as $point) { ?>
                                        <li><i class="fa fa-li fa-angle-right"></i> <?php echo $point; ?></li>
                                    <?php } ?>
                                </ul>
                            </div>
                        </article>
                    </div>
                <?php } ?>
            </div>
        </section>
        <!-- ./Formation -->

        <!-- Portfolio -->
        <section class="row formation" id="portfolio">
            <aside class="col-sm-3 aside_el">
                <h2>Portfolio</h2>
                <h5>Mes meilleurs travaux</h5>
            </aside>
            <div class="col-sm-9 borderleft">
                <ul class="filter nav nav-pills">
                    <li class="active"><a href="#" data-tag="all">Tous</a></li>
                    <?php foreach ($distinctKeywords as $escaped => $distinctKeyword) { ?>
                        <li><a href="#" data-tag="<?php echo $escaped; ?>"><?php echo
                                $distinctKeyword; ?></a></li>
                    <?php } ?>
                </ul>
                <div class="thumbnails portfolio row">
                    <?php foreach ($realisations as $i => $realisation) { ?>
                        <div itemscope itemtype="http://schema.org/CreativeWork">
                            <meta itemprop="keywords" content="<?php echo implode(',', $realisation['keywords']); ?>">
                            <meta itemprop="license" content="<?php echo $realisation['licence']; ?>">
                            <meta itemprop="description" content="<?php echo strip_tags($realisation['description']);
                            ?>">
                            <div data-tag="<?php echo implode(' ', array_keys($realisation['keywords'])); ?>"
                                 data-id="id-<?php echo $i; ?>"
                                 class="item col-xs-6 col-sm-6 col-md-4">
                                <div class="apercu">
                                    <a href="#thumb-<?php echo $i; ?>" class="thumb thumb_link"
                                       data-modal="modal-<?php echo $i; ?>" data-cap-effect="fade">
                                        <img class="img-responsive"
                                             itemprop="thumbnailUrl"
                                             src="<?php echo getLink('img/realisations/min_' . $realisation['image']); ?>"
                                             alt="<?php echo $realisation['nom']; ?>"/></a>
                                </div>
                                <h3><span itemprop="name"><?php echo $realisation['nom']; ?></span></h3>
                            </div>
                            <div id="modal-<?php echo $i; ?>" class="modal fade" tabindex="-1" role="dialog">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal"
                                                    aria-label="Fermer">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 class="modal-title text-center"><?php echo $realisation['nom']; ?></h4>
                                        </div>
                                        <div class="modal-body">
                                            <img class="img-responsive"
                                                 alt="<?php echo $realisation['nom']; ?>"
                                                 src="<?php echo getLink('img/realisations/'. $realisation['image']); ?>
                                             "/>
                                            <br/>
                                            <?php echo $realisation['description']; ?>
                                        </div>
                                        <div class="modal-footer">
                                            <a itemprop="url" href="<?php echo $realisation['url']; ?>"
                                               target="_blank" class="btn
                                            btn-primary">Démo</a>
                                            <button type="button" class="btn btn-default"
                                                    data-dismiss="modal">Fermer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </section>
        <!-- ./Portfolio -->
    </div>
    <!-- Contact -->
    <div id="map" class="map">Toulouse, France</div>
    <div class="contact">
        <div class="container">
            <section class="row" id="contact">
                <aside class="col-sm-3 aside_el">
                    <h2>Contact</h2>
                    <h5>Laissez-moi un message</h5>
                </aside>
                <div class="col-sm-9 borderleft">
                    <div id="feedback" class="alert hidden"></div>
                    <form method="post" id="form_contact" action="<?php echo getLink('message.php'); ?>">
                        <fieldset>
                            <div class="row">
                                <div class="col-md-12">
                                    <div>
                                        <input type="text" id="contact_nom" name="contact[nom]" required="required"
                                               pattern=".{2,}" placeholder="Nom" class="form-control input-lg"/>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-md-6">
                                    <div><input type="email" id="contact_mail" name="contact[mail]" placeholder="Email"
                                                class="form-control input-lg"/>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div><input type="url" id="contact_web" name="contact[web]" placeholder="Web"
                                                class="form-control input-lg"/></div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-md-12">
                                    <div><textarea id="contact_message" name="contact[message]" required="required"
                                                   placeholder="Message" class="form-control input-lg"></textarea></div>
                                </div>
                            </div>
                            <br/>
                            <button id="contact" type="submit" class="btn btn-lg btn-primary
                            pull-right">Envoyer
                            </button>
                            <p class="help-block">Votre message sera envoyé à l'adresse <strong
                                    class="email-nospam"></strong></p>
                        </fieldset>
                    </form>
                </div>
            </section>
        </div>
    </div>
    <!-- ./Contact -->
</div>
<!-- Footer -->
<footer>
    <div class="container">
        <div class="row">
            <div class="col-xs-6 text-right text_footer">
                <a href="<?php echo getLink('/'); ?>">
                    <?php echo NAME . ' ' . date('Y'); ?>
                </a>
            </div>
            <div class="col-xs-6">
                <div class="text-center socials">
                    <a rel="me" itemprop="url"
                       href="<?php echo LINKED_IN; ?>"
                       class="fa-stack icon_link">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="icon fa fa-linkedin fa-stack-1x"></i>
                    </a>
                    <a rel="me" itemprop="url" href="<?php echo VIADEO; ?>" class="fa-stack icon_link">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="icon fa fa-vimeo fa-stack-1x"></i>
                    </a>
                    <a rel="me" itemprop="url" href="<?php echo GITHUB; ?>" class="fa-stack icon_link">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="icon fa fa-github fa-stack-1x"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- ./Footer -->
<div class="color_wrapper"></div>
<div id="elevator_item">
    <a id="elevator" href="#" title="Remonter au menu"></a>
</div>

<!-- JS -->
<script type="text/javascript">
    <?php $parts = explode('@', EMAIL); ?>
    var username = "<?php echo $parts[0]; ?>";
    var host = "<?php echo $parts[1]; ?>";

    function centerMap() {
        var point = {lat: 43.6, lng: 1.433333};
        var map = new google.maps.Map(document.getElementById('map'), {
            center: point,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            zoom: 11
        });

        var marker = new google.maps.Marker({
            position: point,
            map: map,
            title: '<?php echo NAME; ?>'
        });
    }
</script>
<script type="text/javascript" src="prod/js/scripts.min.js" async defer></script>
<script type="text/javascript" async defer src="//maps.google.com/maps/api/js?callback=centerMap"></script>
<script type="text/javascript">
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
        a = s.createElement(o), m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-44318869-1', 'sainthillier.fr');
    ga('send', 'pageview');
</script>
<!-- ./JS -->
</body>
</html>
