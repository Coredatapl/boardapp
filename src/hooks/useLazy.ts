import { lazy } from "react";

export const useLazy = (path: string, delay?: number) => {
	return lazy(() =>
		import(path).then((module) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(module as any);
				}, delay ?? 5000);
			});
		}),
	);
};
