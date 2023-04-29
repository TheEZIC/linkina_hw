import React, {useEffect, useState} from 'react';
import {Button, Flex} from "@mantine/core";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";

const RequesterBody = () => {
  const [orders, getOrders] = useRequesterOrders();
  const [activeOrder, setActiveOrder] = useState<Order>();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    getOrders();
  }, []);

  const openModal = (order: Order) => {
    setActiveOrder(order);
    open();
  };

  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) => {
    //window.API.requester.submitEdit(user.id, activeOrder.id, order);
  };

  const renderItems = () => orders.map((o, i) => (
    <tr key={`order-${i}-${o.id}`}>
      <td>{o.id}</td>
      <td>{o.name}</td>
      <td>{o.deadline ?? "Пока не установлен"}</td>
      <td>
        <Flex gap={"sm"}>
          <Button color={"yellow"} size={"xs"}>Подробнее</Button>
          <Button color={"violet"} size={"xs"} onClick={() => openModal(o)}>Изменить</Button>
        </Flex>
      </td>
    </tr>
  ));

  return (
    <>
      {renderItems()}
      <RequesterOrderForm
        opened={opened}
        close={close}
        initialValues={activeOrder}
        onSave={onSave}
      />
    </>
  );
};

export default RequesterBody;
