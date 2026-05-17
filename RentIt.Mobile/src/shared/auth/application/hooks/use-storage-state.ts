import { useCallback, useEffect, useReducer } from 'react';
import { AUTH_TOKEN_STORAGE_KEY } from '../../constants';
import { getStorageItemAsync, setStorageItemAsync } from '../../infrastructure/secure-storage';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
      false,
      action,
    ],
    initialValue,
  ) as UseStateHook<T>;
}

export function useStorageState(key: string = AUTH_TOKEN_STORAGE_KEY): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    void getStorageItemAsync(key).then((value) => {
      setState(value);
    });
  }, [key, setState]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      void setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}
