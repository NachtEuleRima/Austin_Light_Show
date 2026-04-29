import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rsvpsRouter from "./rsvps";
import rsvpsMonthlyRouter from "./rsvps-monthly";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rsvpsRouter);
router.use(rsvpsMonthlyRouter);

export default router;
