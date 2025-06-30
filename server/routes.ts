import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { consultationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook consultation endpoint
  app.post("/api/consultation", async (req, res) => {
    try {
      // Validate request body
      const validationResult = consultationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Datos de entrada inválidos",
          errors: validationResult.error.issues
        });
      }

      const { month, year } = validationResult.data;

      // Store the request
      const webhookRequest = await storage.createWebhookRequest({
        month,
        year
      });

      // Get webhook URL from environment variables
      const webhookUrl = process.env.N8N_WEBHOOK_URL || process.env.WEBHOOK_URL;
      
      if (!webhookUrl) {
        return res.status(500).json({
          message: "Webhook URL no configurada. Configure N8N_WEBHOOK_URL en las variables de entorno."
        });
      }

      // Prepare webhook payload
      const webhookPayload = {
        mes: month,
        año: year,
        timestamp: new Date().toISOString(),
        requestId: webhookRequest.id
      };

      try {
        // Send data to n8n webhook
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook respondió con estado ${webhookResponse.status}: ${webhookResponse.statusText}`);
        }

        // Update request status
        await storage.updateWebhookRequestStatus(webhookRequest.id, "success");

        const webhookData = await webhookResponse.json().catch(() => ({}));

        res.json({
          message: "Consulta enviada exitosamente",
          data: {
            month,
            year,
            requestId: webhookRequest.id,
            webhookResponse: webhookData
          }
        });

      } catch (webhookError) {
        // Update request status to failed
        await storage.updateWebhookRequestStatus(webhookRequest.id, "failed");
        
        console.error("Error sending to webhook:", webhookError);
        
        res.status(500).json({
          message: "Error al enviar datos al webhook",
          error: webhookError instanceof Error ? webhookError.message : "Error desconocido"
        });
      }

    } catch (error) {
      console.error("Error in consultation endpoint:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });

  // Get webhook requests history (optional endpoint for debugging)
  app.get("/api/consultation/history", async (req, res) => {
    try {
      const requests = await storage.getWebhookRequests();
      res.json({ requests });
    } catch (error) {
      console.error("Error getting webhook history:", error);
      res.status(500).json({
        message: "Error al obtener historial",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
