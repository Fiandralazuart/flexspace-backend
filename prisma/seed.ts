import { PrismaClient, Prisma } from "../generated/prisma";
import bcrypt from "bcrypt";
import provinces from "./generated/provinces.json";
import regencies from "./generated/regencies.json";
import districts from "./generated/districts.json";
import villagesData from "./generated/villages.json";

const villages = villagesData as unknown as Prisma.VillageCreateManyInput[];
const prisma = new PrismaClient();

async function main() {
	console.log("Seed started");

	await prisma.province.createMany({
		data: provinces,
		skipDuplicates: true,
	});

	await prisma.regency.createMany({
		data: regencies,
		skipDuplicates: true,
	});

	await prisma.district.createMany({
		data: districts,
		skipDuplicates: true,
	});

	await prisma.village.createMany({
		data: villages,
		skipDuplicates: true,
	});

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

	console.log("Role inserted");

	const count = await prisma.role.count();
	console.log("Role count:", count);

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
