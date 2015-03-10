<?php

namespace Guy\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;

use Guy\AdminBundle\Entity\Realisation;
use Guy\BlogBundle\Form\ContactType;
use Guy\BlogBundle\Entity\Contact;

class PageController extends Controller
 {
    public function contactAction(Request $request) {

	$contact = new Contact;
	$contactForm = $this->createForm(new ContactType, $contact);
	$contactForm->bind($request);

	if ($contactForm->isValid()) {

	    $message = \Swift_Message::newInstance()
		->setSubject('Contact')
		->setFrom([$contact->getMail() => $contact->getNom()])
		->setTo(null)
		->setBody($this->renderView('GuyBlogBundle:Contact:mail.html.twig', ["contact" => $contact]), 'text/html')
            ;

	    $this->get('mailer')->send($message);

	    return $this->render(
		'GuyBlogBundle:Contact:success.html.twig', [
		"contact" => $contact
	    ]);
	}

	return $this->render(
	    'GuyBlogBundle:Contact:form.html.twig', [
	    "contact_form" => $contactForm->createView()
	]);
    }

    public function indexAction()
    {
        $contactForm = $this->createForm(new ContactType, new Contact);

	$em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository("GuyAdminBundle:Realisation");
        $realisations = $repo->findBy([], ["dateProjet" => "DESC"]);

        $repo = $em->getRepository("GuyAdminBundle:Tag");
        $tags = $repo->getDistinctTags();

        $repo = $em->getRepository("GuyBlogBundle:Formation");
        $formations = $repo->findBy([], ["ordre" => "ASC"]);

        $repo = $em->getRepository("GuyBlogBundle:Experience");
        $experiences = $repo->findBy([], ["ordre" => "ASC"]);

        $repo = $em->getRepository("GuyBlogBundle:Competence");
        $competences = $repo->findBy([], ["niveau" => "DESC", "nom" => "ASC"]);

        return $this->render(
            'GuyBlogBundle:Pages:cv.html.twig', [
                "formations" => $formations,
                "experiences" => $experiences,
                "realisations" => $realisations,
                "competences" => $competences,
                "full_tags" => $tags,
		"contact_form" => $contactForm->createView()
	]);
    }

    /**
     * @Cache(lastModified="realisation.getLastModification()", ETag="'Realisation' ~ realisation.getId() ~ realisation.getLastModification().format('Y-m-d')")
     */
    public function detailsRealisationAction(Realisation $realisation)
    {
        return $this->render('GuyBlogBundle:Pages:details_realisation.html.twig',["realisation" => $realisation]);
    }
}