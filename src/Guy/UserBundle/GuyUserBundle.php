<?php

namespace Guy\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class GuyUserBundle extends Bundle
{
	 public function getParent()
	{
		return 'FOSUserBundle';
	}
}
