<?php
namespace App\Traits;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints AS Assert;

trait GenderTrait
{
    #[ORM\Column(type: 'string', length: 64, nullable: true)]
    #[Assert\Choice(['male', 'female', 'other', 'unknown', null])]
    #[Groups(['practitioner:read', 'practitioner:write', 'patient:read'])]
    protected $gender;

    public function getGender() : ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender)
    {
        $this->gender = $gender;

        return $this;
    }
}

