<?php

namespace App\EventSubscriber;

use App\Entity\Fhir\Administration\Encounter;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class EncounterSubscriber implements EventSubscriber
{

    private $mailer;
    private $twig;

    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    /**
     * @inheritDoc
     */
    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
        ];
    }
    /**
     * @throws TransportExceptionInterface
     */
    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Encounter) {
            return;
        }

        $emailContent = $this->twig->render('mail_patient.html.twig', [
            'username' => strtoupper($entity->getSubject()->getName()->first()->getFamily()),
            'email' => $entity->getSubject()->getEmail()
        ]);

        $email = (new Email())
            ->from('you@example.com') // Modifiez l'adresse expéditeur
            ->to($entity->getSubject()->getEmail()) // Modifiez le destinataire
            ->subject('Informations sur votre intervention dans votre espace personnel')
            ->html($emailContent);

        $this->mailer->send($email);
    }

}
