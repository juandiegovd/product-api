import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1759454811840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'content',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'contentId',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'sku',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'brand',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'model',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'stock',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content');
  }
}
