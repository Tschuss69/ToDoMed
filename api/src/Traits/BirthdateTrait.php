<?php
namespace App\Traits;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait BirthdateTrait
{

    #[ORM\Column(type: 'date', nullable: true)]
    #[Groups(['admin:read', 'admin:write', 'practitioner:read', 'practitioner:write'])]
    protected ?\DateTime $birthdate;

    public function getBirthdate() : ?\DateTime
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTime $birthdate)
    {
        $this->birthdate = $birthdate;

        return $this;
    }

}

