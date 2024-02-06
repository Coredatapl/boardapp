import { Dispatch, SetStateAction, createContext } from 'react';
import { ConfigData, ConfigService } from './ConfigService';

export interface GlobalStateData extends ConfigData {
  widgetShortcutsHidden: boolean;
}

const Config = ConfigService.getInstance();

export const defaultGlobalState = Config.get() as GlobalStateData;
defaultGlobalState.widgetShortcutsHidden = true;

export const GlobalStateContext = createContext({
  globalState: {} as GlobalStateData,
  setGlobalState: {} as Dispatch<SetStateAction<GlobalStateData>>,
});
