<?php

namespace App\Entity\Fhir\Foundation\DataTypes;


use ApiPlatform\Metadata\ApiResource;

use App\Entity\Fhir\Administration\Practitioner;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints AS Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * FHIR v4.0.0
 * https://www.hl7.org/fhir/datatypes.html#HumanName
 */
#[ApiResource(
    normalizationContext: ['groups' => ['admin:read','practitioner:read', 'patient:read']],
    denormalizationContext: ['groups' => ['admin:write', 'practitioner:write']],
    mercure: true)]
#[ORM\Entity]
class HumanName extends Element
{

    #[ORM\Column(name: '`use`', type: 'string', length: 32)]
    #[Assert\Choice(['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'])]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $use;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $text;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $family;

    #[ORM\Column(type: 'simple_array', nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $given;

    #[ORM\Column(type: 'simple_array', nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $prefix;

    #[ORM\Column(type: 'simple_array', nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected $suffix;

    #[ORM\ManyToOne(targetEntity: Practitioner::class, inversedBy: 'names')]
    private $practitioner;


    public function getSuffix() : array
    {
        return $this->suffix;
    }

    public function addSuffix(string $suffix) : self
    {
        if (!in_array($suffix, $this->suffix, true)) {
            $this->suffix[] = trim($suffix);
        }

        return $this->buildText();
    }

    public function removeSuffix(string $suffix) : self
    {
        $key = array_search($suffix, $this->suffix, true);

        if ($key !== false) {
            unset($this->suffix[$key]);
        }

        return $this->buildText();
    }

    public function setSuffix(array $suffix) : self
    {
        $this->suffix = [];

        foreach ($suffix as $s) {
            $this->addSuffix($s);
        }

        return $this;
    }

    public function getPrefix() : array
    {
        return $this->prefix;
    }

    public function addPrefix(string $prefix) : self
    {
        if (!in_array($prefix, $this->prefix, true)) {
            $this->prefix[] = trim($prefix);
        }

        return $this->buildText();
    }

    public function removePrefix(string $prefix) : self
    {
        $key = array_search($prefix, $this->prefix, true);

        if ($key !== false) {
            unset($this->prefix[$key]);
        }

        return $this->buildText();
    }

    public function setPrefix(array $prefix) : self
    {
        $this->prefix = [];

        foreach ($prefix as $p) {
            $this->addPrefix($p);
        }

        return $this;
    }

    public function getGiven() : array
    {
        return $this->given;
    }

    public function addGiven(string $given) : self
    {
        if (!in_array($given, $this->given, true)) {
            $this->given[] = trim($given);
        }

        return $this->buildText();
    }

    public function removeGiven(string $given) : self
    {
        $key = array_search($given, $this->given, true);

        if ($key !== false) {
            unset($this->given[$key]);
        }

        return $this->buildText();
    }

    public function setGiven(array $given) : self
    {
        //$this->given = [];

        foreach ($given as $key => $g) {
            if(isset($this->given[$key])){
                $this->given[(int) $key] = trim($g);
            }else{
                $this->addGiven($g);
            }
        }

        return $this;
    }

    public function getFamily() : ?string
    {
        return $this->family;
    }

    public function setFamily(?string $family) : self
    {
        $this->family = trim($family);

        return $this->buildText();
    }

    public function getText() : ?string
    {
        return $this->text;
    }

    public function setText(?string $text) : self
    {
        $this->text = trim($text);

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

    public function buildText() : self
    {
        $text = array();

        if (count($this->prefix) > 0) {
            $text[] = implode(' ', $this->prefix);
        }

        if (count($this->given) > 0) {
            $text[] = implode(' ', $this->given);
        }

        $text[] = $this->family;

        if (count($this->suffix) > 0) {
            $text[] = implode(' ', $this->suffix);
        }

        $this->text = implode(' ', array_filter($text));

        return $this;
    }

    public function __construct()
    {
        parent::__construct();

        $this->given = array();
        $this->prefix = array();
        $this->suffix = array();
    }

    public function setPractitioner(?Practitioner $practitioner): self {
        $this->practitioner = $practitioner;
        return $this;
    }

    public function getPractitioner(): ?Practitioner {
        return $this->practitioner;
    }
}
