import {create} from "zustand";

export type DataStore = {
  data: any[];
  setData: (data: any[]) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  setData: (data: any[]) => {
    set({ data });
  },
}));
