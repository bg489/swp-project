import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app) {
    app.use('/api/auth', router);
    router.post('/register', authController.register.bind(authController));
    router.post('/login', authController.login.bind(authController));
}