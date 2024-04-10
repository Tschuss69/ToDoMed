<?php
namespace App\Controller\Utilities;

use App\Entity\Fhir\Foundation\DataTypes\CodeableConcept;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CodeableConceptByCategory
{
    private $manager;
    private $repository;
    
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager      = $manager;
        $this->repository   = $this->manager->getRepository(CodeableConcept::class);
    }
    
    public function __invoke($data, Request $req)
    {
        return $this->repository
            ->findByTextAndCategory(
                $req->query->get('catname'),
                $req->query->get('ccsearch', null) 
            );
    }
}

