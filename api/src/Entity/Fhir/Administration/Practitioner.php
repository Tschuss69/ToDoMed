<?php

namespace App\Entity\Fhir\Administration;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\State\Processor\UserProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Fhir\Foundation\DataTypes\HumanName as HumanName;


#[ApiResource(
    operations: [
        new Get(),
        new Post(processor: UserProcessor::class),
    ]
)]
#[ORM\Entity]
class Practitioner extends User
{
    #[ORM\OneToMany(mappedBy: 'practitioner', targetEntity: HumanName::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private Collection $names;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['male', 'female', 'other', 'unknown'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $gender = null;

    #[ORM\Column(type: 'date')]
    #[Assert\NotNull]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\OneToMany(mappedBy: 'practitioner', targetEntity: PractitionerRole::class, cascade: ['persist'], orphanRemoval: true)]
    #[Assert\Count(min: 1, minMessage: 'A practitioner must have at least one practitioner role.')]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private Collection $practitionerRoles;

    public function __construct()
    {
        $this->names = new ArrayCollection();
        $this->practitionerRoles = new ArrayCollection();
    }

    public function isPractitioner(): bool
    {
        return true;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;
        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): self
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getNames(): Collection
    {
        return $this->names;
    }

    public function addName(HumanName $name): self
    {
        if (!$this->names->contains($name)) {
            $this->names[] = $name;
            $name->setPractitioner($this);
        }

        return $this;
    }

    public function removeName(HumanName $name): self
    {
        if ($this->names->removeElement($name)) {
            // set the owning side to null (unless already changed)
            if ($name->getPractitioner() === $this) {
                $name->setPractitioner(null);
            }
        }

        return $this;
    }

    public function getPractitionerRoles(): Collection {
        return $this->practitionerRoles;
    }

    public function addPractitionerRole(PractitionerRole $practitionerRole): self {
        if (!$this->practitionerRoles->contains($practitionerRole)) {
            $this->practitionerRoles[] = $practitionerRole;
            $practitionerRole->setPractitioner($this);
        }
        return $this;
    }

    public function removePractitionerRole(PractitionerRole $practitionerRole): self {
        if ($this->practitionerRoles->removeElement($practitionerRole)) {
            // set the owning side to null (unless already changed)
            if ($practitionerRole->getPractitioner() === $this) {
                $practitionerRole->setPractitioner(null);
            }
        }
        return $this;
    }
}
