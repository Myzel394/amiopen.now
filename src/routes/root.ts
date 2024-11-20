import { Hono } from "hono";
import presentation from "../middlewares/presentation";
import realIP from "../middlewares/real-ip";
import render from "../utils/renderer";

export const rootRoute = new Hono();

rootRoute.get("/", realIP, presentation, context => {
	return render(context, "index", {
		ip: context.get("ip"),
	});
});
