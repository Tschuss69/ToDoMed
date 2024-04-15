<?php

// src/Entity/PractitionerRole.php

namespace App\Entity\Fhir\Administration;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    normalizationContext: ['groups' => ['admin:read','practitioner:read', 'patient:read']],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    mercure: true
)]
#[ORM\Entity]
class PractitionerRole
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Practitioner::class, inversedBy: 'practitionerRoles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Practitioner $practitioner = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\Choice(choices: ['médecin', 'secrétaire', 'infirmière', 'ARC'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $codeCode = null;

    #[ORM\OneToMany(mappedBy: 'requesterPractitionerRole', targetEntity: '\App\Entity\Fhir\Workflow\Task')]
    #[ORM\JoinColumn(nullable: true)]
    private Collection $requestedTasks;

    #[ORM\ManyToMany(mappedBy: 'requestedPerformers', targetEntity: '\App\Entity\Fhir\Workflow\Task')]
    private Collection $performingTasks;

    #[ORM\ManyToMany(mappedBy: 'generalPractitioner', targetEntity: '\App\Entity\Fhir\Administration\Patient')]
    private Collection $patients;

    // Getters and setters

    public function __construct() {
        $this->requestedTasks = new ArrayCollection();
        $this->performingTasks = new ArrayCollection();
        $this->patients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPractitioner(): ?Practitioner {
        return $this->practitioner;
    }

    public function setPractitioner(?Practitioner $practitioner): self {
        $this->practitioner = $practitioner;
        return $this;
    }

    public function getCodeCode(): ?string
    {
        return $this->codeCode;
    }

    public function setCodeCode(?string $codeCode): self
    {
        $this->codeCode = $codeCode;
        return $this;
    }

    // Méthodes pour accéder et manipuler $requestedTasks
    public function getRequestedTasks(): Collection {
        return $this->requestedTasks;
    }

    public function addRequestedTask(\App\Entity\Fhir\Workflow\Task $task): self {
        if (!$this->requestedTasks->contains($task)) {
            $this->requestedTasks[] = $task;
            $task->setRequesterPractitionerRole($this);
        }
        return $this;
    }

    public function removeRequestedTask(\App\Entity\Fhir\Workflow\Task $task): self {
        if ($this->requestedTasks->removeElement($task)) {
            // Définir la logique si nécessaire pour gérer le côté inverse
            if ($task->getRequesterPractitionerRole() === $this) {
                $task->setRequesterPractitionerRole(null);
            }
        }
        return $this;
    }

    // Méthodes pour accéder et manipuler $performingTasks
    public function getPerformingTasks(): Collection {
        return $this->performingTasks;
    }

    public function addPerformingTask(\App\Entity\Fhir\Workflow\Task $task): self {
        if (!$this->performingTasks->contains($task)) {
            $this->performingTasks[] = $task;
            $task->addRequestedPerformer($this);
        }
        return $this;
    }

    public function removePerformingTask(\App\Entity\Fhir\Workflow\Task $task): self {
        if ($this->performingTasks->removeElement($task)) {
            $task->removeRequestedPerformer($this);
        }
        return $this;
    }

    public function getPatients(): Collection
    {
        return $this->patients;
    }

    public function addPatient(\App\Entity\Fhir\Administration\Patient $patient): self {
        if (!$this->patients->contains($patient)) {
            $this->patients[] = $patient;
            $patient->addGeneralPractitioner($this);
        }
        return $this;
    }

    public function removePatient(\App\Entity\Fhir\Administration\Patient $patient): self {
        if ($this->patients->removeElement($patient)) {
            // Définir la logique si nécessaire pour gérer le côté inverse
            if ($patient->getGeneralPractitioner()->contains($this)) {
                $patient->removeGeneralPractitioner($this);
            }
        }
        return $this;
    }
}
