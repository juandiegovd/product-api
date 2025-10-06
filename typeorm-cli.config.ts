import dbConfig from './src/config/db.config';
import { DataSource } from 'typeorm';

console.log('Using DB config:', dbConfig());

export const AppDataSource = new DataSource(dbConfig());
