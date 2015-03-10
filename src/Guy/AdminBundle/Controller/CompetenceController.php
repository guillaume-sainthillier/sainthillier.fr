<?php

namespace Guy\AdminBundle\Controller;

use Guy\BlogBundle\Entity\Competence;
use Guy\BlogBundle\Form\CompetenceType;

class CompetenceController extends AdminController {

    public function ajouterAction() {
	return $this->handleEntity(
		new Competence,
		new CompetenceType,
		'GuyAdminBundle:Competence:ajouter.html.twig',
		'Compétence ajoutée'
	);
    }

    public function modifierAction(Competence $competence) {
	return $this->handleEntity(
		$competence,
		new CompetenceType,
		'GuyAdminBundle:Competence:modifier.html.twig',
		'Compétence modifiée'
	);
    }

    public function supprimerAction(Competence $competence) {
	return $this->handleDelete(
		$competence,
		new CompetenceType,
		'GuyAdminBundle:Competence:supprimer.html.twig',
		'Compétence supprimée'
	);
    }
}
