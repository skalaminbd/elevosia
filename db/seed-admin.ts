/**
 * Creates the first staff user. Fill ADMIN_EMAIL and ADMIN_PASSWORD in
 * .env.local, then run npm run db:seed-admin.
 */

import { eq } from "drizzle-orm";
import { db } from "./index";
import { user } from "./auth-schema";
import { auth } from "../lib/auth";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Elevosia Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.");
  process.exit(1);
}

async function main() {
  const [existing] = await db
    .select()
    .from(user)
    .where(eq(user.email, email as string));

  if (existing) {
    await db
      .update(user)
      .set({ role: "admin", emailVerified: true })
      .where(eq(user.id, existing.id));
    console.log(`${email} already exists; role set to admin.`);
    return;
  }

  await auth.api.signUpEmail({
    body: { name, email: email as string, password: password as string },
  });
  await db
    .update(user)
    .set({ role: "admin", emailVerified: true })
    .where(eq(user.email, email as string));
  console.log(`Admin created: ${email}`);
}

const clientEmail = process.env.CLIENT_EMAIL;
const clientPassword = process.env.CLIENT_PASSWORD;

async function seedClientUser() {
  if (!clientEmail || !clientPassword) return;
  const [existing] = await db
    .select()
    .from(user)
    .where(eq(user.email, clientEmail));
  if (existing) {
    await db
      .update(user)
      .set({ role: "client", clientId: "brightline", emailVerified: true })
      .where(eq(user.id, existing.id));
    console.log(`${clientEmail} already exists; linked to Brightline.`);
    return;
  }
  await auth.api.signUpEmail({
    body: {
      name: "Brightline Owner",
      email: clientEmail,
      password: clientPassword,
    },
  });
  await db
    .update(user)
    .set({ role: "client", clientId: "brightline", emailVerified: true })
    .where(eq(user.email, clientEmail));
  console.log(`Client user created: ${clientEmail} (Brightline)`);
}

async function run() {
  await main();
  await seedClientUser();
}

run().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
