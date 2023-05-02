import {useCallback} from "react";
import {shallow} from "zustand/shallow";
import {useUserStore} from "../stores/userStore";
import {useDataStore} from "../stores/dataStore";

export const useRequesterOrders = (): [Order[], () => Promise<void>] => {
  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const [data, setData] = useDataStore(
    (state) => [state.data, state.setData],
    shallow
  );

  const getOrders = useCallback(async () => {
    setData([]);
    const orders = await window.API.requester.getOrders(user.id);
    setData(orders);
  }, []);

  return [data as Order[], getOrders];
};
