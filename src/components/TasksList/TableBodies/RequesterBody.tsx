import React, {useEffect, useState} from 'react';
import {Button, Flex} from "@mantine/core";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";
import {useUserContext} from "../../../contexts/user-context";
import RequesterOrderDetails from "../Details/RequesterOrderDetails";

const RequesterBody = () => {
  const {user} = useUserContext();
  const [orders, getOrders] = useRequesterOrders();
  const [activeOrder, setActiveOrder] = useState<Order>();
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  useEffect(() => {
    getOrders();
  }, []);

  const openEditModal = (order: Order) => {
    setActiveOrder(order);
    openEdit();
  };

  const openDetailsModal = (order: Order) => {
    setActiveOrder(order);
    openDetails();
  };

  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) => {
    window.API.requester.editOrder(user.id, activeOrder.id, order);
  };

  const deleteOrder = async (orderId: number) => {
    await window.API.requester.deleteOrder(user.id, orderId);
    getOrders();
  };

  const renderItems = () => orders.map((o, i) => (
    <tr key={`order-${i}-${o.id}`}>
      <td>{o.id}</td>
      <td>{o.name}</td>
      <td>{o.deadline ?? "Пока не установлен"}</td>
      <td>
        <Flex gap={"sm"}>
          <Button color={"yellow"} size={"xs"} onClick={() => openDetailsModal(o)}>Подробнее</Button>
          <Button color={"violet"} size={"xs"} onClick={() => openEditModal(o)}>Изменить</Button>
          <Button color={"red"} size={"xs"} onClick={() => deleteOrder(o.id)}>Удалить</Button>
        </Flex>
      </td>
    </tr>
  ));

  return (
    <>
      {renderItems()}
      <RequesterOrderForm
        opened={editOpened}
        close={closeEdit}
        initialValues={activeOrder}
        onSave={onSave}
      />
      <RequesterOrderDetails
        opened={detailsOpened}
        close={closeDetails}
        order={activeOrder}
      />
    </>
  );
};

export default RequesterBody;
