<?php

namespace App\Entity\Utilities;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use App\Entity\Fhir\Foundation\DataTypes\CodeableConcept;
use App\Controller\Utilities\CodeableCategoryTree;


#[ApiResource(operations: [new Get(), new Put(), new GetCollection(), new Post(), new GetCollection(uriTemplate: '/codeable_concept_categories_tree.{_format}', controller: CodeableCategoryTree::class)])]
#[ApiFilter(filterClass: SearchFilter::class, properties: ['id' => 'exact', 'category' => 'ipartial', 'categoryHash' => 'exact', 'parent' => 'exact', 'parent.id' => 'exact'])]
#[ApiFilter(filterClass: OrderFilter::class, properties: ['id', 'category', 'categoryHash', 'parent'])]
#[ApiFilter(filterClass: ExistsFilter::class, properties: ['parent'])]
#[ORM\Table(name: 'codeable_concept_category')]
#[ORM\Index(name: 'category_idx', columns: ['category'])]
#[ORM\Index(name: 'parent_idx', columns: ['parent_id'])]
#[ORM\Entity(repositoryClass: 'App\Repository\Utilities\CodeableConceptCategoryRepository')]
class CodeableConceptCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\NotBlank]
    #[ORM\Column(type: 'string')]
    private $category;

    #[Assert\NotBlank]
    #[ORM\Column(type: 'string', unique: true)]
    private $categoryHash;

    /**
     * @ORM\ManytoOne(targetEntity="App\Entity\Fhir\Foundation\DataTypes\CodeableConcept")
     */
    #[ORM\JoinColumn(name: 'codeableconcept_id', referencedColumnName: 'id', nullable: true, unique: true)]
    private $categorycodeableconcept;

    #[ORM\ManyToOne(targetEntity: 'App\Entity\Utilities\CodeableConceptCategory')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', nullable: true)]
    private $parent;

    #[ORM\JoinTable(name: 'cccategory_has_codeableconcept')]
    #[ORM\JoinColumn(name: 'cccategory_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'codeableconcept_id', referencedColumnName: 'id')]
    #[ORM\ManyToMany(targetEntity: 'App\Entity\Fhir\Foundation\DataTypes\CodeableConcept')]
    private $codeableconcepts;

    public function getCodeableConcepts() : Collection
    {
        return $this->codeableconcepts;
    }

    public function addCodeableConcept(CodeableConcept $cc) : self
    {
        if (!$this->codeableconcepts->contains($cc)) {
            $this->codeableconcepts->add($cc);
        }

        return $this;
    }

    public function removeCodeableConcept(CodeableConcept $cc) : self
    {
        $this->codeableconcepts->removeElement($cc);

        return $this;
    }

    public function setCodeableConcepts(Collection $ccl) : self
    {
        $this->codeableconcepts->clear();

        foreach ($ccl as $cc) {
            $this->addCodeableConcept($cc);
        }

        return $this;
    }

    public function getParent() : ?CodeableConceptCategory
    {
        return $this->parent;
    }

    public function setParent(?CodeableConceptCategory $parent) : self
    {
        $this->parent = $parent;

        return $this;
    }

    public function getCategoryCodeableConcept() : ?CodeableConcept
    {
        return $this->categorycodeableconcept;
    }

    public function setCategoryCodeableConcept(?CodeableConcept $cc) : self
    {
        $this->categorycodeableconcept = $cc;

        return $this;
    }

    public function getCategoryHash() : string
    {
        return $this->categoryHash;
    }

    public function setCategoryHash(?string $hash = null) : self
    {
        if (($hash === null) || (trim($hash) === '')) {
            // TODO: Is this enough to guarantee the unicity of the ID without checking in the DB ??
            $this->categoryHash = uniqid(bin2hex(random_bytes(8)));
        } else {
            $this->categoryHash = $hash;
        }

        return $this;
    }

    public function getCategory() : string
    {
        return $this->category;
    }

    public function setCategory(string $category) : self
    {
        $this->category = $category;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function __construct()
    {
        $this->codeableconcepts = new ArrayCollection();
    }
}
