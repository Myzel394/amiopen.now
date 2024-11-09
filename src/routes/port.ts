import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import connectToAddress from "../utils/connect-to-address";
import { z } from "zod";
import * as IP from "ip";

export const portRoute = new Hono();

const ipSchema = z
	.string()
	.refine(ip => IP.isPublic(ip), "Only public IP addresses are allowed");

const schema = z.object({
	ip: z
		.string()
		.refine(
			ip => IP.isV4Format(ip) || IP.isV6Format(ip),
			"This is an invalid IP address",
		),
	port: z
		.string()
		.transform(Number)
		.pipe(
			z
				.number()
				.min(1)
				.max(2 ** 16 - 1),
		),
	timeout: z
		.string()
		.optional()
		.transform(val => (!val ? 5_000 : Number(val)))
		.pipe(z.number().min(100).max(60_000)),
});

portRoute.get("/:port", async context => {
	const info = getConnInfo(context);
	const rawData = {
		ip: info.remote.address || "",
		port: context.req.param("port"),
		timeout: context.req.query("timeout") || context.req.query("t") || "",
	};
	console.log(info.remote.address);
	console.log(context.req.header());
	const parsedData = schema.safeParse(rawData);

	if (!parsedData.success) {
		return context.json(
			{
				error: parsedData.error,
			},
			401,
		);
	}

	const { ip, port, timeout } = parsedData.data;

	const result = await connectToAddress(ip, port, { timeout });

	return context.json({
		isOpen: result.isOpen,
	});
});

portRoute.get("/:ip/:port", async context => {
	const rawData = {
		ip: context.req.param("ip"),
		port: context.req.param("port"),
		timeout: context.req.query("timeout") || context.req.query("t") || "",
	};
	const parsedData = schema.safeParse(rawData);

	if (!parsedData.success) {
		return context.json(
			{
				error: parsedData.error,
			},
			401,
		);
	}

	const error = ipSchema.safeParse(parsedData.data.ip);

	if (!error.success) {
		return context.json(
			{
				error: error.error,
			},
			401,
		);
	}

	const { ip, port, timeout } = parsedData.data;

	const result = await connectToAddress(ip, port, { timeout });

	return context.json({
		isOpen: result.isOpen,
	});
});
