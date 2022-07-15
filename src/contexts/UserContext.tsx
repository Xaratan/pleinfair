import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  nullStateVariable,
  StateVariable,
  useCreateStateVariable,
  useSaveEffect,
} from "./helpers/contextHelpers";

export type UserContextType = {
  token: StateVariable<string | undefined>;
  ready: StateVariable<boolean>;
};

export type UserContextAccessor = {
  token: StateVariable<string | undefined>;
  ready: React.MutableRefObject<boolean>;
};

export function initializeUserContext(): UserContextType {
  return {
    token: nullStateVariable<string | undefined>(undefined),
    ready: nullStateVariable<boolean>(false),
  };
}

const UserContext = createContext<UserContextAccessor>({
  //Temporary data
  token: nullStateVariable<string | undefined>(undefined),
  ready: {} as any,
});

function nullToUndefined<T>(value: T | null | undefined): undefined | T {
  return value === null ? undefined : value;
}

function getUserContextProvider() {
  const UserContextProvider = (props: { children: ReactNode }) => {
    const userContext = useContext(UserContext);

    //init all of the state variables
    userContext.token = useCreateStateVariable<string | undefined>(
      nullToUndefined(localStorage.getItem("token"))
    );

    userContext.ready = useRef<boolean>(false);

    useSaveEffect(
      userContext.ready.current,
      "token",
      userContext.token.value,
      (value) => value ?? ""
    );

    useEffect(() => {
      userContext.ready.current = true;
    }, []);

    return (
      <UserContext.Provider
        value={{
          token: userContext.token,
          ready: userContext.ready,
        }}
      >
        {props.children}
      </UserContext.Provider>
    );
  };

  return UserContextProvider;
}

const UserContextConsumer = (props: {
  children: (value: UserContextAccessor) => ReactNode;
}) => {
  return <UserContext.Consumer>{props.children}</UserContext.Consumer>;
};

export { getUserContextProvider, UserContextConsumer, UserContext };
