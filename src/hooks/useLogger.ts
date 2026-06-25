import { LoggerFactory, type LoggerInterface } from "@/utils/logger";

export function useLogger(module?: string): LoggerInterface {
	return LoggerFactory(module);
}
