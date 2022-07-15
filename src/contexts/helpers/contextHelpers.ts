import { useEffect, useState } from "react";

export type StateVariable<T> = {
  value: T;
  setValue: (value: T) => void;
};

export function nullStateVariable<T>(value: T): StateVariable<T> {
  let obj: any = {};

  obj.value = value;

  obj.setValue = (value: T) => {
    obj.value = value;
  };

  return obj;
}

export function useCreateStateVariable<T>(value: T): StateVariable<T> {
  const [state, setState] = useState<T>(value);

  return {
    value: state,
    setValue: setState,
  };
}

export function useSaveEffect<T>(
  ready: boolean,
  key: string,
  value: T,
  toString: (value: T) => string
) {
  useEffect(() => {
    if (ready) {
      //The state has changed!
      const saveState = async () => {
        localStorage.setItem(key, toString(value));
      };

      saveState().catch((error) => {
        console.log("Error saving state: " + error);
      });
    }
  }, [value]);
}

export function nullToUndefined<T>(value: T | null | undefined): undefined | T {
  return value === null ? undefined : value;
}
