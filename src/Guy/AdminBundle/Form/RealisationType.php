<?php

namespace Guy\AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class RealisationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('titre','textarea', array("required" => false, "attr" => array("class" => "editor-simple")))
	    ->add('imagePrincipale')
	    ->add('imageIcon')
            ->add('contenu', null, array("required" => false, "attr" => array("class" => "editor-complex")))
	    ->add('collaboration', 'text', array('required' => false))
	    ->add('tags','textarea', array("required" => false, "attr" => array("cols" => "60", "rows" => "5")))
            ->add('lien', new LienType())
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Guy\AdminBundle\Entity\Realisation'
        ));
    }

    public function getName()
    {
        return 'guy_realisation';
    }
}
