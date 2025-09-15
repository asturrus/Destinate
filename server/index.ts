import express from "express";
import { registerRoutes } from "./routes";

// Fallback implementations for missing vite functions
function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function setupVite(app: express.Application, server: any) {
  try {
    // Try to create Vite dev server
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: "client",
      resolve: {
        alias: {
          "@": "/home/runner/workspace/client/src",
          "@assets": "/home/runner/workspace/attached_assets",
        },
      },
    });

    app.use(vite.middlewares);
    console.log("Vite dev server started successfully");
  } catch (error) {
    console.log("Vite dev server failed, serving static files:", error);
    // Fallback: serve static files from client directory
    app.use("/src", express.static("client/src"));
    app.use("/attached_assets", express.static("attached_assets"));
    app.use(express.static("client"));
    
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "client" });
    });
  }
}

function serveStatic(app: express.Application) {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "client/dist" });
  });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Server error:", err);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();