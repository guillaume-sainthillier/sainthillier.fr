<?php

namespace Guy\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Lien
 *
 * @ORM\Table()
 * @ORM\Entity()
 */
class Lien {

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="url_demo", type="string", length=255, nullable=true)
     */
    private $urlDemo;

    /**
     * @var string
     *
     * @ORM\Column(name="description_demo", type="string", length=255, nullable=true)
     */
    private $descriptionDemo;

    /**
     * @var string
     *
     * @ORM\Column(name="url_site", type="string", length=255, nullable=true)
     */
    private $urlSite;

    /**
     * @var string
     *
     * @ORM\Column(name="description_site", type="string", length=255, nullable=true)
     */
    private $descriptionSite;

    /**
     * @var string
     *
     * @ORM\Column(name="url_projet", type="string", length=255, nullable=true)
     */
    private $urlProjet;

    /**
     * @var string
     *
     * @ORM\Column(name="description_projet", type="string", length=255, nullable=true)
     */
    private $descriptionProjet;

    public function __construct() {
	$this->descriptionProjet = "";
	$this->urlProjet = "";
	$this->descriptionSite = "";
	$this->urlSite = "";
	$this->descriptionDemo = "";
	$this->urlDemo = "";
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
	return $this->id;
    }

    /**
     * Set urlDemo
     *
     * @param string $urlDemo
     * @return Lien
     */
    public function setUrlDemo($urlDemo) {
	$this->urlDemo = $urlDemo;

	return $this;
    }

    /**
     * Get urlDemo
     *
     * @return string
     */
    public function getUrlDemo() {
	return $this->urlDemo;
    }

    /**
     * Set descriptionDemo
     *
     * @param string $descriptionDemo
     * @return Lien
     */
    public function setDescriptionDemo($descriptionDemo) {
	$this->descriptionDemo = $descriptionDemo;

	return $this;
    }

    /**
     * Get descriptionDemo
     *
     * @return string
     */
    public function getDescriptionDemo() {
	return $this->descriptionDemo;
    }

    /**
     * Set urlSite
     *
     * @param string $urlSite
     * @return Lien
     */
    public function setUrlSite($urlSite) {
	$this->urlSite = $urlSite;

	return $this;
    }

    /**
     * Get urlSite
     *
     * @return string
     */
    public function getUrlSite() {
	return $this->urlSite;
    }

    /**
     * Set descriptionSite
     *
     * @param string $descriptionSite
     * @return Lien
     */
    public function setDescriptionSite($descriptionSite) {
	$this->descriptionSite = $descriptionSite;

	return $this;
    }

    /**
     * Get descriptionSite
     *
     * @return string
     */
    public function getDescriptionSite() {
	return $this->descriptionSite;
    }

    /**
     * Set urlProjet
     *
     * @param string $urlProjet
     * @return Lien
     */
    public function setUrlProjet($urlProjet) {
	$this->urlProjet = $urlProjet;

	return $this;
    }

    /**
     * Get urlProjet
     *
     * @return string
     */
    public function getUrlProjet() {
	return $this->urlProjet;
    }

    /**
     * Set descriptionProjet
     *
     * @param string $descriptionProjet
     * @return Lien
     */
    public function setDescriptionProjet($descriptionProjet) {
	$this->descriptionProjet = $descriptionProjet;

	return $this;
    }

    /**
     * Get descriptionProjet
     *
     * @return string
     */
    public function getDescriptionProjet() {
	return $this->descriptionProjet;
    }

}
