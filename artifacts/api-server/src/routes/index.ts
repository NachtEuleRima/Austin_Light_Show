import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rsvpsRouter from "./rsvps";
import rsvpsMonthlyRouter from "./rsvps-monthly";
import rsvpsFantasyRouter from "./rsvps-fantasy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rsvpsRouter);
router.use(rsvpsMonthlyRouter);
router.use(rsvpsFantasyRouter);

export default router;
