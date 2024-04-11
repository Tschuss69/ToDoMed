<?php

namespace App\Entity\Fhir\Administration;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Fhir\Foundation\DataTypes\HumanName as HumanName;


#[ApiResource(mercure: true)]
#[ORM\Entity]
class Practitioner extends User
{
    #[ORM\OneToMany(mappedBy: 'practitioner', targetEntity: HumanName::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $names;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['male', 'female', 'other', 'unknown'])]
    private ?string $gender = null;

    #[ORM\Column(type: 'date')]
    #[Assert\NotNull]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\OneToMany(mappedBy: 'practitioner', targetEntity: PractitionerRole::class, cascade: ['persist'], orphanRemoval: true)]
    #[Assert\Count(min: 1, minMessage: 'A practitioner must have at least one practitioner role.')]
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
