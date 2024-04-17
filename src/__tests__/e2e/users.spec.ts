import { expect, test } from "@playwright/test";
import prisma from "./lib/prisma";

test.beforeEach(async ({ page }, testInfo) => {
	await page.route("**/*", async (route) => {
		const headers = route.request().headers();
		headers["X-Test-DB-Schema"] = testInfo.testId;
		await route.continue({ headers });
	});
});

test("has just Jim and Jane", async ({ page }) => {
	await prisma.user.upsert({
		where: { email: "jim@prisma.io" },
		update: {},
		create: {
			email: "jim@prisma.io",
			name: "Jim",
		},
	});
	await prisma.user.upsert({
		where: { email: "jane@prisma.io" },
		update: {},
		create: {
			email: "jane@prisma.io",
			name: "Jane",
		},
	});

	await page.goto("/users");

	await expect(page.getByText("Jim")).toBeVisible();
	await expect(page.getByText("Jane")).toBeVisible();

	const usersList = page.getByRole("listitem");
	await expect(usersList).toHaveCount(2);
});

test("has just Alice and Bob", async ({ page }) => {
	await prisma.user.upsert({
		where: { email: "alice@prisma.io" },
		update: {},
		create: {
			email: "alice@prisma.io",
			name: "Alice",
		},
	});
	await prisma.user.upsert({
		where: { email: "bob@prisma.io" },
		update: {},
		create: {
			email: "bob@prisma.io",
			name: "Bob",
		},
	});

	await page.goto("/users");

	await expect(page.getByText("Alice")).toBeVisible();
	await expect(page.getByText("Bob")).toBeVisible();

	const usersList = page.getByRole("listitem");
	await expect(usersList).toHaveCount(2);
});