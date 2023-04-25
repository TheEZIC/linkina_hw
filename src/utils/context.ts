import React from "react";

type CreateContextReturnType<T> = [React.Provider<T>, () => T];

const errorMessage = "Can't find context provider, you may forgot to wrap component within Provider";

export const createContext = <T = unknown>(name: string): CreateContextReturnType<T> => {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = name;

  const useContext = () => {
    const context = React.useContext(Context);

    if (!context) {
      const error = new Error(errorMessage);
      error.name = "ContextError";

      throw error;
    }

    return context;
  };

  return [Context.Provider, useContext] as CreateContextReturnType<T>;
}
