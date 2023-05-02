import React, {useEffect, useState} from 'react';
import {useDisclosure} from "@mantine/hooks";
import {useModelerOrders} from "../../../hooks/useModelerOrders";
import {statusMap} from "../../../utils";
import {ActionIcon, Flex, Tooltip} from "@mantine/core";
import {FiMoreHorizontal} from "react-icons/fi";
import {HiPencilAlt} from "react-icons/hi";
import ManagerAndModelerOrderDetails from "../Details/ManagerAndModelerOrderDetails";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";
import {FaPlus} from "react-icons/fa";
import AddSubmitForm from "../Forms/AddSubmitForm";

const ModelerBody = () => {
  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const [orders, getOrders] = useModelerOrders(user.id);
  const [activeOrder, setActiveOrder] = useState<Order>();
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [submitOpened, { open: openSubmit, close: closeSubmit }] = useDisclosure(false);

  useEffect(() => {
    getOrders();
  }, []);

  const openDetailsModal = (order: Order) => {
    setActiveOrder(order);
    openDetails();
  };

  const openSubmitModal = (order: Order) => {
    setActiveOrder(order);
    openSubmit();
  };

  const renderItems = () => orders.map((o, i) => (
    <tr key={`order-${i}-${o.id}`}>
      <td>{o.id}</td>
      <td>{o.name}</td>
      <td>{o.deadline ?  new Date(o.deadline).toLocaleString() : "Пока не установлен"}</td>
      <td>{statusMap[o.state]}</td>
      <td>
        <Flex align={"center"}>
          <Tooltip label={"Добавить результат"} color={"green.8"} withArrow={true}>
            <ActionIcon
              color={"green.5"}
              variant={"light"}
              ml={"sm"}
              onClick={() => openSubmitModal(o)}
            >
              <FaPlus/>
            </ActionIcon>
          </Tooltip>
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
        </Flex>
      </td>
    </tr>
  ));

  return (
    <>
      {renderItems()}
      <ManagerAndModelerOrderDetails
        opened={detailsOpened}
        close={closeDetails}
        order={activeOrder}
      />
      <AddSubmitForm
        opened={submitOpened}
        close={closeSubmit}
        order={activeOrder}
      />
    </>
  );
};

export default ModelerBody;
