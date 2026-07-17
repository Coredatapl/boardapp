import type { PropsWithChildren } from "react";

export default function ModalBody({ children }: PropsWithChildren) {
	return <div className="px-6 py-5 space-y-6">{children}</div>;
}
