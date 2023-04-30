import React, {useEffect, useState} from 'react';
import {ActionIcon, Button, Flex, Tooltip} from "@mantine/core";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";
import {useUserContext} from "../../../contexts/user-context";
import RequesterOrderDetails from "../Details/RequesterOrderDetails";
import {BsFillTrashFill} from "react-icons/bs";
import {HiPencilAlt} from "react-icons/hi";
import {FiMoreHorizontal} from "react-icons/fi";

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
        <Flex align={"center"}>
          <Tooltip label={"Подробнее"} color={"yellow.8"} withArrow={true}>
            <ActionIcon
              color={"yellow.5"}
              variant={"light"}
              ml={"sm"}
              onClick={() => openDetailsModal(o)}
            >
              <FiMoreHorizontal/>
            </ActionIcon>
          </Tooltip>

          <Tooltip label={"Редактировать"} color={"violet.8"} withArrow={true}>
            <ActionIcon
              color={"violet.5"}
              variant={"light"}
              ml={"sm"}
              onClick={() => openEditModal(o)}
            >
              <HiPencilAlt/>
            </ActionIcon>
          </Tooltip>

          <Tooltip label={"Удалить"} color={"red.8"} withArrow={true}>
            <ActionIcon
              color={"red.5"}
              variant={"light"}
              ml={"sm"}
              onClick={() => deleteOrder(o.id)}
            >
              <BsFillTrashFill/>
            </ActionIcon>
          </Tooltip>
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
