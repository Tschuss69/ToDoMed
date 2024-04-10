<?php

namespace App\Repository\Fhir\Administration;

// src/Repository/EncounterRepository.php

use App\Entity\Fhir\Administration\Encounter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class EncounterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Encounter::class);
    }

    // Dans EncounterRepository

    public function findByPatientId($patientId)
    {
        return $this->createQueryBuilder('e')
            ->join('e.subject', 'p')
            ->where('p.id = :patientId')
            ->setParameter('patientId', $patientId)
            ->getQuery()
            ->getResult();
    }

}
