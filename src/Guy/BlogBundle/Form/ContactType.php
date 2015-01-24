<?php

namespace Guy\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ContactType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$builder->add('nom', null, array(
	    "label" => false,
	    "attr" => array(
		"placeholder" => "Nom",
	    )
	));
	$builder->add('mail', 'email', array(
	    "label" => false,
	    "required" => false,
	    "attr" => array(
		"placeholder" => "Email",
	    )
	));
	$builder->add('web', null, array(
	    "label" => false,
	    "attr" => array(
		"placeholder" => "Web",
	    )
	));
	$builder->add('message', 'textarea', array(
	    "label" => false,
	    "attr" => array(
		"placeholder" => "Message",
	    )
	));
    }

    public function getName() {
	return 'contact';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {
	$resolver->setDefaults(array(
	    'data_class' => 'Guy\BlogBundle\Entity\Contact',
	));
    }

}