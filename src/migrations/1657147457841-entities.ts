import { MigrationInterface, QueryRunner } from "typeorm";

export class entities1657147457841 implements MigrationInterface {
    name = 'entities1657147457841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "city" character varying NOT NULL, "description" character varying, "deleted_at" TIMESTAMP, "login" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "creator_id" integer NOT NULL, "text" character varying NOT NULL, "creted_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("id" SERIAL NOT NULL, "subscriber_id" integer NOT NULL, "subscribed_to_id" integer NOT NULL, CONSTRAINT "unique_subscription_constraint" UNIQUE ("subscriber_id", "subscribed_to_id"), CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_db010ad03e6b2a6b20c09934807" FOREIGN KEY ("subscriber_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_3a9a7b8aa3ee476d796ec642ab2" FOREIGN KEY ("subscribed_to_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_3a9a7b8aa3ee476d796ec642ab2"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_db010ad03e6b2a6b20c09934807"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
