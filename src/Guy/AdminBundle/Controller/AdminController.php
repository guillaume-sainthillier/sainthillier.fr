<?php

namespace Guy\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdminController extends Controller
{

    public function indexAction() {
	$em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository("GuyAdminBundle:Realisation");
        $realisations = $repo->findBy([], ["dateProjet" => "DESC"]);

        $repo = $em->getRepository("GuyBlogBundle:Formation");
        $formations = $repo->findBy([], ["ordre" => "ASC"]);

        $repo = $em->getRepository("GuyBlogBundle:Experience");
        $experiences = $repo->findBy([], ["ordre" => "ASC"]);

        $repo = $em->getRepository("GuyBlogBundle:Competence");
        $competences = $repo->findBy([], ["niveau" => "DESC"]);

	return $this->render(
	    'GuyAdminBundle:Admin:list.html.twig', [
		'realisations' => $realisations,
		'formations' => $formations,
		'experiences' => $experiences,
		'competences' => $competences
	]);
    }

    private function getHandledForm($object, $formType)
    {
	$form		= $this->createForm($formType, $object);
	$requestStack	= $this->get('request_stack');
	$request	= $requestStack->getMasterRequest();

	$form->handleRequest($request);

	return $form;
    }

    protected function handleEntity($object, $formType, $view, $successMsg)
    {
	$form = $this->getHandledForm($object, $formType);
	if ($form->isValid()) {
	    $em = $this->getDoctrine()->getManager();
	    $em->persist($object);
	    $em->flush();
	    $this->addFlash('success', $successMsg);
	    
	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}

	return $this->render($view, [
		'form' => $form->createView(),
		'item' => $object
	]);
    }

    protected function handleDelete($object, $formType, $view, $successMsg)
    {
	$form = $this->getHandledForm($object, $formType);
	if ($form->isValid()) {
	    $em = $this->getDoctrine()->getManager();
	    $em->remove($object);
	    $em->flush();
	    $this->addFlash('success', $successMsg);
	    return $this->redirect($this->generateUrl('guy_admin_list'));
	}

	return $this->render($view, [
		'form' => $form->createView(),
		'item' => $object
	]);
    }
}
