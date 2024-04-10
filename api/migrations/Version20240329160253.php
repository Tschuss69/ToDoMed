<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240329160253 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE codeable_concept_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE codeable_concept_category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE coding_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE encounter_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE patient_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE codeable_concept (id INT NOT NULL, text VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX text_idx ON codeable_concept (text)');
        $this->addSql('CREATE TABLE codeable_concept_coding (codeableconcept_id INT NOT NULL, coding_id INT NOT NULL, PRIMARY KEY(codeableconcept_id, coding_id))');
        $this->addSql('CREATE INDEX IDX_6C9243F12ADDDE4D ON codeable_concept_coding (codeableconcept_id)');
        $this->addSql('CREATE INDEX IDX_6C9243F1C3DD3708 ON codeable_concept_coding (coding_id)');
        $this->addSql('CREATE TABLE codeable_concept_category (id INT NOT NULL, parent_id INT DEFAULT NULL, category VARCHAR(255) NOT NULL, category_hash VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7279E6A25A2318FF ON codeable_concept_category (category_hash)');
        $this->addSql('CREATE INDEX category_idx ON codeable_concept_category (category)');
        $this->addSql('CREATE INDEX parent_idx ON codeable_concept_category (parent_id)');
        $this->addSql('CREATE TABLE cccategory_has_codeableconcept (cccategory_id INT NOT NULL, codeableconcept_id INT NOT NULL, PRIMARY KEY(cccategory_id, codeableconcept_id))');
        $this->addSql('CREATE INDEX IDX_99640A6F9A4062E4 ON cccategory_has_codeableconcept (cccategory_id)');
        $this->addSql('CREATE INDEX IDX_99640A6F2ADDDE4D ON cccategory_has_codeableconcept (codeableconcept_id)');
        $this->addSql('CREATE TABLE coding (id INT NOT NULL, system VARCHAR(255) NOT NULL, version VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, display VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX system_idx ON coding (system)');
        $this->addSql('CREATE INDEX version_idx ON coding (version)');
        $this->addSql('CREATE INDEX code_idx ON coding (code)');
        $this->addSql('CREATE INDEX display_idx ON coding (display)');
        $this->addSql('CREATE TABLE encounter (id INT NOT NULL, subject_id INT NOT NULL, type_id INT NOT NULL, actor_id INT NOT NULL, status VARCHAR(255) NOT NULL, planned_start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_69D229CA23EDC87 ON encounter (subject_id)');
        $this->addSql('CREATE INDEX IDX_69D229CAC54C8C93 ON encounter (type_id)');
        $this->addSql('CREATE INDEX IDX_69D229CA10DAF24A ON encounter (actor_id)');
        $this->addSql('CREATE TABLE patient (id INT NOT NULL, email VARCHAR(50) NOT NULL, phone VARCHAR(50) NOT NULL, gender VARCHAR(64) DEFAULT NULL, birth_date DATE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE patient_has_name (patient_id INT NOT NULL, name_id INT NOT NULL, PRIMARY KEY(patient_id, name_id))');
        $this->addSql('CREATE INDEX IDX_34FAFDFC6B899279 ON patient_has_name (patient_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_34FAFDFC71179CD6 ON patient_has_name (name_id)');
        $this->addSql('CREATE TABLE patient_practitioner_role (patient_id INT NOT NULL, practitioner_role_id INT NOT NULL, PRIMARY KEY(patient_id, practitioner_role_id))');
        $this->addSql('CREATE INDEX IDX_AC4B30856B899279 ON patient_practitioner_role (patient_id)');
        $this->addSql('CREATE INDEX IDX_AC4B3085D7A3222B ON patient_practitioner_role (practitioner_role_id)');
        $this->addSql('ALTER TABLE codeable_concept_coding ADD CONSTRAINT FK_6C9243F12ADDDE4D FOREIGN KEY (codeableconcept_id) REFERENCES codeable_concept (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE codeable_concept_coding ADD CONSTRAINT FK_6C9243F1C3DD3708 FOREIGN KEY (coding_id) REFERENCES coding (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE codeable_concept_category ADD CONSTRAINT FK_7279E6A2727ACA70 FOREIGN KEY (parent_id) REFERENCES codeable_concept_category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE cccategory_has_codeableconcept ADD CONSTRAINT FK_99640A6F9A4062E4 FOREIGN KEY (cccategory_id) REFERENCES codeable_concept_category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE cccategory_has_codeableconcept ADD CONSTRAINT FK_99640A6F2ADDDE4D FOREIGN KEY (codeableconcept_id) REFERENCES codeable_concept (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE encounter ADD CONSTRAINT FK_69D229CA23EDC87 FOREIGN KEY (subject_id) REFERENCES patient (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE encounter ADD CONSTRAINT FK_69D229CAC54C8C93 FOREIGN KEY (type_id) REFERENCES codeable_concept (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE encounter ADD CONSTRAINT FK_69D229CA10DAF24A FOREIGN KEY (actor_id) REFERENCES practitioner_role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE patient_has_name ADD CONSTRAINT FK_34FAFDFC6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE patient_has_name ADD CONSTRAINT FK_34FAFDFC71179CD6 FOREIGN KEY (name_id) REFERENCES human_name (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE patient_practitioner_role ADD CONSTRAINT FK_AC4B30856B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE patient_practitioner_role ADD CONSTRAINT FK_AC4B3085D7A3222B FOREIGN KEY (practitioner_role_id) REFERENCES practitioner_role (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE human_name DROP CONSTRAINT fk_a7bcf791121ea2c');
        $this->addSql('DROP INDEX idx_a7bcf791121ea2c');
        $this->addSql('ALTER TABLE human_name ADD "use" VARCHAR(32) NOT NULL');
        $this->addSql('ALTER TABLE human_name ADD prefix TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE human_name ADD suffix TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE human_name DROP practitioner_id');
        $this->addSql('ALTER TABLE human_name ALTER family SET NOT NULL');
        $this->addSql('ALTER TABLE human_name ALTER family TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE human_name ALTER given TYPE TEXT');
        $this->addSql('ALTER TABLE human_name ALTER given TYPE TEXT');
        $this->addSql('COMMENT ON COLUMN human_name.prefix IS \'(DC2Type:simple_array)\'');
        $this->addSql('COMMENT ON COLUMN human_name.suffix IS \'(DC2Type:simple_array)\'');
        $this->addSql('COMMENT ON COLUMN human_name.given IS \'(DC2Type:simple_array)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE codeable_concept_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE codeable_concept_category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE coding_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE encounter_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE patient_id_seq CASCADE');
        $this->addSql('ALTER TABLE codeable_concept_coding DROP CONSTRAINT FK_6C9243F12ADDDE4D');
        $this->addSql('ALTER TABLE codeable_concept_coding DROP CONSTRAINT FK_6C9243F1C3DD3708');
        $this->addSql('ALTER TABLE codeable_concept_category DROP CONSTRAINT FK_7279E6A2727ACA70');
        $this->addSql('ALTER TABLE cccategory_has_codeableconcept DROP CONSTRAINT FK_99640A6F9A4062E4');
        $this->addSql('ALTER TABLE cccategory_has_codeableconcept DROP CONSTRAINT FK_99640A6F2ADDDE4D');
        $this->addSql('ALTER TABLE encounter DROP CONSTRAINT FK_69D229CA23EDC87');
        $this->addSql('ALTER TABLE encounter DROP CONSTRAINT FK_69D229CAC54C8C93');
        $this->addSql('ALTER TABLE encounter DROP CONSTRAINT FK_69D229CA10DAF24A');
        $this->addSql('ALTER TABLE patient_has_name DROP CONSTRAINT FK_34FAFDFC6B899279');
        $this->addSql('ALTER TABLE patient_has_name DROP CONSTRAINT FK_34FAFDFC71179CD6');
        $this->addSql('ALTER TABLE patient_practitioner_role DROP CONSTRAINT FK_AC4B30856B899279');
        $this->addSql('ALTER TABLE patient_practitioner_role DROP CONSTRAINT FK_AC4B3085D7A3222B');
        $this->addSql('DROP TABLE codeable_concept');
        $this->addSql('DROP TABLE codeable_concept_coding');
        $this->addSql('DROP TABLE codeable_concept_category');
        $this->addSql('DROP TABLE cccategory_has_codeableconcept');
        $this->addSql('DROP TABLE coding');
        $this->addSql('DROP TABLE encounter');
        $this->addSql('DROP TABLE patient');
        $this->addSql('DROP TABLE patient_has_name');
        $this->addSql('DROP TABLE patient_practitioner_role');
        $this->addSql('ALTER TABLE human_name ADD practitioner_id INT NOT NULL');
        $this->addSql('ALTER TABLE human_name DROP "use"');
        $this->addSql('ALTER TABLE human_name DROP prefix');
        $this->addSql('ALTER TABLE human_name DROP suffix');
        $this->addSql('ALTER TABLE human_name ALTER family DROP NOT NULL');
        $this->addSql('ALTER TABLE human_name ALTER family TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE human_name ALTER given TYPE VARCHAR(50)');
        $this->addSql('COMMENT ON COLUMN human_name.given IS NULL');
        $this->addSql('ALTER TABLE human_name ADD CONSTRAINT fk_a7bcf791121ea2c FOREIGN KEY (practitioner_id) REFERENCES practitioner (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_a7bcf791121ea2c ON human_name (practitioner_id)');
    }
}
