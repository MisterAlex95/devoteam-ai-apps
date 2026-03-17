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

export const anomalySliceSchema = z.object({
  timestamp: z.string(),
  cpu_usage: z.number().optional(),
  memory_usage: z.number().optional(),
  latency_ms: z.number().optional(),
  disk_usage: z.number().optional(),
  network_in_kbps: z.number().optional(),
  network_out_kbps: z.number().optional(),
  io_wait: z.number().optional(),
  thread_count: z.number().optional(),
  active_connections: z.number().optional(),
  error_rate: z.number().optional(),
  uptime_seconds: z.number().optional(),
  temperature_celsius: z.number().optional(),
  power_consumption_watts: z.number().optional(),
  service_status: serviceStatusSchema.optional(),
});

export type AnomalySlice = z.infer<typeof anomalySliceSchema>;

export const recommendationOutputSchema = z.object({
  recommendation: z.string(),
});

export type RecommendationOutput = z.infer<typeof recommendationOutputSchema>;
