<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240413151218 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE human_name ADD practitioner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE human_name ADD CONSTRAINT FK_A7BCF791121EA2C FOREIGN KEY (practitioner_id) REFERENCES practitioner (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_A7BCF791121EA2C ON human_name (practitioner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE human_name DROP CONSTRAINT FK_A7BCF791121EA2C');
        $this->addSql('DROP INDEX IDX_A7BCF791121EA2C');
        $this->addSql('ALTER TABLE human_name DROP practitioner_id');
    }
}
