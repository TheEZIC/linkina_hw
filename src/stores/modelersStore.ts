import {create} from "zustand";

type ModelersStore = {
  modelers: ModelerUser[];
  getModelers: () => Promise<void>;
};

export const useModelersStore = create<ModelersStore>((set) => ({
  modelers: [],
  getModelers: async () => {
    const modelers = await window.API.manager.getModelers();
    set({ modelers });
  },
}));
