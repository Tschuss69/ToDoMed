<?php
namespace App\Controller\Utilities;

use App\Entity\Fhir\Foundation\DataTypes\CodeableConcept;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CodeableConceptByCategoryHash
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
        ->findByTextAndCategoryHash(
            $req->query->get('category_hash'),
            $req->query->get('ccsearch', null)
            );
    }
}

