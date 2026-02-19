import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { sendLeadNotification } from "./email";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);

      // Save to DB
      const lead = await storage.createLead(input);

      // Attempt email (DON'T hide failures)
      const emailResult = await sendLeadNotification(input);

      // Respond with both DB + email status so you can see what's failing
      return res.status(201).json({
        lead,
        email: emailResult,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join(".") ?? undefined,
        });
      }

      console.error("Create lead failed:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
