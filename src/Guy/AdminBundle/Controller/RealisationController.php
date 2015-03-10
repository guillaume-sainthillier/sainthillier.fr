<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Guy\AdminBundle\Entity\Realisation;
use Guy\AdminBundle\Form\RealisationType;
use Gedmo\Sluggable\Util as Sluggable;

class RealisationController extends Controller
{
    public function ajouterAction() {
	$realisation = new Realisation;
	$form = $this->createForm(new RealisationType, $realisation);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST') {//Demande d'ajout de la réalisation
	    $form->bind($request);
	    if ($form->isValid()) {
		$em = $this->getDoctrine()->getManager();

		$slug = Sluggable\Urlizer::urlize($realisation->getTitre(), '-');
		if(!empty($slug)) // if $string is like '=))' or 'トライアングル・サービス' an empty slug will be returned, that causes troubles and throws no exception
		{
		    $realisation->setSlug($slug);
		}

		$em->persist($realisation);
		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Réalisation ajoutée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	} else
	    $form->get("tags")->setData("");

	return $this->render(
			'GuyAdminBundle:Realisation:ajouter.html.twig', [
		    'form' => $form->createView(),
		    "page" => "realisations",
		    "realisation" => $realisation
	]);
    }

    public function modifierAction(Realisation $realisation) {
	$form = $this->createForm(new RealisationType, $realisation);
	$request = $this->get('request');

	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    foreach ($realisation->getTags() as $tag) {
		$realisation->removeTag($tag);
		$em->remove($tag);
	    }
	    $form->bind($request);

	    if ($form->isValid()) {
		$em->persist($realisation);
		$em->flush();
		$this->get('session')->getFlashBag()->add('success', "Réalisation modifiée");
		return $this->redirect($this->generateUrl('guy_admin_list'));
	    }
	} else {
	    $form->get("tags")->setData(implode(" ", array_map(function($e) {
		return $e->getNom();
	    }, $realisation->getTags()->toArray())));
	}

	return $this->render(
		'GuyAdminBundle:Realisation:modifier.html.twig', [
		    'form' => $form->createView(),
		    "page" => "realisations",
		    "realisation" => $realisation
	]);
    }

    public function supprimerAction(Realisation $realisation) {
	$request = $this->get('request');
	if ($request->getMethod() == 'POST') {
	    $em = $this->getDoctrine()->getManager();
	    foreach ($realisation->getTags() as $tag) {
		$realisation->removeTag($tag);
		$em->remove($tag);
	    }

	    $em->remove($realisation);
	    $em->flush();
	    $this->get('session')->getFlashBag()->add('success', "Réalisation supprimée");

	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}

	$form = $this->createForm(new RealisationType, $realisation);
	$form->get("tags")->setData(implode(" ", array_map(function($e) {
			    return $e->getNom();
			}, $realisation->getTags()->toArray())));

	return $this->render(
			'GuyAdminBundle:Realisation:supprimer.html.twig', [
		    'form' => $form->createView(),
		    "page" => "realisations",
		    "realisation" => $realisation
	]);
    }
}
