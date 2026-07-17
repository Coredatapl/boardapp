import { type SpeechToTextService, speechService } from "@/utils/speech";

export function useSpeech(lang?: string): SpeechToTextService {
	if (lang) {
		speechService.setLanguage(lang);
	}
	return speechService;
}
