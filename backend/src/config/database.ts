import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Roles } from '../models/Roles';

const sequelize = new Sequelize({
  database: process.env.MYSQL_DB,
  dialect: 'mysql',
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  port: 3306,
  models: [User, Roles], // Add all your models here
});

export default sequelize;