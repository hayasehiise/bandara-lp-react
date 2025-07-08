import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashed = await hashPassword("admin123");
  await prisma.user.create({
    data: {
      email: "herytkd@gmail.com",
      username: "admintest",
      name: "hery",
      password: hashed,
    },
  });
}

main();
