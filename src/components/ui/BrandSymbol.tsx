import imgSymbol from "@/assets/img/favicon.png";

export default function BrandSymbol() {
	const symbolFallback = (
		<svg
			className="w-6 h-6 text-accent"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<title>Brand</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
	);

	return (
		<div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 mb-4">
			{imgSymbol && (
				<img
					className="w-6 h-6 text-sm font-medium text-accent dark:text-white/30 tracking-widest uppercase"
					src={imgSymbol}
					alt="Board App"
				/>
			)}
			{!imgSymbol && symbolFallback}
		</div>
	);
}
