import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import { ConfigKey, ConfigService } from '../../../utils/ConfigService';
import { CacheApi } from '../../../utils/cache/CacheApi';
import ConfigWidget from './ConfigWidget';
import {
  GlobalStateContext,
  GlobalStateData,
  defaultGlobalState,
} from '../../../utils/GlobalStateContext';
import { useGlobalState } from '../../../hooks/useGlobalState';

describe('ConfigWidget', () => {
  const globalState = defaultGlobalState;
  const setGlobalState = (() => {}) as Dispatch<
    SetStateAction<GlobalStateData>
  >;
  const mockConfigService = {
    getInstance: jest.fn(),
    set: jest.fn(),
  };
  jest.mock('../../../utils/cache/CacheApi');
  jest.mock('../../../utils/ConfigService', () => () => mockConfigService);

  test('render', () => {
    // Arrange
    // Act
    render(<ConfigWidget />, { wrapper: BrowserRouter });
    const settingsLink = screen.getByTitle('Settings');
    const settingsTitle = screen.getByText('Settings');

    // Assert
    expect(settingsLink).toBeInTheDocument();
    expect(settingsTitle).toBeInTheDocument();
  });
});
