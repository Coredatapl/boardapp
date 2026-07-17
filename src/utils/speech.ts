export class SpeechToTextService {
	public isListening = false;
	public isSupported = false;
	public isAvailableDevice: boolean | undefined;

	public onEnd: () => void = () => {};
	public onResult: (text: string) => void = () => {};
	public onError: (error: string) => void = () => {};

	private instance: SpeechRecognition | null = null;

	constructor() {
		this.isSupported =
			typeof window !== "undefined" &&
			("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

		if (this.isSupported) {
			this.init();
		}
	}

	public setLanguage = (lang: string) => {
		if (!this.instance || !lang) {
			return;
		}
		this.instance.lang = lang;
	};

	public start = () => {
		if (this.instance) {
			this.instance.start();
			this.isListening = true;
		}
	};

	public stop = () => {
		if (this.instance) {
			this.instance.stop();
			this.isListening = false;
		}
	};

	private init() {
		const SpeechRecognition =
			window.SpeechRecognition || (window as any).webkitSpeechRecognition;
		this.instance = new SpeechRecognition();
		this.instance.continuous = false;
		this.instance.interimResults = false;
		this.instance.maxAlternatives = 1;
		this.instance.lang = "en-US";
		this.instance.onresult = this.handleResult;
		this.instance.onend = this.handleRecognitionEnd;
		this.instance.onerror = this.handleRecognitionError;

		this.checkDevices();
	}

	private checkDevices() {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			if (devices.length > 0 && devices.some((d) => d.kind === "audioinput")) {
				this.isAvailableDevice = true;
			} else {
				this.onError("No audio device available");
			}
		});
	}

	private handleResult = (event: SpeechRecognitionEvent) => {
		for (const result of event.results) {
			if (result.isFinal) {
				const text = result[0].transcript;
				this.onResult(text);
			}
		}
	};

	private handleRecognitionEnd = () => {
		this.isListening = false;
		this.onEnd();
	};

	private handleRecognitionError = (event: SpeechRecognitionErrorEvent) => {
		this.onError(`Speech recognition error: ${event.error}`);
		this.stop();
	};
}

export const speechService = new SpeechToTextService();
