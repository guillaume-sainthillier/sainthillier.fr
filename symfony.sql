-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Dim 18 Août 2013 à 19:36
-- Version du serveur: 5.5.24-log
-- Version de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `symfony`
--

-- --------------------------------------------------------

--
-- Structure de la table `guy_competences`
--

DROP TABLE IF EXISTS `guy_competences`;
CREATE TABLE IF NOT EXISTS `guy_competences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifiant` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `titre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contenu` longtext COLLATE utf8_unicode_ci NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `ordre` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_A309E105C90409EC` (`identifiant`),
  UNIQUE KEY `UNIQ_A309E105737992C9` (`ordre`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=16 ;

--
-- Contenu de la table `guy_competences`
--

INSERT INTO `guy_competences` (`id`, `identifiant`, `titre`, `contenu`, `actif`, `ordre`) VALUES
(9, 'php', 'PHP', 'Le php c''est cool', 1, 1),
(10, 'jquery', 'jQuery', 'Le jquery c''est cool', 1, 2),
(11, 'mysql', 'MySQL', 'Le mysql c''est cool', 1, 3),
(12, 'css3', 'CSS3', 'Le css c''est cool', 1, 4),
(13, 'ruby', 'ruby', 'Le ruby c''est cool', 1, 5),
(14, 'html5', 'html5', 'Le html5 c''est cool', 1, 6),
(15, 'java', 'java', 'Le java c''est cool', 1, 7);

-- --------------------------------------------------------

--
-- Structure de la table `guy_users`
--

DROP TABLE IF EXISTS `guy_users`;
CREATE TABLE IF NOT EXISTS `guy_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `salt` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `locked` tinyint(1) NOT NULL,
  `expired` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `confirmation_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL,
  `roles` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `credentials_expired` tinyint(1) NOT NULL,
  `credentials_expire_at` datetime DEFAULT NULL,
  `date_inscription` date NOT NULL,
  `nom` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `prenom` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ville` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cp` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `adresse` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_6C321A1992FC23A8` (`username_canonical`),
  UNIQUE KEY `UNIQ_6C321A19A0D96FBF` (`email_canonical`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Contenu de la table `guy_users`
--

INSERT INTO `guy_users` (`id`, `username`, `username_canonical`, `email`, `email_canonical`, `enabled`, `salt`, `password`, `last_login`, `locked`, `expired`, `expires_at`, `confirmation_token`, `password_requested_at`, `roles`, `credentials_expired`, `credentials_expire_at`, `date_inscription`, `nom`, `prenom`, `ville`, `cp`, `adresse`) VALUES
(1, 'guy', 'guy', 'guillaume.sainthillier@gmail.com', 'guillaume.sainthillier@gmail.com', 1, 'pln5w7ysxmsg0sw08wosck8cgc444co', 'A7THQXNVGVqvXJDuPIFpFHQTM6xJnuNG4yUmXzha6ZdGq1Vpi9eKjlC2QyE+VFseCHSFtusiL2Ex8ALeH+v4/g==', '2013-08-15 11:39:14', 0, 0, NULL, 'O-fUSBOsTMuBOmab9Hn6m4Xi9ByKaBE07HGgeMS0gzc', '2013-08-15 11:45:43', 'a:0:{}', 0, NULL, '2013-08-15', '', '', '', '', ''),
(2, 'guydon', 'guydon', 'guillaume.sainthillier2@gmail.com', 'guillaume.sainthillier2@gmail.com', 1, 'h603uiv73dw0g08ksw80ko00csksggs', 'F8R/rhSYrq0GMD9JDuKDjW+1eG8Y25dTltyxIL/tQLjDE3ZhofqRb8UmzOb3NMoB7G70RPEI7KwouSQNeg47Hw==', '2013-08-15 10:56:00', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '2013-08-15', '', '', '', '', ''),
(4, 'guillaume', 'guillaume', 'sinsin31@hotmail.fr', 'sinsin31@hotmail.fr', 1, 'hc6uvj92op44ow44cg00sgc0g8ws0o4', 'VahfQhiMpldq77+U1cHMC/hY+Nz2FVWznB2TssG5hzJLuK+rkXMIaf56NhvSWrYyT3NesQ9IRf26f5nyCBWUAw==', '2013-08-17 18:39:44', 0, 0, NULL, NULL, NULL, 'a:1:{i:0;s:10:"ROLE_ADMIN";}', 0, NULL, '2013-08-15', 'SAINTHILLIER', 'Guillaume', 'PLAISANCE DU TOUCH', '31830', '40B Rue de la Gravette'),
(5, 'test', 'test', 'test@test.test', 'test@test.test', 1, '1bhst9cnus9w8kkw8cookcscc8s4g0w', 'mxGS8argXMZCziJDAT1mQWYyO4jVD/pwpzC6l9J9x8vAqCpBX1VdyzcYDjwx9BBOD8XZc3xUO5whuSt4ox6VNQ==', '2013-08-15 15:49:32', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '2013-08-15', '', NULL, '', NULL, NULL),
(6, 'DeathDown', 'deathdown', 'deathdown@gmx.fr', 'deathdown@gmx.fr', 1, 'juq7w6k48kgkws8k4ckssc4cw0csccs', 'MFyuR8ax9M8J7SfacuPVnom0dsZYL/0Mx/W0UZMcs032bh0fmxgaXtkMZU82w9cAC/KE1y+kpIUqZLTSe0OINA==', '2013-08-17 19:57:22', 0, 0, NULL, NULL, NULL, 'a:0:{}', 0, NULL, '2013-08-17', '', NULL, '', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `lien`
--

DROP TABLE IF EXISTS `lien`;
CREATE TABLE IF NOT EXISTS `lien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_demo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description_demo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url_site` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description_site` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url_projet` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description_projet` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=16 ;

--
-- Contenu de la table `lien`
--

INSERT INTO `lien` (`id`, `url_demo`, `description_demo`, `url_site`, `description_site`, `url_projet`, `description_projet`) VALUES
(4, 'http://iscore.sainthillier.fr', '<i class="icon-2x icon-eye-open"></i> Démo', NULL, NULL, 'https://github.com/guillaume-sainthillier/iscore', '<i class="icon-2x icon-github"></i> Projet'),
(5, 'http://malp.sainthillier.fr', '<i class="icon-2x icon-eye-open"></i> Démo', 'http://lesmotsalapelle.wordpress.com/', '<i class="icon-2x icon-share-alt"></i> Site', 'https://github.com/guillaume-sainthillier/malp', '<i class="icon-2x icon-github"></i> Projet'),
(6, 'https://www.logilibres.com/epmdemo/scr/login.php?came_from=', '<i class="icon-2x icon-eye-open"></i> Démo', NULL, NULL, 'https://adullact.net/projects/openepm/', '<i class="icon-2x icon-ok"></i> Projet'),
(8, NULL, NULL, NULL, NULL, NULL, NULL),
(9, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'https://github.com/guillaume-sainthillier/DNC/raw/master/Client/DNC.jar', '<i class="icon-2x icon-download-alt"></i> Démo', 'https://raw.github.com/guillaume-sainthillier/DNC/master/PROTOCOL.txt', '<i class="icon-2x icon-file-text-alt"></i>Protocol', 'https://github.com/guillaume-sainthillier/DNC', '<i class="icon-2x icon-github"></i>  Projet'),
(11, 'http://e-Commerce.sainthillier.fr', '<i class="icon-2x icon-eye-open"></i> Démo', NULL, NULL, 'https://github.com/guillaume-sainthillier/e-Commerce', '<i class="icon-2x icon-github"></i> Projet'),
(12, 'http://bad-tournament.sainthillier.fr', '<i class="icon-2x icon-eye-open"></i> Démo', NULL, NULL, 'https://github.com/guillaume-sainthillier/bad-tournament', '<i class="icon-2x icon-github"></i> Projet'),
(13, 'test', 'test', NULL, NULL, NULL, NULL),
(14, NULL, NULL, NULL, NULL, NULL, NULL),
(15, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `realisation`
--

DROP TABLE IF EXISTS `realisation`;
CREATE TABLE IF NOT EXISTS `realisation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `titre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contenu` longtext COLLATE utf8_unicode_ci NOT NULL,
  `collaboration` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `favicon` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lien_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_6C39EED96C6E55B5` (`nom`),
  UNIQUE KEY `UNIQ_6C39EED9EDAAC352` (`lien_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=23 ;

--
-- Contenu de la table `realisation`
--

INSERT INTO `realisation` (`id`, `nom`, `titre`, `contenu`, `collaboration`, `favicon`, `image`, `lien_id`) VALUES
(17, 'epm', 'Open ePM', '<p>Open ePM est une application Web open source, &agrave; destination des Polices Municipales.<br />\r\nElle permet, en outre, de g&eacute;rer:</p>\r\n\r\n<ul class="icons-ul">\r\n	<li><i class="icon-li icon-double-angle-right"></i>Les main courantes et les affaires</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La production des rapports PV</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La d&eacute;claration et suivi des animaux dangereux</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La gestion des objets perdus et trouv&eacute;s</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La gestion des OTV, OTS, surveillances Magasins..</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La mise en fourri&egrave;re des v&eacute;hicules</li>\r\n	<li><i class="icon-li icon-double-angle-right"></i>La gestion des vacations fun&eacute;raires</li>\r\n</ul>', 'Sous la direction d''Antoine&nbsp;Coelho et Denis&nbsp;Coujou<br />En collaboration avec Guillaume&nbsp;Didier', 'favicon_epm.png', 'epm.png', 6),
(18, 'malp', 'Les Mots à la Pelle', '<i class="icon-li icon-quote-left"></i>\r\n				Les Mots à La Pelle sont nés de 4 volontés individuelles désirant œuvrer de manière collective dans le champ de la langue et de l’écriture.\r\n				<i class="icon-li icon-quote-right"></i>\r\n				<br />\r\n				<br />Membres fondatrices:\r\n				<ul class="icons-ul">\r\n					<li><i class="icon-li icon-double-angle-right "></i>Audrey Chalumeau</li>\r\n					<li><i class="icon-li icon-double-angle-right "></i>Florence Hude</li>\r\n					<li><i class="icon-li icon-double-angle-right "></i>Sophie Negrin</li>\r\n					<li><i class="icon-li icon-double-angle-right "></i>Aurélie Guilbaud</li>\r\n				</ul>', 'En collaboration avec Florian&nbsp;Baillagou, Romain&nbsp;Lenordmand et Fabien&nbsp;Puchol', 'favicon_malp.png', 'malp.png', 5),
(19, 'iscore', 'iScore', 'iScore est l''interface d''administration d''un projet de gestion de concerts de musique.<br />\r\n				<br />\r\n				Dans le cadre d''une collaboration avec des étudiants de 5<sup>ème</sup> année,\r\n				l''application permet de gérer un parc d''instruments de musique et de musiciens, \r\n				mais aussi de créer des configuration de concerts qui seront utilisés par les musiciens \r\n				lors de leur répétition.', 'En collaboration avec Alexandre&nbsp;Bongard et Thomas&nbsp;Folguerald', 'favicon_iscore.png', 'iscore.png', 4),
(20, 'dnc', '<i class="icon-2x icon-github-alt"></i> Dog is Not a Cat', 'DNC est un logiciel de Messagerie Instantanée façon IRC.<br />\r\n<br />\r\nLe client permet de: <br />\r\n<ul class="icons-ul">\r\n	<li><i class="icon-li icon-double-angle-right "></i>Se connecter à un chat de dicussion avec un pseudo choisi</li>\r\n	<li><i class="icon-li icon-double-angle-right "></i>Discuter dans le canal global</li>\r\n	<li><i class="icon-li icon-double-angle-right "></i>Gérer son statut (Disponible / Occupé)</li>\r\n	<li><i class="icon-li icon-double-angle-right "></i>Ouvrir une conversation privée avec un membre connecté et disponible</li>\r\n</ul>\r\n<br />', 'En collaboration avec Romain&nbsp;Lenormand', NULL, 'bt.png', 10),
(21, 'ecommerce', '<i class="icon-2x icon-laptop"></i> e-Commerce', 'e-Commerce est un site de simulation de vente de materiel informatique dans le cadre d''un projet de l''I.U.T Informatique de Blagnac.<br />\r\n<br />\r\nL''application sert à mettre en pratique les notions acquises autour du PHP de base (session, cookies, base de données) ainsi que de l''AJAX et du CSS.', 'En collaboration avec Laris&nbsp;Nadjar', NULL, 'e-Commerce.png', 11),
(22, 'badtournament', 'Bad Tournament', 'BadTournament est un logiciel de gestion de tournois de badminton.<br />\r\n<br />\r\nDans le cadre d''un projet Tutoré organisé par l''I.U.T de Blagnac, l''application permet d''inscrire des joueurs organisés en équipe, et de les faire s''affronter dans un tournoi organisé automatiquement.', 'En collaboration avec Benjamin&nbsp;Cros, Thomas&nbsp;,Folgueral et Guillaume&nbsp;Meiment', 'favicon_bt.png', 'bt.png', 12);

-- --------------------------------------------------------

--
-- Structure de la table `realisation_tag`
--

DROP TABLE IF EXISTS `realisation_tag`;
CREATE TABLE IF NOT EXISTS `realisation_tag` (
  `realisation_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`realisation_id`,`tag_id`),
  KEY `IDX_74873B97B685E551` (`realisation_id`),
  KEY `IDX_74873B97BAD26311` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realisation_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_3BC4F163B685E551` (`realisation_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1425 ;

--
-- Contenu de la table `tag`
--

INSERT INTO `tag` (`id`, `nom`, `realisation_id`) VALUES
(1298, 'IRC', 20),
(1299, 'JAVA', 20),
(1300, 'PROTOCOL', 20),
(1301, 'Ruby', 20),
(1302, 'Socket', 20),
(1303, 'Thread', 20),
(1304, 'CSS', 22),
(1305, 'Javascript', 22),
(1306, 'MySQL', 22),
(1307, 'PHP', 22),
(1308, 'XHTML', 22),
(1323, 'Accessibilité', 18),
(1324, 'AJAX', 18),
(1325, 'CSS', 18),
(1326, 'CSS3', 18),
(1327, 'HTML5', 18),
(1328, 'JavaScript', 18),
(1329, 'jQuery', 18),
(1330, 'JSON', 18),
(1331, 'PDO', 18),
(1332, 'PHP', 18),
(1333, 'PHP5', 18),
(1334, 'POO', 18),
(1335, 'WebSocket', 18),
(1336, 'XHTML', 18),
(1337, 'XML', 18),
(1338, 'AJAX', 19),
(1339, 'CSS', 19),
(1340, 'HTML5', 19),
(1341, 'JavaScript', 19),
(1342, 'jQuery', 19),
(1343, 'PHP', 19),
(1344, 'POO', 19),
(1345, 'SVG', 19),
(1346, 'XHTML', 19),
(1347, 'AJAX', 21),
(1348, 'CSS', 21),
(1349, 'Javascript', 21),
(1350, 'MySQL', 21),
(1351, 'PHP', 21),
(1352, 'XHTML', 21),
(1353, 'XML', 21),
(1411, 'AJAX', 17),
(1412, 'CSS', 17),
(1413, 'CSS3', 17),
(1414, 'Framework', 17),
(1415, 'HTML5', 17),
(1416, 'JavaScript', 17),
(1417, 'jQuery', 17),
(1418, 'JSON', 17),
(1419, 'OpenMairie', 17),
(1420, 'PHP', 17),
(1421, 'PHP5', 17),
(1422, 'POO', 17),
(1423, 'XHTML', 17),
(1424, 'XML', 17);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `realisation`
--
ALTER TABLE `realisation`
  ADD CONSTRAINT `FK_6C39EED9EDAAC352` FOREIGN KEY (`lien_id`) REFERENCES `lien` (`id`);

--
-- Contraintes pour la table `realisation_tag`
--
ALTER TABLE `realisation_tag`
  ADD CONSTRAINT `FK_74873B97B685E551` FOREIGN KEY (`realisation_id`) REFERENCES `realisation` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_74873B97BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `FK_3BC4F163B685E551` FOREIGN KEY (`realisation_id`) REFERENCES `realisation` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
