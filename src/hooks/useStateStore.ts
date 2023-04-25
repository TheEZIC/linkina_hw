import {Dispatch, SetStateAction, useEffect, useState} from "react";

export type UseStateStoreReturnType<S> = [S, Dispatch<SetStateAction<S>>];

export const useStateStore = <S = undefined>(key: string, initialValue: S): UseStateStoreReturnType<S> => {
  const storageValue: string | null = localStorage.getItem("key");
  const defaultValue: S = storageValue ? JSON.parse(storageValue) as S : initialValue;
  const [state, setState] = useState<S>();

  useEffect(() => {
    if (state) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState] as UseStateStoreReturnType<S>;
};
