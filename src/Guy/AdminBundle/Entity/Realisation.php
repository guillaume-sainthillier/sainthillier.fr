<?php

namespace Guy\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Realisation
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Guy\AdminBundle\Entity\RealisationRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Realisation {

    /**
     * @ORM\OneToMany(targetEntity="Tag", mappedBy="realisation",cascade={"persist"})
     */
    protected $tags;

    //@Gedmo\Slug(fields={"titre"})
    /**
     *
     * @ORM\Column(length=128, unique=true)
     */
    protected $slug;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \DateTime
     * @ORM\Column(name="last_modification", type="datetime", nullable=true)
     */
    protected $lastModification;

    /**
     * @var \DateTime
     * @ORM\Column(name="date_projet", type="datetime", nullable=true)
     */
    protected $dateProjet;


    /**
     * @var string
     *
     * @ORM\Column(name="titre", type="string", length=255)
     * @Assert\NotBlank(message="Le titre ne doit pas être vide")
     */
    protected $titre;

    /**
     * @var string
     *
     * @ORM\Column(name="contenu", type="text")
     * @Assert\NotBlank(message="Le contenu ne doit pas être vide")
     */
    protected $contenu;

    /**
     * @var string
     *
     * @ORM\Column(name="collaboration", type="string", length=255, nullable=true)
     */
    protected $collaboration;

    /**
     *
     * @ORM\OneToOne(targetEntity="Guy\AdminBundle\Entity\Lien", cascade={"persist"})
     */
    protected $lien;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $pathImagePrincipale;

    /**
     * @var UploadedFile
     *
     * @Assert\File(maxSize="6000000")
     */
    protected $imagePrincipale;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $pathImageIcon;

    /**
     * @var UploadedFile
     *
     * @Assert\File(maxSize="6000000")
     */
    protected $imageIcon;


    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload()
    {
        if (null !== $this->imagePrincipale) {
            $this->pathImagePrincipale = sha1(uniqid(mt_rand(), true)).'.'.$this->imagePrincipale->guessExtension();
        }

        if (null !== $this->imageIcon) {
            $this->pathImageIcon = sha1(uniqid(mt_rand(), true)).'.'.$this->imageIcon->guessExtension();
        }

	$this->setLastModification(new \DateTime);
    }


    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {
        if (null !== $this->imagePrincipale) {
	    $this->imagePrincipale->move($this->getUploadRootDir(), $this->pathImagePrincipale);

	    unset($this->imagePrincipale);
	}

        if (null !== $this->imageIcon) {
	    $this->imageIcon->move($this->getUploadRootDir(), $this->pathImageIcon);

	    unset($this->imageIcon);
	}
    }

    /**
     * @ORM\PostRemove()
     */
    public function removeUpload()
    {
        if (($file = $this->getAbsolutePathImagePrincipale())) {
            unlink($file);
        }
        if (($file = $this->getAbsolutePathImageIcon())) {
            unlink($file);
        }
    }

    public function __construct() {
        $this->tags = new ArrayCollection();
    }

    public function setTags($tags) {
        $tags = is_array($tags) ? $tags : explode(" ", $tags);
        sort($tags, SORT_NATURAL | SORT_FLAG_CASE);
        foreach ($tags as $tag) {
            if (trim($tag) != "") {
                $t = new Tag;
                $t->setNom($tag);
                $t->setRealisation($this);
                $this->addTag($t);
            }
        }
        return $this;
    }

    public function getAbsolutePathImageIcon()
    {
        return null === $this->pathImageIcon ? null : $this->getUploadRootDir().'/'.$this->pathImageIcon;
    }

    public function getWebPathImageIcon()
    {
        return null === $this->pathImageIcon ? null : $this->getUploadDir().'/'.$this->pathImageIcon;
    }

    public function getAbsolutePathImagePrincipale()
    {
        return null === $this->pathImagePrincipale ? null : $this->getUploadRootDir().'/'.$this->pathImagePrincipale;
    }

    public function getWebPathImagePrincipale()
    {
        return null === $this->pathImagePrincipale ? null : $this->getUploadDir().'/'.$this->pathImagePrincipale;
    }

    protected function getUploadRootDir()
    {
        // le chemin absolu du répertoire où les documents uploadés doivent être sauvegardés
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        // on se débarrasse de « __DIR__ » afin de ne pas avoir de problème lorsqu'on affiche
        // le document/image dans la vue.
        return 'uploads';
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
     * Set lastModification
     *
     * @param \DateTime $lastModification
     * @return Realisation
     */
    public function setLastModification($lastModification)
    {
        $this->lastModification = $lastModification;

        return $this;
    }

    /**
     * Get lastModification
     *
     * @return \DateTime
     */
    public function getLastModification()
    {
        return $this->lastModification;
    }

    /**
     * Set dateProjet
     *
     * @param \DateTime $dateProjet
     * @return Realisation
     */
    public function setDateProjet($dateProjet)
    {
        $this->dateProjet = $dateProjet;

        return $this;
    }

    /**
     * Get dateProjet
     *
     * @return \DateTime
     */
    public function getDateProjet()
    {
        return $this->dateProjet;
    }

    /**
     * Set titre
     *
     * @param string $titre
     * @return Realisation
     */
    public function setTitre($titre)
    {
        $this->titre = $titre;

        return $this;
    }

    /**
     * Get titre
     *
     * @return string
     */
    public function getTitre()
    {
        return $this->titre;
    }

    /**
     * Set contenu
     *
     * @param string $contenu
     * @return Realisation
     */
    public function setContenu($contenu)
    {
        $this->contenu = $contenu;

        return $this;
    }

    /**
     * Get contenu
     *
     * @return string
     */
    public function getContenu()
    {
        return $this->contenu;
    }

    /**
     * Set collaboration
     *
     * @param string $collaboration
     * @return Realisation
     */
    public function setCollaboration($collaboration)
    {
        $this->collaboration = $collaboration;

        return $this;
    }

    /**
     * Get collaboration
     *
     * @return string
     */
    public function getCollaboration()
    {
        return $this->collaboration;
    }

    /**
     * Set pathImagePrincipale
     *
     * @param string $pathImagePrincipale
     * @return Realisation
     */
    public function setPathImagePrincipale($pathImagePrincipale)
    {
        $this->pathImagePrincipale = $pathImagePrincipale;

        return $this;
    }

    /**
     * Get pathImagePrincipale
     *
     * @return string
     */
    public function getPathImagePrincipale()
    {
        return $this->pathImagePrincipale;
    }

    /**
     * Set pathImageIcon
     *
     * @param string $pathImageIcon
     * @return Realisation
     */
    public function setPathImageIcon($pathImageIcon)
    {
        $this->pathImageIcon = $pathImageIcon;

        return $this;
    }

    /**
     * Get pathImageIcon
     *
     * @return string
     */
    public function getPathImageIcon()
    {
        return $this->pathImageIcon;
    }

    /**
     * Add tags
     *
     * @param \Guy\AdminBundle\Entity\Tag $tags
     * @return Realisation
     */
    public function addTag(\Guy\AdminBundle\Entity\Tag $tags)
    {
        $this->tags[] = $tags;

        return $this;
    }

    /**
     * Remove tags
     *
     * @param \Guy\AdminBundle\Entity\Tag $tags
     */
    public function removeTag(\Guy\AdminBundle\Entity\Tag $tags)
    {
        $this->tags->removeElement($tags);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set lien
     *
     * @param \Guy\AdminBundle\Entity\Lien $lien
     * @return Realisation
     */
    public function setLien(\Guy\AdminBundle\Entity\Lien $lien = null)
    {
        $this->lien = $lien;

        return $this;
    }

    /**
     * Get lien
     *
     * @return \Guy\AdminBundle\Entity\Lien
     */
    public function getLien()
    {
        return $this->lien;
    }

    public function getImagePrincipale() {
	return $this->imagePrincipale;
    }

    public function getImageIcon() {
	return $this->imageIcon;
    }

    public function setImagePrincipale(UploadedFile $imagePrincipale) {

	$this->imagePrincipale = $imagePrincipale;
        // check if we have an old image path
        if (isset($this->pathImagePrincipale)) {
            // store the old name to delete after the update
            $this->temp = $this->pathImagePrincipale;
            $this->pathImagePrincipale = null;
        } else {
            $this->pathImagePrincipale = 'initial';
        }

	return $this;
    }

    public function setImageIcon(UploadedFile $imageIcon) {
	$this->imageIcon = $imageIcon;
        // check if we have an old image path
        if (isset($this->pathImageIcon)) {
            // store the old name to delete after the update
            $this->temp = $this->pathImageIcon;
            $this->pathImageIcon = null;
        } else {
            $this->pathImageIcon = 'initial';
        }

	return $this;
    }



    /**
     * Set slug
     *
     * @param string $slug
     * @return Realisation
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }
}
