<?php

namespace App\Entity\Fhir\Foundation\DataTypes;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * FHIR v4.0.0
 * https://www.hl7.org/fhir/element.html
 *
 * TODO: Some fields defined in FHIR are missing in this implementation.
 */
#[ORM\MappedSuperclass]
abstract class Element
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer', options: ['unsigned' => true])]
    protected $id;

    public function getId() : int
    {
        return $this->id;
    }

    public function __construct()
    {}
}

