import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { nullToUndefined, StateVariable } from "./contextHelpers";
import { useCreateStateVariable, useSaveEffect } from "./contextHelpers";

export type GenerateContextOptions = {
  storage: "localStorage" | "none";
  storagePrefix?: string;
};

function keyFunction(key: string, storagePrefix: string | undefined) {
  return storagePrefix ? `${storagePrefix}.${key}` : key;
}

export function generateContext<ContextType>(
  defaultContext: ContextType,
  options: GenerateContextOptions
): [
  () => (props: { children: ReactNode }) => JSX.Element,
  (props: {
    children: (
      value: {
        [key in keyof ContextType]: StateVariable<ContextType[key]>;
      } & {
        ready: React.MutableRefObject<boolean>;
      }
    ) => ReactNode;
  }) => JSX.Element,
  React.Context<
    {
      [key in keyof ContextType]: StateVariable<ContextType[key]>;
    } & {
      ready: React.MutableRefObject<boolean>;
    }
  >
] {
  type ContextAccessorType = {
    [key in keyof ContextType]: StateVariable<ContextType[key]>;
  };

  type ReadyContextType = ContextAccessorType & {
    ready: React.MutableRefObject<boolean>;
  };

  let throwawayContext: any = {};

  for (let key in defaultContext) {
    throwawayContext[key] = {} as any;
  }

  const Context = createContext<ReadyContextType>({
    ...throwawayContext,
    ready: {} as any,
  });

  function getContextProvider() {
    const ContextProvider = (props: { children: ReactNode }) => {
      const userContext = useContext(Context) as any;

      let keys = Object.keys(defaultContext).sort();

      //init all of the state variables
      //if (options.storage === "localStorage") {
      for (let key of keys) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        userContext[key] = useCreateStateVariable(
          nullToUndefined(
            localStorage.getItem(keyFunction(key, options.storagePrefix))
          )
        );
      }
      //} else if (options.storage === "none") {
      //
      //}

      userContext.ready = useRef<boolean>(false);

      if (options.storage === "localStorage") {
        for (let key of keys) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useSaveEffect(
            userContext.ready.current,
            keyFunction(key, options.storagePrefix), //`${options.storagePrefix ? options.storagePrefix + "." : ""}key`,
            userContext[key].value,
            (value) => value ?? ""
          );
        }
      }

      useEffect(() => {
        userContext.ready.current = true;
      }, []);

      return (
        <Context.Provider value={userContext}>
          {props.children}
        </Context.Provider>
      );
    };

    return ContextProvider;
  }

  const ContextConsumer = (props: {
    children: (value: ReadyContextType) => ReactNode;
  }) => {
    return <Context.Consumer>{props.children}</Context.Consumer>;
  };

  return [getContextProvider, ContextConsumer, Context];
}
