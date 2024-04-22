<?php
// src/Entity/Fhir/Administration/Encounter.php

namespace App\Entity\Fhir\Administration;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\GetEncounterTaskController;
use App\Entity\Fhir\Workflow\Task;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Fhir\Administration\Patient;
use App\Entity\Fhir\Foundation\DataTypes\CodeableConcept;
use App\Entity\Fhir\Administration\PractitionerRole;
use Symfony\Component\Validator\Constraints AS Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;


#[ApiResource(
    normalizationContext: ['groups' => ['admin:read','practitioner:read','patient:read']],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    mercure: true
)]
#[ORM\Entity]
class Encounter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 20, nullable: false)]
    #[Assert\Choice(['planned', 'in-progress', 'on-hold', 'discharged', 'completed', 'cancelled', 'discontinued', 'entered-in-error', 'unknown'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $status = null;

    #[ORM\ManyToOne(targetEntity: Patient::class, inversedBy: "encounters")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?Patient $subject = null;

    #[ORM\Column(type: "datetime")]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?\DateTimeInterface $plannedStartDate = null;

    #[ORM\ManyToOne(targetEntity: CodeableConcept::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?CodeableConcept $type = null;

    #[ORM\ManyToOne(targetEntity: PractitionerRole::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?PractitionerRole $actor = null;

    #[ORM\ManyToMany(targetEntity: Task::class, inversedBy: 'encounters', cascade: ['persist', 'remove', 'merge'])]
    #[ORM\JoinTable(name: 'encounter_task')]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private Collection $tasks;

    public function __construct() {
        $this->tasks = new ArrayCollection();
    }


    public function getTasks(): Collection {
        return $this->tasks;
    }

    public function addTask(Task $task): self {
        if (!$this->tasks->contains($task)) {
            $this->tasks[] = $task;
            $task->addEncounter($this);
        }

        return $this;
    }

    public function removeTask(Task $task): self {
        if ($this->tasks->removeElement($task)) {
            $task->removeEncounter($this);
        }

        return $this;
    }

    // Getters and setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getSubject(): ?Patient
    {
        return $this->subject;
    }

    public function setSubject(?Patient $subject): self
    {
        $this->subject = $subject;
        return $this;
    }

    public function getPlannedStartDate(): ?\DateTimeInterface
    {
        return $this->plannedStartDate;
    }

    public function setPlannedStartDate(\DateTimeInterface $plannedStartDate): self
    {
        $this->plannedStartDate = $plannedStartDate;
        return $this;
    }

    public function getType(): ?CodeableConcept
    {
        return $this->type;
    }

    public function setType(?CodeableConcept $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getActor(): ?PractitionerRole
    {
        return $this->actor;
    }

    public function setActor(?PractitionerRole $actor): self
    {
        $this->actor = $actor;
        return $this;
    }
}
