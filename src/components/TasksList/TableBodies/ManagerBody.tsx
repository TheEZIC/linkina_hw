import React, {useEffect, useState} from 'react';
import {useUserContext} from "../../../contexts/user-context";
import {useManagerOrders} from "../../../hooks/useManagerOrders";
import {statusMap} from "../../../utils";
import {ActionIcon, Flex, Tooltip} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import ManagerOrderForm from "../Forms/ManagerOrderForm";
import {HiPencilAlt} from "react-icons/hi";
import ManagerOrderDetails from "../Details/ManagerOrderDetails";
import {FiMoreHorizontal} from "react-icons/fi";

const ManagerBody = () => {
  const {user} = useUserContext();
  const [orders, getOrders] = useManagerOrders();
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

  const renderItems = () => orders.map((o, i) => (
    <tr key={`order-${i}-${o.id}`}>
      <td>{o.id}</td>
      <td>{o.name}</td>
      <td>{o.deadline ?  new Date(o.deadline).toLocaleString() : "Пока не установлен"}</td>
      <td>{statusMap[o.state]}</td>
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
        </Flex>
      </td>
    </tr>
  ));

  return (
    <>
      {renderItems()}
      <ManagerOrderForm
        opened={editOpened}
        close={closeEdit}
        order={activeOrder}
      />
      <ManagerOrderDetails
        opened={detailsOpened}
        close={closeDetails}
        order={activeOrder}
      />
    </>
  );
};

export default ManagerBody;
