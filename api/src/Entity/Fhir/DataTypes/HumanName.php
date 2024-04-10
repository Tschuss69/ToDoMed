<?php
namespace App\Entity\Fhir\DataTypes;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\FHIR\Administration\Practitioner as Practitioner;
use Symfony\Component\Serializer\Annotation\Groups;

class HumanName
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read', 'write'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $text = null;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $family = null;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $given = null;

    #[ORM\ManyToOne(targetEntity: 'App\Entity\FHIR\Administration\Practitioner', inversedBy: 'names')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Practitioner $practitioner = null;

    // Getters and setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): self
    {
        $this->text = $text;
        return $this;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }

    public function setFamily(?string $family): self
    {
        $this->family = $family;
        return $this;
    }

    public function getGiven(): ?string
    {
        return $this->given;
    }

    public function setGiven(?string $given): self
    {
        $this->given = $given;
        return $this;
    }

    public function getPractitioner(): ?Practitioner
    {
        return $this->practitioner;
    }

    public function setPractitioner(?Practitioner $practitioner): self
    {
        $this->practitioner = $practitioner;
        return $this;
    }
}
