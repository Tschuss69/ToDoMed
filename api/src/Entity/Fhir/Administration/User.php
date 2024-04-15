<?php

namespace App\Entity\Fhir\Administration;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;


#[ApiResource(
    operations: [
        new Get(),
        new Post(),
    ],
    normalizationContext: ['groups' => ['admin:read', 'practitioner:read', 'patient:read']],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']]
)]
#[ORM\Entity]
#[ORM\Table(name: "`user`")]
#[ORM\InheritanceType('JOINED')]
#[ORM\DiscriminatorColumn(name: 'discr', type: 'string')]
#[ORM\DiscriminatorMap(['patient' => Patient::class, 'practitioner' => Practitioner::class])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    #[Groups(['admin:read', 'practitioner:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['read', 'admin:write', 'practitioner:write', 'admin:read', 'practitioner:read'])]
    protected ?string $email = null;

    #[ORM\Column]
    #[Groups(['admin:write', 'practitioner:write', 'admin:read', 'practitioner:read'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['patient:write', 'practitioner:write'])]
    private ?string $password = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isPractitioner(): bool
    {
        return false;
    }

    public function isPatient(): bool
    {
        return false;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

}
