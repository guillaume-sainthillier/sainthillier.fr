<?php

namespace Guy\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class FormationExperienceType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$builder
	    ->add('nom', 'textarea', array("required" => false, "attr" => array("class" => "editor-simple")))
	    ->add('intitule')
	    ->add('ordre')
	    ->add('periode')
	    ->add('description', 'textarea', array("required" => false, "attr" => array("class" => "editor-complex")))
	    ->add('points')
	;
    }

    public function getName() {
	return 'formation';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {
	$resolver->setDefaults(array(
	    'data_class' => 'Guy\BlogBundle\Entity\FormationExperience',
	));
    }
}