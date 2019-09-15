<?php

define('MD5_ASSET_CACHE', md5(getenv('BUILD_DATE') ?: date('Ymdhis')));
define('LINKED_IN', 'https://fr.linkedin.com/in/guillaumesainthillier');
define('GITHUB', 'https://github.com/guillaume-sainthillier');
define('RECAPTCHA_SITE_KEY', '6Leeo4cUAAAAAPFGCTvQa994tSGAQzNCmhpgMzME');

require_once __DIR__. '/creds.php';
require_once __DIR__. '/functions.php';
require_once __DIR__. '/../vendor/autoload.php';
