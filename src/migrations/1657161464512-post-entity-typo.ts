import { MigrationInterface, QueryRunner } from "typeorm";

export class postEntityTypo1657161464512 implements MigrationInterface {
    name = 'postEntityTypo1657161464512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "creted_at" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "created_at" TO "creted_at"`);
    }

}
