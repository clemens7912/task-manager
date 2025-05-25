import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import sequelize from './config/database';
import { Roles } from './models/Roles';

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

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

/**
 * Hace una precarga de los roles en bbdd
 */
const seedRoles = async () => {
  await Roles.bulkCreate([
    {name: 'ADMIN'},
    {name: 'BOARD_OWNER'},
    {name: 'BOARD_MEMBER'}
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
    console.log('Database connected successfully');
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

startServer();