import express from "express";
import type { Application, Request, Response } from "express";
import { env } from "./config/env.config";
import userRoutes from "./routes/user.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Task Master Pro API",
    version: env.apiVersion,
    environment: env.nodeEnv,
    status: "running",
    endpoints: {
      health: "/health",
      users: `/api/${env.apiVersion}/users`,
    },
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.nodeEnv,
  });
});

app.use(`/api/${env.apiVersion}/users`, userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: false,
    path: req.path,
  });
});

app.listen(env.port, () => {
  console.log(`  
    Task Master Pro API Server                      
    Environment: ${env.nodeEnv.padEnd(30)}          
    Port: ${env.port.toString().padEnd(42)}         
    API Version: ${env.apiVersion.padEnd(35)}       
    URL: http://localhost:${env.port}               
  `);
});
