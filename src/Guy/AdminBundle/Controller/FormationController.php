<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Guy\BlogBundle\Entity\Formation;
use Guy\BlogBundle\Form\FormationExperienceType;

class FormationController extends Controller {


    public function ajouterAction() {
	$formation = new Formation;
	$form = $this->createForm(new FormationExperienceType, $formation);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST')
	{
	    $form->bind($request);
	    if ($form->isValid()) {
		$em = $this->getDoctrine()->getManager();
		$em->persist($formation);

		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Formation ajoutée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	}

	return $this->render(
	    'GuyAdminBundle:Formation:ajouter.html.twig', array(
		'form' => $form->createView(),
		"formation" => $formation
	));
    }

    public function modifierAction(Formation $formation) {
	$form = $this->createForm(new FormationExperienceType, $formation);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $form->bind($request);

	    if ($form->isValid()) {
		$em->persist($formation);
		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Formation modifiée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	} else {
	    $form->get("points")->setData(implode(",", $formation->getPoints()));
	}

	return $this->render(
	    'GuyAdminBundle:Formation:modifier.html.twig', array(
		'form' => $form->createView(),
		"formation" => $formation
	));
    }


    public function supprimerAction(Formation $formation) {
	$request = $this->get('request');

	$form = $this->createForm(new FormationExperienceType, $formation);

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $em->remove($formation);
	    $em->flush();
	    $this->get('session')->getFlashBag()->add('success', "Formation supprimée");

	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}else {
	    $form->get("points")->setData(implode(",", $formation->getPoints()));
	}

	return $this->render(
	    'GuyAdminBundle:Formation:supprimer.html.twig', array(
		    'form' => $form->createView(),
		    "formation" => $formation
	));
    }

}
