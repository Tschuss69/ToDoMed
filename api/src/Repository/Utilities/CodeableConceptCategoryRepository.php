<?php

namespace App\Repository\Utilities;

use App\Entity\Utilities\CodeableConceptCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry as RegistryInterface;
use Doctrine\ORM\Query;

/**
 * @method CodeableConceptCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method CodeableConceptCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method CodeableConceptCategory[]    findAll()
 * @method CodeableConceptCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodeableConceptCategoryRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CodeableConceptCategory::class);
    }
    
    public function findByParentId(?int $value) 
    {
        $qb = $this->createQueryBuilder('c');
        
        if ($value === null) {
            $query = $qb
                ->andWhere($qb->expr()->isNull('c.parent'))
                ->getQuery();
        } else {
            $query = $qb
                ->andWhere('c.parent = :value')
                ->setParameter('value', $value)
                ->getQuery();
        }
        
        return $query->getResult();
    }

    // /**
    //  * @return CodeableConceptCategory[] Returns an array of CodeableConceptCategory objects
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
    public function findOneBySomeField($value): ?CodeableConceptCategory
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
