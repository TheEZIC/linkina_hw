import {useDataContext} from "../contexts/data-context";
import {useUserContext} from "../contexts/user-context";

export const useRequesterOrders = (): [Order[], () => Promise<void>] => {
  const { user } = useUserContext();
  const { data, setData } = useDataContext();

  const getOrders = async () => {
    const orders = await window.API.requester.getOrders(user.id);
    console.log(orders, "orders");
    setData(orders);
  };

  return [data as Order[], getOrders];
};
