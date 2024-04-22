<?php

namespace App\Controller\Fhir\Administration;

use App\Entity\Fhir\Administration\Patient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\SerializerInterface;


class GetCurrentPatientController extends AbstractController
{

    public function __invoke(UserInterface $user, SerializerInterface $serializer): Response
    {
        if (!$user instanceof Patient) {
            return new Response('Not a patient', Response::HTTP_FORBIDDEN);
        }

        $data = $serializer->serialize($user, 'json', ['groups' => ['patient:read']]);
        return new Response($data, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }
}
