const Koa = require("koa");
const Router = require("@koa/router");

function createApp() {
  const router = new Router();
  const symbols = { playPause: "⏯", play: "⏵", pause: "⏸" };

  router.get("/", (ctx) => {
    ctx.status = 200;
    ctx.set("Content-Type", "text/html; charset=utf-8");
    ctx.body = `\
    <!DOCTYPE html>
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
    <button id="playpause">${symbols.playPause}</button>
    <div id="play-and-pause">
      <button id="play">${symbols.play}</button>
      <button id="pause">${symbols.pause}</button>
    </div>
    </body>
    `;
  });

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
