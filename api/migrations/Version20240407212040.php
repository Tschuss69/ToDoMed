<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240407212040 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE encounter_task (encounter_id INT NOT NULL, task_id INT NOT NULL, PRIMARY KEY(encounter_id, task_id))');
        $this->addSql('CREATE INDEX IDX_4BF68A40D6E2FADC ON encounter_task (encounter_id)');
        $this->addSql('CREATE INDEX IDX_4BF68A408DB60186 ON encounter_task (task_id)');
        $this->addSql('ALTER TABLE encounter_task ADD CONSTRAINT FK_4BF68A40D6E2FADC FOREIGN KEY (encounter_id) REFERENCES encounter (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE encounter_task ADD CONSTRAINT FK_4BF68A408DB60186 FOREIGN KEY (task_id) REFERENCES task (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE task ADD content VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE task ALTER requester_practitioner_role_id DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE encounter_task DROP CONSTRAINT FK_4BF68A40D6E2FADC');
        $this->addSql('ALTER TABLE encounter_task DROP CONSTRAINT FK_4BF68A408DB60186');
        $this->addSql('DROP TABLE encounter_task');
        $this->addSql('ALTER TABLE task DROP content');
        $this->addSql('ALTER TABLE task ALTER requester_practitioner_role_id SET NOT NULL');
    }
}
