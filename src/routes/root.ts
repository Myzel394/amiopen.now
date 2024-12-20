import { Hono } from "hono";
import presentation from "../middlewares/presentation";
import realIP from "../middlewares/real-ip";
import render from "../utils/renderer";

export const rootRoute = new Hono();

rootRoute.get("/", realIP, presentation, context => {
	// Move request to correct route
	const { port, ipAddress } = context.req.query();
	if (port) {
		if (ipAddress) {
			return context.redirect(`/${ipAddress}/${port}`);
		} else {
			return context.redirect(`/${port}`);
		}
	}

	// Render index page
	const userAgent = context.req.header("User-Agent");
	return render(context, "index", {
		ip: context.get("ip"),
		userAgent,
	});
});
