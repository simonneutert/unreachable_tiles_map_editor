import { Handlebars } from "jsr:@danet/handlebars";
import { Application, Router } from "jsr:@oak/oak@14";

const unreachableTilesData = [];
for await (const dirEntry of Deno.readDir("./data/")) {
  const content = await Deno.readTextFile(`./data/${dirEntry.name}`);
  unreachableTilesData.push(JSON.parse(content));
}

const app = new Application();
const router = new Router();

// initialize handlebars
app.use(async function (ctx, next) {
  ctx.state.handlebars = new Handlebars();
  await next();
});

router.get("/", async function (ctx) {
  ctx.response.body = await ctx.state.handlebars.renderView("index", {
    lang: "en",
  });
});

router.post("/accept-cookies", async function (ctx) {
  ctx.cookies.set("utme_cookie_consent", "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1,
  });
  ctx.response.redirect("/map");
});

router.get("/map", async function (ctx) {
  const cookie = await ctx.cookies.get("utme_cookie_consent");
  if (!cookie) {
    ctx.response.redirect("/");
    return;
  } else {
    ctx.response.body = await ctx.state.handlebars.renderView("map", {
      mapboxApiSecret: Deno.env.get("MAPBOX_API_SECRET"),
    });
  }
});

router.get("/tiles", function (ctx) {
  ctx.response.body = unreachableTilesData;
});

app.use(router.routes());

// enable serving static content
// this has to be configured after the router, else the root route will be overridden
app.use(async (context, next) => {
  const root = `${Deno.cwd()}/static`;
  try {
    await context.send({ root });
  } catch {
    await next();
  }
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
