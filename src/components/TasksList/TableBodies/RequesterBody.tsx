import React, {useEffect, useState} from 'react';
import {ActionIcon, Button, Flex, Tooltip} from "@mantine/core";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";
import RequesterOrderDetails from "../Details/RequesterOrderDetails";
import {BsFillTrashFill} from "react-icons/bs";
import {HiPencilAlt} from "react-icons/hi";
import {FiMoreHorizontal} from "react-icons/fi";
import {statusMap} from "../../../utils";
import {FaCheck, FaPlus} from "react-icons/fa";
import AddEditForm from "../Forms/AddEditForm";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";
import DummyButton from "../../DummyButton";

const RequesterBody = () => {
  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const [orders, getOrders] = useRequesterOrders();
  const [activeOrder, setActiveOrder] = useState<Order>();
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [submitEditOpened, { open: openSubmitEdit, close: closeSubmitEdit }] = useDisclosure(false);

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

  const openSubmitEditModal = (order: Order) => {
    setActiveOrder(order);
    openSubmitEdit();
  };

  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) => {
    window.API.requester.editOrder(user.id, activeOrder.id, order);
  };

  const deleteOrder = async (orderId: number) => {
    await window.API.requester.deleteOrder(user.id, orderId);
    getOrders();
  };

  const finishOrder = async (orderId: number) => {
    await window.API.requester.finishOrder(user.id, orderId)
    getOrders();
  };

  const renderIcon = (order: Order) => {
    //"unassigned" | "assigned"
    if (order.state === "unassigned" || order.state === "assigned") {
      return (
        <Tooltip label={"Удалить"} color={"red.8"} withArrow={true}>
          <ActionIcon
            color={"red.5"}
            variant={"light"}
            ml={"sm"}
            onClick={() => deleteOrder(order.id)}
          >
            <BsFillTrashFill />
          </ActionIcon>
        </Tooltip>
      );
    } else if (order.state === "responded") {
      return (
        <Tooltip label={"Подтвердить"} color={"green.8"} withArrow={true}>
          <ActionIcon
            color={"green.5"}
            variant={"light"}
            ml={"sm"}
            onClick={() => finishOrder(order.id)}
          >
            <FaCheck />
          </ActionIcon>
        </Tooltip>
      );
    } else {
      return <DummyButton />;
    }
  };

  const renderItems = () => orders.map((o, i) => (
    <tr key={`order-${i}-${o.id}`}>
      <td>{o.id}</td>
      <td>{o.name}</td>
      <td>{o.deadline ? new Date(o.deadline).toLocaleString() : "Пока не установлен"}</td>
      <td>{statusMap[o.state]}</td>
      <td>
        <Flex align={"center"}>
          {o.state !== "finished" ? (
            <Tooltip label={"Добавить правку"} color={"green.8"} withArrow={true}>
              <ActionIcon
                color={"green.5"}
                variant={"light"}
                ml={"sm"}
                onClick={() => openSubmitEditModal(o)}
              >
                <FaPlus/>
              </ActionIcon>
            </Tooltip>
          ) : <DummyButton />}

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

          {o.state !== "finished" ? (
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
          ) : <DummyButton />}

          {renderIcon(o)}
        </Flex>
      </td>
    </tr>
  ));

  return (
    <>
      {renderItems()}
      <RequesterOrderForm
        title={"Редактировать заказ"}
        opened={editOpened}
        close={closeEdit}
        initialValues={activeOrder}
        onSave={onSave}
      />
      <AddEditForm
        opened={submitEditOpened}
        close={closeSubmitEdit}
        order={activeOrder}
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
