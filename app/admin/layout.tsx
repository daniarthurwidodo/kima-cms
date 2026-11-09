import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/features/auth/auth.constants";
import { getCurrentUser } from "@/features/auth/auth.session";

export const instant = false;

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);

  return children;
}
