import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";

import authMiddleware from '../middlewares/auth.middleware.js'

const initRoutes = () => {
    const router = Router();

    // Register route modules
    router.use("/auth", authRoutes);
    router.use(authMiddleware);
    router.get('/me', (req, res, next) => { return res.status(200).json({data: req.decoded})});
    return router;
};

export default initRoutes;
