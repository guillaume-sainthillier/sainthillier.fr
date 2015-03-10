<?php

namespace Guy\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ContactType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$builder->add('nom', null, [
	    "label" => false,
	    "attr" => [
		"placeholder" => "Nom",
	    ]
	]);
	$builder->add('mail', 'email', [
	    "label" => false,
	    "required" => false,
	    "attr" => [
		"placeholder" => "Email",
	    ]
	]);
	$builder->add('web', null, [
	    "label" => false,
	    "attr" => [
		"placeholder" => "Web",
	    ]
	]);
	$builder->add('message', 'textarea', [
	    "label" => false,
	    "attr" => [
		"placeholder" => "Message",
	    ]
	]);
    }

    public function getName() {
	return 'contact';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {
	$resolver->setDefaults([
	    'data_class' => 'Guy\BlogBundle\Entity\Contact',
	]);
    }

}