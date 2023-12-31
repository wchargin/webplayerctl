const child_process = require("child_process");
const util = require("util");

const Koa = require("koa");
const Router = require("@koa/router");

function createApp() {
  const router = new Router();

  router.get("/", (ctx) => {
    ctx.status = 200;
    ctx.set("Content-Type", "text/html; charset=utf-8");
    ctx.body = `\
    <!DOCTYPE html>
    <meta name="viewport" content="width=device-width">
    <html lang="en">
    <head>
    <style>
    body {
      display: flex;
      flex-direction: column;
      margin: 0;
    }
    body, html {
      height: 100%;
    }
    #playpause {
      flex-grow: 2;
    }
    button {
      flex-grow: 1;
    }
    #play-and-pause {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
    }
    </style>
    </head>
    <body>
    <button id="playpause">Play/Pause</button>
    <div id="play-and-pause">
      <button id="play">Play</button>
      <button id="pause">Pause</button>
    </div>
    <script>
    async function fire(url) {
    console.log("fire ", url);
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        console.warn(await res.text());
        return;
      }
      const body = await res.text();
      console.log(body);
    }
    playpause.addEventListener("click", () => fire("/api/play-pause"));
    play.addEventListener("click", () => fire("/api/play"));
    pause.addEventListener("click", () => fire("/api/pause"));
    </script>
    </body>
    `;
  });

  const execFileAsync = util.promisify(child_process.execFile);
  async function playerctl(args) {
    const timeout = 1000;
    const result = await execFileAsync("playerctl", args, { timeout });
    return result;
  }
  function handleApi(cmd) {
    return async function (ctx) {
      let playerStatus;
      try {
        await playerctl([cmd]);
        playerStatus = await playerctl(["status"]).then((io) =>
          io.stdout.trim()
        );
      } catch (e) {
        console.warn("playerctl", e);
        ctx.status = 500;
        ctx.body = JSON.stringify({ error: "Error running playerctl" });
        return;
      }
      ctx.status = 200;
      ctx.body = JSON.stringify({ cmd, playerStatus });
    };
  }
  router.post("/api/play-pause", handleApi("play-pause"));
  router.post("/api/play", handleApi("play"));
  router.post("/api/pause", handleApi("pause"));

  const app = new Koa();
  app.use(router.routes()).use(router.allowedMethods());
  return app;
}

function getPort() {
  const raw = process.env.PORT;
  if (raw == null || raw === "") return 3000;
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 0 || num > 65535) {
    throw new Error("invalid port: " + raw);
  }
  return num;
}

function main() {
  const app = createApp();
  const server = app.listen(getPort());
  console.log("listening on port %s", server.address().port);
}

main();
