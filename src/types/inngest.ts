export type Run = {
  run_id: string;
  run_started_at: string;
  function_id: string;
  function_version: number;
  environment_id: string;
  event_id: string;
  status: string;
  ended_at: string;
  output: Record<string, unknown>;
};
