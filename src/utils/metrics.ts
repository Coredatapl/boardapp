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
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  performance.mark(startMark);
  try {
    return await fn();
  } finally {
    const started = performance.getEntriesByName(startMark, "mark").length > 0;
    if (started) {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);

      const [entry] = performance.getEntriesByName(name);
      logger.log(`Operation ${name} took`, `${entry.duration.toFixed(2)} ms`);

      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    }
  }
}
