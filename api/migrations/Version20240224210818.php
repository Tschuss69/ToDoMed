<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240224210818 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE greeting_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE human_name_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE practitioner_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE practitioner_role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE task_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE human_name (id INT NOT NULL, practitioner_id INT NOT NULL, text VARCHAR(255) DEFAULT NULL, family VARCHAR(50) DEFAULT NULL, given VARCHAR(50) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A7BCF791121EA2C ON human_name (practitioner_id)');
        $this->addSql('CREATE TABLE practitioner (id INT NOT NULL, gender VARCHAR(50) NOT NULL, birth_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE practitioner_role (id INT NOT NULL, practitioner_id INT NOT NULL, code_code VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_47EAED151121EA2C ON practitioner_role (practitioner_id)');
        $this->addSql('CREATE TABLE task (id INT NOT NULL, requester_practitioner_role_id INT NOT NULL, status VARCHAR(50) NOT NULL, priority VARCHAR(50) NOT NULL, description VARCHAR(255) NOT NULL, authored_on TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_modified TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_527EDB2537D97E91 ON task (requester_practitioner_role_id)');
        $this->addSql('CREATE TABLE task_requested_performer (task_id INT NOT NULL, practitioner_role_id INT NOT NULL, PRIMARY KEY(task_id, practitioner_role_id))');
        $this->addSql('CREATE INDEX IDX_8A973CD38DB60186 ON task_requested_performer (task_id)');
        $this->addSql('CREATE INDEX IDX_8A973CD3D7A3222B ON task_requested_performer (practitioner_role_id)');
        $this->addSql('ALTER TABLE human_name ADD CONSTRAINT FK_A7BCF791121EA2C FOREIGN KEY (practitioner_id) REFERENCES practitioner (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE practitioner_role ADD CONSTRAINT FK_47EAED151121EA2C FOREIGN KEY (practitioner_id) REFERENCES practitioner (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB2537D97E91 FOREIGN KEY (requester_practitioner_role_id) REFERENCES practitioner_role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE task_requested_performer ADD CONSTRAINT FK_8A973CD38DB60186 FOREIGN KEY (task_id) REFERENCES task (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE task_requested_performer ADD CONSTRAINT FK_8A973CD3D7A3222B FOREIGN KEY (practitioner_role_id) REFERENCES practitioner_role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP TABLE greeting');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE human_name_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE practitioner_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE practitioner_role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE task_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE greeting_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE greeting (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE human_name DROP CONSTRAINT FK_A7BCF791121EA2C');
        $this->addSql('ALTER TABLE practitioner_role DROP CONSTRAINT FK_47EAED151121EA2C');
        $this->addSql('ALTER TABLE task DROP CONSTRAINT FK_527EDB2537D97E91');
        $this->addSql('ALTER TABLE task_requested_performer DROP CONSTRAINT FK_8A973CD38DB60186');
        $this->addSql('ALTER TABLE task_requested_performer DROP CONSTRAINT FK_8A973CD3D7A3222B');
        $this->addSql('DROP TABLE human_name');
        $this->addSql('DROP TABLE practitioner');
        $this->addSql('DROP TABLE practitioner_role');
        $this->addSql('DROP TABLE task');
        $this->addSql('DROP TABLE task_requested_performer');
    }
}
