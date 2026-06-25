export default function Footer() {
	return (
		<footer className="absolute bottom-0 w-full flex py-1 justify-center items-center">
			<div className="text-xs dark:text-white/30">
				<a
					className="hover:text-accent"
					href="https://coredata.pl"
					target="_blank"
					rel="noreferrer"
				>
					Coredata
				</a>{" "}
				&copy; {new Date().getFullYear()}
			</div>
		</footer>
	);
}
