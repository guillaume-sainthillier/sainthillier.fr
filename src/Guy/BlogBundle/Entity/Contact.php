<?php

namespace Guy\BlogBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Contact
{

    /**
     * @var string
     *
     * @Assert\NotBlank(message = "Veuillez remplir un nom")
     * @Assert\Length(
     *      min = "2",
     *      minMessage = "Votre nom doit faire au moins {{ limit }} caractères"
     * )
     */
    private $nom;

    /**
     * @var string
     *
     * @Assert\NotBlank(message = "Veuillez remplir une adresse mail")
     * @Assert\Email(
     *     message = "Veuillez renseigner une adresse mail valide",
     *     checkMX = true
     * )
     */
    private $mail;

    /**
     * @var string
     *
     * @Assert\Url(message = "Veuillez renseigner une URL valide")
     */
    private $web;

    /**
     * @var string
     *
     * @Assert\NotBlank(message = "Veuillez remplir votre message")
     */
    private $message;

    /**
     * Set nom
     *
     * @param string $nom
     * @return Entity
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set mail
     *
     * @param string $mail
     * @return Entity
     */
    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }

    /**
     * Get mail
     *
     * @return string
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set web
     *
     * @param string $web
     * @return Entity
     */
    public function setWeb($web)
    {
        $this->web = $web;

        return $this;
    }

    /**
     * Get web
     *
     * @return string
     */
    public function getWeb()
    {
        return $this->web;
    }

    /**
     * Set message
     *
     * @param string $message
     * @return Entity
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }
}
