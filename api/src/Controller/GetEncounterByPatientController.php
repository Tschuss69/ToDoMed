<?php

namespace App\Controller;

use App\Repository\Fhir\Administration\EncounterRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class GetEncounterByPatientController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{

    public function __invoke(int $id, EncounterRepository $encounterRepository, SerializerInterface $serializer):Response
    {
        $encounters = $encounterRepository->findByPatientId($id);

        $json = $serializer->serialize($encounters, 'json', ['groups' => ['admin:read','practitioner:read', 'patient:read']]);

        return new Response($json, 200, ['Content-Type' => 'application/json']);
    }


}
