import { render, screen } from '@testing-library/react';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../utils/GlobalStateContext';
import WelcomeWidget from './WelcomeWidget';
import { Dispatch, SetStateAction } from 'react';

describe('WelcomeWidget', () => {
  const globalStateFirstRun = defaultGlobalState;
  const globalState = { ...defaultGlobalState, firstRun: false };
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;

  test('render first run', () => {
    // Arrange
    // Act
    render(
      <GlobalStateContext.Provider
        value={{ globalState: globalStateFirstRun, setGlobalState }}
      >
        <WelcomeWidget />
      </GlobalStateContext.Provider>
    );
    const logo = screen.getByAltText(globalState.appName as string);
    const helloHeader = screen.getByText('Hello!');

    // Assert
    expect(logo).toBeInTheDocument();
    expect(helloHeader).toBeInTheDocument();
  });

  test('render', () => {
    // Arrange
    // Act
    render(
      <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
        <WelcomeWidget />
      </GlobalStateContext.Provider>
    );

    // Assert
    expect(
      screen.queryByText(globalState.appName as string)
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Hello!')).not.toBeInTheDocument();
  });
});
