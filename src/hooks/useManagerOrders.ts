import {useDataContext} from "../contexts/data-context";

export const useManagerOrders = (): [Order[], () => Promise<void>] => {
  const { data, setData } = useDataContext();

  const getOrders = async () => {
    const orders = await window.API.manager.findOrders();
    setData(orders);
  };

  return [data as Order[], getOrders];
};
