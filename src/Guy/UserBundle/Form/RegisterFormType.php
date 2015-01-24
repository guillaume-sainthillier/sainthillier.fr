<?php
// src/Guy/UserBundle/Form/RegisterFormType.php

namespace Guy\UserBundle\Form;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegisterFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);

        // add your custom field
        // $builder->add('name');
    }

    public function getName()
    {
        return 'guy_user_registration';
    }
}