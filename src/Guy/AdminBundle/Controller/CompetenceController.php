<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Guy\BlogBundle\Entity\Competence;
use Guy\BlogBundle\Form\CompetenceType;

class CompetenceController extends Controller {


    public function ajouterAction() {
	$competence = new Competence;
	$form = $this->createForm(new CompetenceType, $competence);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST')
	{
	    $form->bind($request);
	    if ($form->isValid()) {
		$em = $this->getDoctrine()->getManager();
		$em->persist($competence);

		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Compétence ajoutée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	}

	return $this->render(
	    'GuyAdminBundle:Competence:ajouter.html.twig', array(
		'form' => $form->createView(),
		"competence" => $competence
	));
    }

    public function modifierAction(Competence $competence) {
	$form = $this->createForm(new CompetenceType, $competence);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $form->bind($request);

	    if ($form->isValid()) {
		$em->persist($competence);
		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Compétence modifiée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	}

	return $this->render(
	    'GuyAdminBundle:Competence:modifier.html.twig', array(
		'form' => $form->createView(),
		"competence" => $competence
	));
    }


    public function supprimerAction(Competence $competence) {
	$request = $this->get('request');

	$form = $this->createForm(new CompetenceType, $competence);

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $em->remove($competence);
	    $em->flush();
	    $this->get('session')->getFlashBag()->add('success', "Competénce supprimée");

	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}

	return $this->render(
	    'GuyAdminBundle:Competence:supprimer.html.twig', array(
		    'form' => $form->createView(),
		    "competence" => $competence
	));
    }

}
