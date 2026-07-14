import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	await prisma.role.createMany({
  data: [
    {
      id: 1,
      name: "SUPER_ADMIN",
      description: "System Super Administrator",
    },
    {
      id: 2,
      name: "ADMIN",
      description: "Building Administrator",
    },
    {
      id: 3,
      name: "STAFF",
      description: "Operational Staff",
    },
    {
      id: 4,
      name: "USER",
      description: "End User",
    },
  ],
  skipDuplicates: true,
});

const superAdmin = await prisma.role.findUnique({
  where: {
    name: "SUPER_ADMIN",
  },
});

	await prisma.user.upsert({
		where: {
			email: "v3346589@gmail.com",
		},
		update: {},
		create: {
			name: "Super Admin",
			email: "v3346589@gmail.com",
			password: await bcrypt.hash("Udinkicau12!", 10),
			roleId: superAdmin!.id,
			emailVerified: true,
			isActive: true,
		},
	});
}

main();
