<?php

namespace Guy\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tag
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Guy\AdminBundle\Entity\TagRepository")
 */
class Tag
{
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
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;
	
	/**
     * @ORM\ManyToOne(targetEntity="Guy\AdminBundle\Entity\Realisation", inversedBy="tags",cascade={"persist"})
     * @ORM\JoinColumn(name="realisation_id", referencedColumnName="id")
     */
	private $realisation;
	
	
	/**
	* Set article
	*
	* @param Guy\AdminBundle\Entity\Realisation $realisation
	*/
	public function setRealisation(\Guy\AdminBundle\Entity\Realisation $realisation)
	{
		$this->realisation = $realisation;
	}

	/**
	* Get article
	*
	* @return Guy\AdminBundle\Entity\Realisation
	*/
	public function getRealisation()
	{
		return $this->realisation;
	}

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nom
     *
     * @param string $nom
     * @return Tag
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
}