import { LoggerFactory } from "./logger";

const logger = LoggerFactory("Metrics");

/**
 * Measure time execution
 *
 * Usage:
 * await measure("OperationName", () =>
 *   longOperation(params)
 * );
 *
 * @param name Operation unique name
 * @param fn Operation function
 * @returns Promise
 */
export async function measure<T>(
	name: string,
	fn: () => Promise<T>,
): Promise<T> {
	performance.mark(`${name}-start`);
	try {
		return await fn();
	} finally {
		performance.mark(`${name}-end`);
		performance.measure(name, `${name}-start`, `${name}-end`);

		const [entry] = performance.getEntriesByName(name);
		logger.log(`Operation ${name} took`, `${entry.duration.toFixed(0)} ms`);

		performance.clearMarks();
	}
}
