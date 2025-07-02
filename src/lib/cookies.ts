import { cookies } from "next/headers";

export async function setFlashMessage(message: string) {
  (await cookies()).set("flash", message, { path: "/", maxAge: 10 });
}

export async function getFlashMessage() {
  const cookieStore = cookies();
  const message = (await cookieStore).get("flash")?.value;
  if (message) (await cookies()).delete("flash");
  return message;
}
