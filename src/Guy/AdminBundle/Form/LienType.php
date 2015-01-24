<?php

namespace Guy\AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class LienType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$options = array("required" => false, "attr" => array("class" => "editor-simple"));
	$builder
	    ->add('url_demo', 'text', $options)
	    ->add('description_demo', 'textarea', $options)
	    ->add('url_site', 'text', $options)
	    ->add('description_site', 'textarea', $options)
	    ->add('url_projet', 'text', $options)
	    ->add('description_projet', 'textarea', $options)
	;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver) {
	$resolver->setDefaults(array(
	    'data_class' => 'Guy\AdminBundle\Entity\Lien'
	));
    }

    public function getName() {
	return 'guy_lien';
    }

}
