import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, rsvpsMonthlyTable } from "@workspace/db";
import { CreateRsvpBody } from "@workspace/api-zod";

const ADMIN_PASSWORD = "cyberowlcanaccess";

const router: IRouter = Router();

router.get("/rsvps-monthly", async (req, res): Promise<void> => {
  const rsvps = await db.select().from(rsvpsMonthlyTable).orderBy(rsvpsMonthlyTable.createdAt);
  const [{ value: total }] = await db.select({ value: count() }).from(rsvpsMonthlyTable);
  req.log.info({ total }, "Listed monthly RSVPs");
  res.json({ total: Number(total), rsvps });
});

router.post("/rsvps-monthly", async (req, res): Promise<void> => {
  const parsed = CreateRsvpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(rsvpsMonthlyTable)
    .where(eq(rsvpsMonthlyTable.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This email has already been registered for the event." });
    return;
  }

  const [rsvp] = await db
    .insert(rsvpsMonthlyTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      guests: 1,
      phone: parsed.data.phone ?? null,
      robot: parsed.data.robot,
      message: parsed.data.message ?? null,
    })
    .returning();

  req.log.info({ rsvpId: rsvp.id }, "Monthly RSVP created");
  res.status(201).json(rsvp);
});

router.delete("/rsvps-monthly/all", async (req, res): Promise<void> => {
  if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await db.delete(rsvpsMonthlyTable);
  req.log.info("All monthly RSVPs cleared by admin");
  res.json({ success: true });
});

export default router;
