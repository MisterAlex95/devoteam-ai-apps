export const DEFAULT_THRESHOLDS = {
  cpu_usage: 80,
  memory_usage: 80,
  latency_ms: 100,
  disk_usage: 80,
  network_in_kbps: 1000,
  network_out_kbps: 1000,
  io_wait: 10,
  thread_count: 100,
  active_connections: 100,
  error_rate: 0.05,
  uptime_seconds: 360000,
  temperature_celsius: 80,
  power_consumption_watts: 300,
} as const;

export const THRESHOLD_KEYS = Object.keys(
  DEFAULT_THRESHOLDS,
) as (keyof typeof DEFAULT_THRESHOLDS)[];
