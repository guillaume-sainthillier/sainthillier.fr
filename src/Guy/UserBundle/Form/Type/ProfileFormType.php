<?php
// src/Guy/UserBundle/Form/Type/ProfileFormType.php

namespace Guy\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\ProfileFormType as BaseType;

class ProfileFormType extends BaseType
{
	
	/**
     * Builds the embedded form representing the user.
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    protected function buildUserForm(FormBuilderInterface $builder, array $options)
    {
		parent::buildUserForm($builder,$options);
		
        $builder
            ->add('username', null, array('disabled' => true, 'label' => 'form.username', 'translation_domain' => 'FOSUserBundle'))
            ->add('date_inscription', 'date', array('disabled' => true,'widget' => 'single_text', 'format' => 'dd/MM/yyyy'))
			->add('nom', null, array('required' => false))
            ->add('prenom', null, array('required' => false))
            ->add('adresse', null, array('required' => false))
            ->add('cp', null, array('required' => false))
            ->add('ville', null, array('required' => false))
        ;
		
		
    }

    public function getName()
    {
        return 'guy_user_profile';
    }
	
	// public function getDefaultOptions()
    // {
        // return array(
            // 'data_class' => 'DEMO\DemoBundle\Entity\Product\Product',
            // 'id'         => null
        // );
    // }
}