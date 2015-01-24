<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdminController extends Controller
{

    public function indexAction() {
	$em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository("GuyAdminBundle:Realisation");
        $realisations = $repo->findBy(array(), array("dateProjet" => "DESC"));

        $repo = $em->getRepository("GuyBlogBundle:Formation");
        $formations = $repo->findBy(array(), array("ordre" => "ASC"));

        $repo = $em->getRepository("GuyBlogBundle:Experience");
        $experiences = $repo->findBy(array(), array("ordre" => "ASC"));

        $repo = $em->getRepository("GuyBlogBundle:Competence");
        $competences = $repo->findBy(array(), array("niveau" => "DESC"));

	return $this->render(
	    'GuyAdminBundle:Admin:list.html.twig', array(
		'realisations' => $realisations,
		'formations' => $formations,
		'experiences' => $experiences,
		'competences' => $competences
	));
    }
}
