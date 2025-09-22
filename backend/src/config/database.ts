import { CardsTags } from './../models/CardsTags';
import { Tags } from './../models/Tags';
import { UserCards } from './../models/UserCards';
import { Cards } from './../models/Cards';
import { Columns } from './../models/Columns';
import { BoardRoles } from './../models/BoardRoles';
import { BoardUser } from './../models/BoardUser';
import { Board } from './../models/Board';
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
  models: [User, Roles, Board, BoardUser, BoardRoles, Columns,
    Cards, UserCards, Tags, CardsTags
  ], // Add all your models here
});

export default sequelize;