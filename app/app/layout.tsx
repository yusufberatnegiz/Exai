import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email ?? null} />
      <div className="flex-1 min-w-0 overflow-auto">{children}</div>
    </div>
  );
}
