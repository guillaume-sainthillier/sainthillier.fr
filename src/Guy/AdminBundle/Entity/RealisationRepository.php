<?php

namespace Guy\AdminBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * RealisationRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RealisationRepository extends EntityRepository {

    public function getLastDateModification()
    {
        return $this->_em
        ->createQueryBuilder()
        ->select('MAX(r.lastModification) as last_date')
        ->from('GuyAdminBundle:Realisation',"r")
        ->getQuery()
        ->getSingleScalarResult();
    }

    public function findRealisationsWithTag($tag) {
        $qb = $this->_em->createQueryBuilder();

        $tags = $qb->select('t')
                ->from('GuyAdminBundle:Tag', 't')
                ->where('LOWER(t.nom) = :nom')
                ->setParameter('nom', strtolower($tag))
                ->orderBy("t.realisation", "ASC")
                ->getQuery()
                ->getResult();

        $realisations = [];

        foreach ($tags as $tag) {
            $realisations[] = $tag->getRealisation();
        }
        return $realisations;
    }

}
