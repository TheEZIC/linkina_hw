import {createContext} from "../utils/context";

export type DataContext<T extends unknown[] = unknown[]> = {
  data: T;
  setData: (data: T) => void;
};

export const [DataProvider, useDataContext] = createContext<DataContext>("data");
