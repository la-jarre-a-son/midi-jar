export type ServerState = {
  started: boolean;
  port: number | null;
  error: string | null;
  addresses: string[];
};
