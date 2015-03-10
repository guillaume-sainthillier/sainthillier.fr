<?php

namespace Guy\AdminBundle\Controller;

use Guy\BlogBundle\Entity\Experience;
use Guy\BlogBundle\Form\FormationExperienceType;

class ExperienceController extends AdminController {

    public function ajouterAction() {
	return $this->handleEntity(
		new Experience,
		new FormationExperienceType,
		'GuyAdminBundle:Experience:ajouter.html.twig',
		'Experience ajoutée'
	);
    }

    public function modifierAction(Experience $experience) {
	return $this->handleEntity(
		$experience,
		new FormationExperienceType,
		'GuyAdminBundle:Experience:modifier.html.twig',
		'Experience modifiée'
	);
    }

    public function supprimerAction(Experience $experience) {
	return $this->handleDelete(
		$experience,
		new FormationExperienceType,
		'GuyAdminBundle:Experience:supprimer.html.twig',
		'Experience supprimée'
	);
    }

}
