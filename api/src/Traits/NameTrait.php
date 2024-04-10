<?php
namespace App\Traits;

use Doctrine\Common\Collections\Collection;
use App\Entity\Fhir\Foundation\DataTypes\HumanName;

trait NameTrait
{
    public function getName() : Collection
    {
        return $this->name;
    }
    
    public function addName(HumanName $name)
    {
        if (!$this->name->contains($name)) {
            $this->name->add($name);
        }
        
        return $this;
    }
    
    public function removeName(HumanName $name)
    {
        $this->name->removeElement($name);
        
        return $this;
    }
    
    public function setName(Collection $name)
    {
        $this->name->clear();
        
        foreach ($name as $n) {
            $this->addName($n);
        }
        
        return $this;
    }
}

