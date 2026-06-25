import { LocalStorage, type StorageInterface } from "@/utils/storage";

export function useStorage(): StorageInterface {
	return LocalStorage;
}
