<?php
namespace App\Controller\Utilities;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Utilities\CodeableConceptCategory;
use App\Entity\Utilities\CCTree;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class CodeableCategoryTree
{
    private $manager;
    private $repository;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager      = $manager;
        $this->repository   = $this->manager->getRepository(CodeableConceptCategory::class);
    }
    
    public function __invoke($data)
    {
        $categoryTree = new CCTree();
        $categoryTree->node = null;
        
        return array($this->buildTree($categoryTree, null));
    }
    
    protected function buildTree(CCTree &$cattree, ?int $parent_id) : CCTree
    {
        $tree = $this->repository->findByParentId($parent_id);
        
        if (count($tree) > 0) {
            foreach ($tree as $node) {
                $element = new CCTree();
                $element->node = $node;
                
                $cattree->children[] = $element;
                
                $this->buildTree($element, $node->getId());
            }
        }
        
        return $cattree; 
    }
}


