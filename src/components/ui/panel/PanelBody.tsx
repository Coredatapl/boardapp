import type { PropsWithChildren } from "react";

export default function PanelBody({ children }: PropsWithChildren) {
	return <div className="flex-1 overflow-y-auto p-5 space-y-2">{children}</div>;
}
