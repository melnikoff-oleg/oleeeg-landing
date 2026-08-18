import { cookies } from "next/headers";
import type { Metadata } from "next";
import { listAllIdeas, listEvents } from "@/lib/ideas/db";
import { ADMIN_COOKIE, isAdmin } from "@/lib/ideas/session";
import { AdminLogin, AdminPanel } from "./admin-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ideas admin",
  robots: { index: false, follow: false },
};

export default async function IdeasAdminPage() {
  const store = await cookies();
  if (!isAdmin(store.get(ADMIN_COOKIE)?.value)) {
    return (
      <main className="px-6">
        <AdminLogin />
      </main>
    );
  }

  const [ideas, events] = await Promise.all([listAllIdeas(), listEvents(150)]);
  return (
    <main>
      <AdminPanel ideas={ideas} events={events} />
    </main>
  );
}
