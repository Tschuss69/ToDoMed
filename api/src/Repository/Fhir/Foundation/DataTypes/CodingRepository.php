<?php

namespace App\Repository\Fhir\Foundation\DataTypes;

use App\Entity\Fhir\Foundation\DataTypes\Coding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry as RegistryInterface;

/**
 * @method CodingType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CodingType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CodingType[]    findAll()
 * @method CodingType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodingRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Coding::class);
    }

    // /**
    //  * @return CodingType[] Returns an array of CodingType objects
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
    public function findOneBySomeField($value): ?CodingType
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
