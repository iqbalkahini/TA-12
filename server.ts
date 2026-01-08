import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url!, true);

    if (pathname === "/_next/webpack-hmr") {
      // Allow Next.js HMR to handle the upgrade
      const upgradeHandler = (app as any).getUpgradeHandler();
      upgradeHandler(request, socket, head);
    } else {
      socket.destroy();
    }
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
