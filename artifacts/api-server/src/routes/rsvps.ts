import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, rsvpsTable } from "@workspace/db";
import { CreateRsvpBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/rsvps", async (req, res): Promise<void> => {
  const rsvps = await db.select().from(rsvpsTable).orderBy(rsvpsTable.createdAt);
  const [{ value: total }] = await db.select({ value: count() }).from(rsvpsTable);
  req.log.info({ total }, "Listed RSVPs");
  res.json({ total: Number(total), rsvps });
});

router.post("/rsvps", async (req, res): Promise<void> => {
  const parsed = CreateRsvpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(rsvpsTable)
    .where(eq(rsvpsTable.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This email has already been registered for the event." });
    return;
  }

  const [rsvp] = await db
    .insert(rsvpsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      guests: parsed.data.guests,
      phone: parsed.data.phone ?? null,
      robot: parsed.data.robot,
      message: parsed.data.message ?? null,
    })
    .returning();

  req.log.info({ rsvpId: rsvp.id }, "RSVP created");
  res.status(201).json(rsvp);
});

export default router;
