import { cookies } from "next/headers";

export const ADMIN_COOKIE = "wedding_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token === process.env.ADMIN_SESSION_SECRET;
}
