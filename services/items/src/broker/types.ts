export type ConsumerHandler = (message: any) => Promise<{ success: boolean; result?: unknown }>;
