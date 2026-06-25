import { capitalise } from "./common";

interface LoggerInterface {
	log: (message: string, result?: any) => void;
}

class Logger implements LoggerInterface {
	private module: string = "App";
	private modulePad = 14;
	private timePad = 12;

	constructor(module?: string) {
		if (module) {
			this.module = module;
		}
	}

	log(message: string, result?: any) {
		if (import.meta.env.VITE_APP_ENV === "prod") return;
		const time = `${new Date().toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})}.${new Date().getMilliseconds()}`.padEnd(this.timePad, " ");
		const moduleIndicator = `${this.module}>`.padEnd(this.modulePad, " ");
		const successAction = typeof result === "string" ? result : undefined;
		const data = typeof result !== "string" ? result : undefined;

		console.log(
			`%c${time} | ${moduleIndicator}%c ${capitalise(message)} ${successAction ? `%c${successAction}` : ""}`,
			"color: #808080;",
			`color: ${successAction ? "inherit" : "#CC5500"};`,
			successAction ? `color: #27cd8d; font-weight: bold;` : "",
			data ? data : "",
		);
	}
}

export type { LoggerInterface };
export const LoggerFactory = (module?: string): LoggerInterface => {
	return new Logger(module);
};
