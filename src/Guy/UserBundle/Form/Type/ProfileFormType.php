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
            ->add('username', null, ['disabled' => true, 'label' => 'form.username', 'translation_domain' => 'FOSUserBundle'])
            ->add('date_inscription', 'date', ['disabled' => true,'widget' => 'single_text', 'format' => 'dd/MM/yyyy'])
			->add('nom', null, ['required' => false])
            ->add('prenom', null, ['required' => false])
            ->add('adresse', null, ['required' => false])
            ->add('cp', null, ['required' => false])
            ->add('ville', null, ['required' => false])
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