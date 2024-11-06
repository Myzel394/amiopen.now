import { Hono } from "hono";
import { portRoute } from "./routes/port";
import { timeout } from "hono/timeout";

const app = new Hono();

app.use(timeout(90_000));
app.route("/", portRoute);

export default app;
