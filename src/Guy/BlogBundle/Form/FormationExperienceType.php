<?php

namespace Guy\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

use Guy\BlogBundle\Form\DataTransformer\ArrayToStringTransformer;

class FormationExperienceType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {

	$transformer = new ArrayToStringTransformer;

	$builder
	    ->add('nom', 'textarea', ["required" => false, "attr" => ["class" => "editor-simple"]])
	    ->add('intitule')
	    ->add('ordre')
	    ->add('periode')
	    ->add('description', 'textarea', ["required" => false, "attr" => ["class" => "editor-complex"]])
	    ->add($builder->create('points', 'text')->addModelTransformer($transformer))
	;
    }

    public function getName() {
	return 'formation';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {
	$resolver->setDefaults([
	    'data_class' => 'Guy\BlogBundle\Entity\FormationExperience',
	]);
    }
}