<?php

namespace App\Entity\Fhir\Administration;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\Fhir\Administration\GetCurrentPatientController;
use App\Controller\GetEncounterByPatientController;
use App\State\Processor\UserProcessor;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

use App\Traits\GenderTrait;
use App\Traits\NameTrait;
use App\Traits\BirthdateTrait;


#[ApiResource(
    normalizationContext: ['groups' => ['admin:read','practitioner:read', 'patient:read']],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    mercure: true
)]
#[ORM\Entity]
#[Get(
    security: "is_granted('VIEW', object)",
    securityMessage: "Vous n'avez pas les droits nécessaires pour accéder à ce patient."
)]
#[Post(processor: UserProcessor::class)]
#[Delete]
#[Put]
#[GetCollection]
#[GetCollection(
    uriTemplate: '/patients/{id}/encounters',
    requirements: ['id' => '\d+'],
    controller: GetEncounterByPatientController::class,
)]
class Patient extends User
{
    use GenderTrait;
    use NameTrait;
    use BirthdateTrait;



    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected ?int $id = null;


    #[ORM\JoinTable(name: 'patient_has_name')]
    #[ORM\JoinColumn(name: 'patient_id', referencedColumnName: 'id')]
    #[ORM\InverseJoinColumn(name: 'name_id', referencedColumnName: 'id', unique: true)]
    #[ORM\ManyToMany(targetEntity: 'App\Entity\Fhir\Foundation\DataTypes\HumanName', cascade: ['persist', 'remove'])]
    #[Groups(['practitioner:read', 'practitioner:write', 'patient:read'])]
    protected Collection $name;


    #[ORM\ManyToMany(targetEntity: '\App\Entity\Fhir\Administration\PractitionerRole', inversedBy: 'patients')]
    #[Groups(['practitioner:read', 'practitioner:write', 'patient:read'])]
    private Collection $generalPractitioner;


    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    #[Groups(['practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $phone = null;

    #[ORM\OneToMany(mappedBy: 'subject', targetEntity: Encounter::class, cascade: ['persist', 'remove'])]
    private Collection $encounters;

    public function isPatient(): bool
    {
        return true;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getGeneralPractitioner(): Collection
    {
        return $this->generalPractitioner;
    }

    public function addGeneralPractitioner(PractitionerRole $practitionerRole): self
    {
        if (!$this->generalPractitioner->contains($practitionerRole)) {
            $this->generalPractitioner[] = $practitionerRole;
        }

        return $this;
    }

    public function removeGeneralPractitioner(PractitionerRole $practitionerRole): self
    {
        if ($this->generalPractitioner->contains($practitionerRole)) {
            $this->generalPractitioner->removeElement($practitionerRole);
        }

        return $this;
    }


    public function getEncounters(): Collection
    {
        return $this->encounters;
    }

    public function addEncounter(Encounter $encounter): self
    {
        if (!$this->encounters->contains($encounter)) {
            $this->encounters[] = $encounter;
            $encounter->setSubject($this);
        }

        return $this;
    }

    // Je ne suis pas certain que ca soit possible sachant qu'il faut un sujet dans Encounter
    public function removeEncounter(Encounter $encounter): self
    {
        if ($this->encounters->removeElement($encounter)) {
            // set the owning side to null (unless already changed)
            if ($encounter->getSubject() === $this) {
                $encounter->setSubject(null);
            }
        }

        return $this;
    }

    public function __construct()
    {
        $this->name = new ArrayCollection();
        $this->generalPractitioner = new ArrayCollection();
        $this->encounters = new ArrayCollection();
    }
}
