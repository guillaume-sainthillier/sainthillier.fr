<?php

namespace Guy\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Guy\BlogBundle\Entity\Realisation;
use Guy\BlogBundle\Entity\Tag;
use Guy\BlogBundle\Form\RealisationType;

class BlogController extends Controller
{
    public function indexAction($page, $tag = false, $nom = false)
    {
		return $this->render('GuyBlogBundle:Pages:'.$page.'.html.twig',["page" => $page]);
    }
}
