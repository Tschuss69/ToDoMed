<?php

namespace App\Serializer;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class UserContextBuilder implements SerializerContextBuilderInterface
{

    private SerializerContextBuilderInterface $decorated;
    private AuthorizationCheckerInterface $authorizationChecker;

    public function __construct(
        SerializerContextBuilderInterface $decorated,
        AuthorizationCheckerInterface $authorizationChecker
    ) {
        $this->decorated = $decorated;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function createFromRequest(Request $request, bool $normalization, array $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);

        if ($this->authorizationChecker->isGranted('ROLE_USER')) {
            $context['groups'][] = ($normalization) ? 'read' : 'write';
        }

        if ($this->authorizationChecker->isGranted('ROLE_PATIENT')) {
            $context['groups'][] = ($normalization) ? 'patient:read' : 'patient:write';
        }

        if ($this->authorizationChecker->isGranted('ROLE_PRACTITIONER')) {
            $context['groups'][] = ($normalization) ? 'practitioner:read' : 'practitioner:write';
        }

        if ($this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            $context['groups'][] = ($normalization) ? 'admin:read' : 'admin:write';
        }

        if ($this->authorizationChecker->isGranted('ROLE_SUPER_ADMIN')) {
            $context['groups'][] = ($normalization) ? 'superadmin:read' : 'superadmin:write';
        }

        return $context;
    }

}
