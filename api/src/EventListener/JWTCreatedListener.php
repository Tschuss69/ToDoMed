<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $payload = $event->getData();

        // Ajoutez l'ID de l'utilisateur au payload du token
        $payload['user_id'] = $user->getId();


        $event->setData($payload);
    }
}
