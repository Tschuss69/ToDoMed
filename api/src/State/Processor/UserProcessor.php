<?php

declare(strict_types=1);

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Fhir\Administration\User;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * @implements ProcessorInterface<User>
 */
class UserProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private UserPasswordHasherInterface $passwordHasher
    ) {

    }


    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        if($operation instanceof Post || $operation instanceof Put) {
            $data->setPassword($this->passwordHasher->hashPassword($data, $data->getPassword()));
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
