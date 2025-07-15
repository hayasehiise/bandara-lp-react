import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/bcrypt";

const prisma = new PrismaClient();

async function main() {
  // const hashed = await hashPassword("admin123");
  // await prisma.user.create({
  //   data: {
  //     email: "herytkd@gmail.com",
  //     username: "admintest",
  //     name: "hery",
  //     password: hashed,
  //   },
  // });

  await prisma.user.createMany({
    data: [
      {
        email: "herytkd01@gmail.com",
        username: "admin1",
        name: "admin1",
        password: await hashPassword("admin1"),
      },
      {
        email: "herytkd02@gmail.com",
        username: "admin2",
        name: "admin2",
        password: await hashPassword("admin2"),
      },
    ],
  });
}

main();
