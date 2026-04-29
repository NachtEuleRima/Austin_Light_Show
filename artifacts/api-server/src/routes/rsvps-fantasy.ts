import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, rsvpsFantasyTable } from "@workspace/db";
import { CreateRsvpBody } from "@workspace/api-zod";

const ADMIN_PASSWORD = "cyberowlcanaccess";

const router: IRouter = Router();

router.get("/fantasy", async (req, res): Promise<void> => {
  const rsvps = await db.select().from(rsvpsFantasyTable).orderBy(rsvpsFantasyTable.createdAt);
  const [{ value: total }] = await db.select({ value: count() }).from(rsvpsFantasyTable);
  req.log.info({ total }, "Listed fantasy RSVPs");
  res.json({ total: Number(total), rsvps });
});

router.post("/fantasy", async (req, res): Promise<void> => {
  const parsed = CreateRsvpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(rsvpsFantasyTable)
    .where(eq(rsvpsFantasyTable.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This email has already been registered for the event." });
    return;
  }

  const [rsvp] = await db
    .insert(rsvpsFantasyTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      guests: 1,
      phone: parsed.data.phone ?? null,
      robot: parsed.data.robot,
      message: parsed.data.message ?? null,
    })
    .returning();

  req.log.info({ rsvpId: rsvp.id }, "Fantasy RSVP created");
  res.status(201).json(rsvp);
});

router.delete("/fantasy/all", async (req, res): Promise<void> => {
  if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await db.delete(rsvpsFantasyTable);
  req.log.info("All fantasy RSVPs cleared by admin");
  res.json({ success: true });
});

export default router;
