import {useCallback} from "react";
import {shallow} from "zustand/shallow";
import {useDataStore} from "../stores/dataStore";

export const useModelerOrders = (modelId: number): [Order[], () => Promise<void>] => {
  const [data, setData] = useDataStore(
    (state) => [state.data, state.setData],
    shallow
  );

  const getOrders = useCallback(async () => {
    const orders = await window.API.modeler.getOrders(modelId);
    setData(orders);
  }, []);

  return [data as Order[], getOrders];
};
