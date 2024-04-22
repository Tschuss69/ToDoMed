<?php

namespace App\Security\Voter;

use App\Entity\Fhir\Administration\Patient;
use App\Entity\Fhir\Administration\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;


class PatientVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        return $attribute === 'VIEW' && $subject instanceof Patient;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if ($user === null) {
            // Log pour le debug
            error_log('Token does not contain a user.');
        }


        // Vérifiez si l'utilisateur est connecté et est une instance de User
        if (!$user instanceof User) {
            return false;
        }

        // Les practitionners ont accès à tous les patients
        if ($user->hasRole('ROLE_PRACTITIONER')) {
            return true;
        }

        // Les patients ont seulement accès à leur propre profil
        if ($user->hasRole('ROLE_PATIENT')) {
            return $subject->getId() === $user->getId();
        }

        return false;
    }
}
