import {useCallback} from "react";
import {shallow} from "zustand/shallow";
import {useDataStore} from "../stores/dataStore";

export const useManagerOrders = (): [Order[], () => Promise<void>] => {
  const [data, setData] = useDataStore(
    (state) => [state.data, state.setData],
    shallow
  );

  const getOrders = useCallback(async () => {
    setData([]);
    const orders = await window.API.manager.findOrders();
    setData(orders);
  }, []);

  return [data as Order[], getOrders];
};
