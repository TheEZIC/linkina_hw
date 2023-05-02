import {useDataContext} from "../contexts/data-context";

export const useModelerOrders = (modelId: number): [Order[], () => Promise<void>] => {
  const { data, setData } = useDataContext();

  const getOrders = async () => {
    const orders = await window.API.modeler.getOrders(modelId);
    setData(orders);
  };

  return [data as Order[], getOrders];
};
