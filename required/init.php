<?php

/*
 * This file is part of By Night.
 * (c) 2015-2020 Guillaume Sainthillier <guillaume.sainthillier@gmail.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

use function Sentry\init;

\define('MD5_ASSET_CACHE', md5(getenv('BUILD_DATE') ?: date('Ymdhis')));
\define('LINKED_IN', 'https://fr.linkedin.com/in/guillaumesainthillier');
\define('GITHUB', 'https://github.com/guillaume-sainthillier');
\define('RECAPTCHA_SITE_KEY', '6Leeo4cUAAAAAPFGCTvQa994tSGAQzNCmhpgMzME');

require_once __DIR__ . '/creds.php';
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/../vendor/autoload.php';

if (SENTRY_DSN) {
    init(['dsn' => SENTRY_DSN]);
}
