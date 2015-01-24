<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Guy\BlogBundle\Entity\Experience;
use Guy\BlogBundle\Form\FormationExperienceType;

class ExperienceController extends Controller {


    public function ajouterAction() {
	$experience = new Experience;
	$form = $this->createForm(new FormationExperienceType, $experience);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST')
	{
	    $form->bind($request);
	    if ($form->isValid()) {
		$em = $this->getDoctrine()->getManager();
		$em->persist($experience);

		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Experience ajoutée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	}

	return $this->render(
	    'GuyAdminBundle:Experience:ajouter.html.twig', array(
		'form' => $form->createView(),
		"experience" => $experience
	));
    }

    public function modifierAction(Experience $experience) {
	$form = $this->createForm(new FormationExperienceType, $experience);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $form->bind($request);

	    if ($form->isValid()) {
		$em->persist($experience);
		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Experience modifiée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	} else {
	    $form->get("points")->setData(implode(",", $experience->getPoints()));
	}

	return $this->render(
	    'GuyAdminBundle:Experience:modifier.html.twig', array(
		'form' => $form->createView(),
		"experience" => $experience
	));
    }


    public function supprimerAction(Experience $experience) {
	$request = $this->get('request');

	$form = $this->createForm(new FormationExperienceType, $experience);

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    $em->remove($experience);
	    $em->flush();
	    $this->get('session')->getFlashBag()->add('success', "Experience supprimée");

	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}else {
	    $form->get("points")->setData(implode(",", $experience->getPoints()));
	}

	return $this->render(
	    'GuyAdminBundle:Experience:supprimer.html.twig', array(
		    'form' => $form->createView(),
		    "experience" => $experience
	));
    }

}
