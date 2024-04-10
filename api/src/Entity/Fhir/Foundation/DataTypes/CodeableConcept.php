<?php

namespace App\Entity\Fhir\Foundation\DataTypes;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Controller\Utilities\CodeableConceptByCategory;
use App\Controller\Utilities\CodeableConceptByCategoryHash;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * FHIR v4.0.0
 * https://www.hl7.org/fhir/datatypes.html#CodeableConcept
 */
#[ApiResource(
    mercure: true,
    operations: [new Get(), new Put(), new GetCollection(), new Post(), new GetCollection(
        uriTemplate: '/codeable_concept_by_category_name.{_format}',
        controller: CodeableConceptByCategory::class,
        openapiContext: ['parameters' => [['name' => 'catname', 'in' => 'query', 'required' => true, 'type' => 'string'], ['name' => 'ccsearch', 'in' => 'query', 'required' => false, 'type' => 'string'
        ]]]
    ), new GetCollection(
        uriTemplate: '/codeable_concept_by_category_hash.{_format}',
        controller: CodeableConceptByCategoryHash::class,
        openapiContext: ['parameters' => [['name' => 'category_hash', 'in' => 'query', 'required' => true, 'type' => 'string'], ['name' => 'ccsearch', 'in' => 'query', 'required' => false, 'type' => 'string']]]
    )],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    normalizationContext: ['groups' => ['admin:read','practitioner:read']],
)]
#[ApiFilter(filterClass: SearchFilter::class, properties: ['id' => 'exact', 'text' => 'ipartial', 'coding.display' => 'ipartial', 'coding.code' => 'exact'])]
#[ApiFilter(filterClass: OrderFilter::class, properties: ['id', 'text'])]
#[ORM\Table(name: 'codeable_concept')]
#[ORM\Index(name: 'text_idx', columns: ['text'])]
#[ORM\Entity(repositoryClass: 'App\Repository\Fhir\Foundation\DataTypes\CodeableConceptRepository')]
class CodeableConcept extends Element
{
    #[ORM\JoinTable(name: 'codeable_concept_coding')]
    #[ORM\JoinColumn(name: 'codeableconcept_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'coding_id', referencedColumnName: 'id')]
    #[ORM\ManyToMany(targetEntity: 'App\Entity\Fhir\Foundation\DataTypes\Coding', cascade: ['persist'])]
    protected $coding;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $text;

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getCoding(): Collection
    {
        return $this->coding;
    }

    public function addCoding(Coding $coding): self
    {
        if (!$this->coding->contains($coding)) {
            $this->coding->add($coding);
        }

        return $this;
    }

    public function removeCoding(Coding $coding): self
    {
        $this->coding->removeElement($coding);

        return $this;
    }

    public function setCoding(Collection $coding): self
    {
        $this->coding->clear();

        foreach ($coding as $c) {
            $this->addCoding($c);
        }

        return $this;
    }

    public function __construct()
    {
        parent::__construct();

        $this->coding = new ArrayCollection();
    }
}
