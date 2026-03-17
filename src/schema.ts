import { z } from "zod";

const serviceStatusSchema = z.object({
  database: z.string(),
  api_gateway: z.string(),
  cache: z.string(),
});

export const rapportSchema = z.object({
  timestamp: z.string(),
  cpu_usage: z.number(),
  memory_usage: z.number(),
  latency_ms: z.number(),
  disk_usage: z.number(),
  network_in_kbps: z.number(),
  network_out_kbps: z.number(),
  io_wait: z.number(),
  thread_count: z.number(),
  active_connections: z.number(),
  error_rate: z.number(),
  uptime_seconds: z.number(),
  temperature_celsius: z.number(),
  power_consumption_watts: z.number(),
  service_status: serviceStatusSchema,
});

export type Rapport = z.infer<typeof rapportSchema>;
export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
