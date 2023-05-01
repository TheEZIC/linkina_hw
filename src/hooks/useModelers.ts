import {useState} from "react";

export const useModelers = (): [ModelerUser[], () => Promise<void>] => {
  const [modelers, setModelers] = useState<ModelerUser[]>([]);

  const getModelers = async () => {
    const modelers = await window.API.manager.getModelers();
    setModelers(modelers);
  };

  return [modelers, getModelers];
};
