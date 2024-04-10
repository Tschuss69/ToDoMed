<?php
namespace App\Traits;

use App\Entity\Fhir\Foundation\DataTypes\ContactPoint;
use Doctrine\Common\Collections\Collection;

trait TelecomTrait
{
    public function getTelecom() : Collection
    {
        return $this->telecom;
    }
    
    public function addTelecom(ContactPoint $telecom) : self
    {
        if (!$this->telecom->contains($telecom)) {
            $this->telecom->add($telecom);
        }
        
        return $this;
    }
    
    public function removeTelecom(ContactPoint $telecom) : self
    {
        $this->telecom->removeElement($telecom);
        
        return $this;
    }
    
    public function setTelecom(Collection $telecom) : self
    {
        $this->telecom->clear();
        
        foreach ($telecom as $t) {
            $this->addTelecom($t);
        }
        
        return $this;
    }
}

