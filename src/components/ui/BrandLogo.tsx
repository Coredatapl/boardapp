import imgLogoColor from "@/assets/img/logo-color-small.png";

export default function BrandLogo() {
	return (
		<img
			className="h-4 text-sm font-medium dark:text-white/30 text-gray-400 tracking-widest uppercase"
			src={imgLogoColor}
			alt="Board App"
		/>
	);
}
