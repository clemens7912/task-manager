import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import sequelize from './config/database';
import { Roles } from './models/Roles';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import tagsRoutes from './routes/tagsRoutes';
import columnsRoutes from './routes/columnRoutes';
import cardsRoutes from './routes/cardsRoutes';
import cookieSession from 'cookie-session';
import { BoardRoles } from './models/BoardRoles';

// Create Express application
const app: Express = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'task-manager-session',
  secret: process.env.COOKIE_SECRET,
  httpOnly: true,
  maxAge: 7*24*60*60*1000
}));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/cards', cardsRoutes);

/**
 * Hace una precarga de los roles en bbdd
 */
const seedRoles = async () => {
  await Roles.bulkCreate([
    {id: 1, name: 'ADMIN'},
    {id: 2, name: 'USER'}
  ]);
}

const seedBoardRoles = async () => {
  await BoardRoles.bulkCreate([
    {id: 1, name: 'BOARD_OWNER'},
    {id: 2, name: 'BOARD_MEMBER'}
  ]);
}

// Sync database and start server
const startServer = async () => {
  try {
    //await sequelize.sync({ force: true });
    //await sequelize.sync({alter: true});
    await sequelize.sync();

    //Precargamos roles
    //seedRoles();
    //seedBoardRoles();
    console.log('Database connected successfully');
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

startServer();