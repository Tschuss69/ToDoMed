<?php

// src/Entity/Task.php

namespace App\Entity\Fhir\Workflow;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Fhir\Administration\Encounter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Fhir\Administration\PractitionerRole;

#[ApiResource(
    normalizationContext: ['groups' => ['admin:read','practitioner:read', ]],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    mercure: true
)]
#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\Choice(choices: ['requested', 'in-progress', 'completed', 'cancelled'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $status = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\Choice(choices: ['routine', 'urgent'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $priority = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $description = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?\DateTimeInterface $authoredOn = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?\DateTimeInterface $lastModified = null;

    #[ORM\ManyToOne(targetEntity: PractitionerRole::class, inversedBy: 'requestedTasks')]
    #[ORM\JoinColumn(nullable: true)]
    private ?PractitionerRole $requesterPractitionerRole = null;

    #[ORM\ManyToMany(targetEntity: PractitionerRole::class, inversedBy: 'performingTasks')]
    #[ORM\JoinTable(name: "task_requested_performer")]
    #[ORM\JoinColumn(nullable: true)]
    #[ORM\InverseJoinColumn(nullable: true)]
    private Collection $requestedPerformers;

    #[ORM\Column(type: 'string', length: 50)]
    #[Assert\Choice(choices: ['initial', 'intervention', 'complication', 'telesuivi'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?string $content = null;

    #[ORM\ManyToMany(targetEntity: Encounter::class, mappedBy: 'tasks')]
    private Collection $encounters;

    #[ORM\Column(type: 'integer')]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write', 'patient:read'])]
    private ?int $completionRate = null;


    public function __construct() {
        $this->encounters = new ArrayCollection();
        $this->requestedPerformers = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    // Getter et Setter pour encounters
    public function getEncounters(): Collection {
        return $this->encounters;
    }

    public function addEncounter(Encounter $encounter): self {
        if (!$this->encounters->contains($encounter)) {
            $this->encounters[] = $encounter;
        }

        return $this;
    }

    public function removeEncounter(Encounter $encounter): self {
        $this->encounters->removeElement($encounter);

        return $this;
    }


    #[ORM\PrePersist]
    public function onPrePersist(): void {
        $this->authoredOn = new \DateTime('now');
        $this->lastModified = new \DateTime('now');
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void {
        $this->lastModified = new \DateTime('now');
    }



    public function getStatus(): ?string {
        return $this->status;
    }

    public function setStatus(?string $status): self {
        $this->status = $status;
        return $this;
    }

    public function getPriority(): ?string {
        return $this->priority;
    }

    public function setPriority(?string $priority): self {
        $this->priority = $priority;
        return $this;
    }

    public function getDescription(): ?string {
        return $this->description;
    }

    public function setDescription(?string $description): self {
        $this->description = $description;
        return $this;
    }

    public function getAuthoredOn(): ?\DateTimeInterface {
        return $this->authoredOn;
    }

    public function setAuthoredOn(?\DateTimeInterface $authoredOn): self {
        $this->authoredOn = $authoredOn;
        return $this;
    }

    public function getLastModified(): ?\DateTimeInterface {
        return $this->lastModified;
    }

    public function setLastModified(?\DateTimeInterface $lastModified): self {
        $this->lastModified = $lastModified;
        return $this;
    }

    public function getRequesterPractitionerRole(): ?PractitionerRole {
        return $this->requesterPractitionerRole;
    }

    public function setRequesterPractitionerRole(?PractitionerRole $requesterPractitionerRole): self {
        $this->requesterPractitionerRole = $requesterPractitionerRole;
        return $this;
    }

    public function getRequestedPerformers(): Collection {
        return $this->requestedPerformers;
    }

    public function addRequestedPerformer(PractitionerRole $requestedPerformer): self {
        if (!$this->requestedPerformers->contains($requestedPerformer)) {
            $this->requestedPerformers[] = $requestedPerformer;
        }
        return $this;
    }

    public function removeRequestedPerformer(PractitionerRole $requestedPerformer): self {
        $this->requestedPerformers->removeElement($requestedPerformer);
        return $this;
    }

    public function getContent(): ?string {
        return $this->content;
    }

    public function setContent(?string $content): self {
        $this->content = $content;
        return $this;
    }

    public function getCompletionRate(): ?string {
        return $this->completionRate;
    }

    public function setCompletionRate(?string $completionRate): self {
        $this->completionRate = $completionRate;
        return $this;
    }
}

