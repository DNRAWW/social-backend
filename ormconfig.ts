import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['./src/modules/**/entities/**/*.entity.ts'],
  migrations: ['./src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  logging: 'all',
});

export default dataSource;
