<?php

namespace App\Entity\Fhir\Foundation\DataTypes;


use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints AS Assert;

/**
 * FHIR v4.0.0
 * https://www.hl7.org/fhir/datatypes.html#ContactPoint
 */
#[ApiResource(mercure: true)]
class ContactPoint extends Element
{

    #[ORM\Column(type: 'string')]
    #[Assert\Choice(['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'])]
    protected $system;

    #[ORM\Column(type: 'string')]
    protected $value;

    #[ORM\Column(name: '`use`', type: 'string', length: 32)]
    #[Assert\Choice(['home', 'work', 'temp', 'old', 'mobile'])]
    protected $use;

    #[ORM\Column(type: 'integer')]
    #[Assert\GreaterThan(value: 0)]
    protected $rank;

    public function getRank() : ?int
    {
        return $this->rank;
    }

    public function setRank(int $rank = 1) : self
    {
        // TODO : We should manage the ContactPoints with greater or equal rank for the same entity (org, person...)
        $this->rank = $rank;

        return $this;
    }

    public function getUse() : ?string
    {
        return $this->use;
    }

    public function setUse(?string $use) : self
    {
        $this->use = $use;

        return $this;
    }

    public function getValue() : ?string
    {
        return $this->value;
    }

    public function setValue(?string $value) : self
    {
        $this->value = $value;

        return $this;
    }

    public function getSystem() : ?string
    {
        return $this->system;
    }

    public function setSystem(?string $system) : self
    {
        $this->system = $system;

        return $this;
    }

    public function __construct()
    {
        parent::__construct();
    }
}
