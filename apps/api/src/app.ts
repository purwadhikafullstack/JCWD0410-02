import cors from 'cors';
import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import { PORT } from './config';
import { AuthRouter } from './routers/auth.router';
import { TenantTransactionRouter } from './routers/tenant-transaction.router';
import { UserTransactionRouter } from './routers/user-transaction.router';
import { PropertyRouter } from './routers/property.router';
import { SalesReportRouter } from './routers/salesreport.router';
// import { SampleRouter } from './routers/auth.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send(err.message);
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const tenantTransactionRouter = new TenantTransactionRouter();
    const userTransactionRouter = new UserTransactionRouter();
    const propertyRouter = new PropertyRouter();
    const salesReportRouter = new SalesReportRouter

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello! Welcome to EaseCoz API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use(
      '/api/tenanttransactions',
      tenantTransactionRouter.getRouter(),
    );
    this.app.use('/api/usertransactions', userTransactionRouter.getRouter());
    this.app.use('/api/property', propertyRouter.getRouter());
    this.app.use('/api/reportanalysis', salesReportRouter.getRouter());

  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/api`);
    });
  }
}
