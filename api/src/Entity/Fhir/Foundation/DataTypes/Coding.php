<?php

namespace App\Entity\Fhir\Foundation\DataTypes;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints AS Assert;
use Symfony\Component\Uid\Uuid;

/**
 * FHIR v4.0.0
 * https://www.hl7.org/fhir/datatypes.html#Coding
 */
#[ApiResource(mercure :true, operations: [new Get(), new Put(), new GetCollection(), new Post()])]
#[ApiFilter(filterClass: SearchFilter::class, properties: ['id' => 'exact', 'system' => 'ipartial', 'version' => 'ipartial', 'code' => 'ipartial', 'display' => 'ipartial'])]
#[ApiFilter(filterClass: OrderFilter::class, properties: ['id', 'system', 'version', 'code', 'display'])]
#[ORM\Table(name: 'coding')]
#[ORM\Index(name: 'system_idx', columns: ['system'])]
#[ORM\Index(name: 'version_idx', columns: ['version'])]
#[ORM\Index(name: 'code_idx', columns: ['code'])]
#[ORM\Index(name: 'display_idx', columns: ['display'])]
#[ORM\Entity(repositoryClass: 'App\Repository\Fhir\Foundation\DataTypes\CodingRepository')]
class Coding extends Element
{
    const SITE_CODING_SYSTEM     = 'http://www.imedz.fr';
    const SITE_CODING_VERSION    = '1.0.0';

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\Regex(pattern: '/^[\S]*$/')]
    protected $system;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\Regex(pattern: '/^[ \r\n\t\S]+$/')]
    protected $version;

    #[ORM\Column(type: 'string')]
    #[Assert\Regex(pattern: '/^[^\s]+(\s[^\s]+)*$/')]
    protected $code;

    #[ORM\Column(type: 'string')]
    protected $display;


    public function getDisplay() : ?string
    {
        return $this->display;
    }

    public function setDisplay(?string $display) : self
    {
        $this->display = $display;

        return $this;
    }

    public function getCode() : ?string
    {
        return $this->code;
    }

    public function setCode(?string $code) : self
    {
        if ($code != null) {
            $this->code = $code;
        } else {
            // TODO: Check that it is really OK to force a Pacedef code if code is empty
            $this->code = Uuid::v4();

            $this->setSystem(self::SITE_CODING_SYSTEM)
                ->setVersion(self::SITE_CODING_VERSION);
        }

        return $this;
    }

    public function getVersion() : ?string
    {
        return $this->version;
    }

    public function setVersion(?string $version) : self
    {
        $this->version = ($version != null) ? $version : self::SITE_CODING_VERSION;

        return $this;
    }

    public function getSystem() : ?string
    {
        return $this->system;
    }

    public function setSystem(?string $system) : self
    {
        $this->system = ($system != null) ? $system : self::SITE_CODING_SYSTEM;

        $this->setVersion(self::SITE_CODING_VERSION);

        return $this;
    }

    public function __construct()
    {
        parent::__construct();
    }

}
