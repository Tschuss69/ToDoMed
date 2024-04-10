<?php

namespace App\Repository\Fhir\Foundation\DataTypes;

use App\Entity\Fhir\Foundation\DataTypes\CodeableConcept;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry as RegistryInterface;

/**
 * @method CodeableConcept|null find($id, $lockMode = null, $lockVersion = null)
 * @method CodeableConcept|null findOneBy(array $criteria, array $orderBy = null)
 * @method CodeableConcept[]    findAll()
 * @method CodeableConcept[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodeableConceptRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CodeableConcept::class);
    }

    public function findByTextAndCategory(string $catname, string $ccsearch = null) {

        $sub = $this->_em->createQueryBuilder()
            ->select('catcc.id')
            ->from('App\Entity\Utilities\CodeableConceptCategory', 'ccat')
            ->innerJoin('ccat.codeableconcepts', 'catcc')
            ->where('ccat.category = :catname');

        $qb = $this->createQueryBuilder('cc');

        $qb->where($qb->expr()->in('cc', $sub->getDQL()))
            ->setParameter(':catname', $catname);

        if ($ccsearch !== null) {
            $qb->andWhere('cc.text LIKE :ccsearch')
                ->setParameter(':ccsearch', '%' . $ccsearch . '%');
        }

        return $qb->getQuery()->getResult();
    }

    public function findByTextAndCategoryHash(string $category_hash, string $ccsearch = null) {

        $sub = $this->_em->createQueryBuilder()
            ->select('catcc.id')
            ->from('App\Entity\Utilities\CodeableConceptCategory', 'ccat')
            ->innerJoin('ccat.codeableconcepts', 'catcc')
            ->where('ccat.categoryHash = :cathash');

        $qb = $this->createQueryBuilder('cc');

        $qb->where($qb->expr()->in('cc', $sub->getDQL()))
            ->setParameter(':cathash', $category_hash);

        if ($ccsearch !== null) {
            $qb->andWhere('cc.text LIKE :ccsearch')
            ->setParameter(':ccsearch', '%' . $ccsearch . '%');
        }

        return $qb->getQuery()->getResult();
    }

    // /**
    //  * @return CodeableConcept[] Returns an array of CodeableConcept objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CodeableConcept
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
