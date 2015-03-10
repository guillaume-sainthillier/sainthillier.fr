<?php

namespace Guy\AdminBundle\Controller;

use Guy\BlogBundle\Entity\Formation;
use Guy\BlogBundle\Form\FormationExperienceType;

class FormationController extends AdminController {

    public function ajouterAction() {
	return $this->handleEntity(
		new Formation,
		new FormationExperienceType,
		'GuyAdminBundle:Formation:ajouter.html.twig',
		'Formation ajoutée'
	);
    }

    public function modifierAction(Formation $formation) {
	return $this->handleEntity(
		$formation,
		new FormationExperienceType,
		'GuyAdminBundle:Formation:modifier.html.twig',
		'Formation modifiée'
	);
    }

    public function supprimerAction(Formation $formation) {
	return $this->handleDelete(
		$formation,
		new FormationExperienceType,
		'GuyAdminBundle:Formation:supprimer.html.twig',
		'Formation supprimée'
	);
    }
}
