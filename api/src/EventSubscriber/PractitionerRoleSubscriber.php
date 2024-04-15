<?php

namespace App\EventSubscriber;

use App\Entity\Fhir\Administration\Patient;
use App\Entity\Fhir\Administration\Practitioner;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class PractitionerRoleSubscriber
{
    public function getSubscribedEvents()
    {
        return [
            Events::prePersist,
        ];
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        // Vérifier si l'entité est un Patient
        if ($entity instanceof Practitioner) {
            $roles = $entity->getRoles(); // Appel direct grâce à l'héritage

            // Vérifier si le rôle ROLE_PATIENT n'est pas déjà attribué
            if (!in_array('ROLE_PRACTITIONER', $roles)) {
                $roles[] = 'ROLE_PRACTITIONER';  // Ajouter le rôle si ce n'est pas le cas
                $entity->setRoles($roles); // Applique les nouveaux rôles
            }
        }
    }
}
