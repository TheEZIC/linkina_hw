import React, {FC, memo, useEffect, useState} from 'react';
import {Modal, Title, Text, Flex} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {statusMap} from "../../../utils";
import {useModelersStore} from "../../../stores/modelersStore";
import {shallow} from "zustand/shallow";

type ManagerAndModelerOrderDetailsProps = {
  order?: Order;
} & FormBaseProps;

const detailsTitle = "Подробности заказа";

const ManagerAndModelerOrderDetails: FC<ManagerAndModelerOrderDetailsProps> = memo(({ order, opened, close }) => {
  if (!order) {
    return <></>;
  }

  const [edits, setEdits] = useState<Edit[]>();
  const [modelers] = useModelersStore(
    (state) => [state.modelers],
    shallow
  );

  const getEdits = async () => {
    const edits = await window.API.modeler.getEdits(order.id);
    setEdits(edits);
  }

  useEffect(() => {
    getEdits();
  }, [opened]);

  const getModelerName = () => {
    return modelers.find(m => m.id === order.modeler_id)?.name;
  };

  const renderWorker = () => {
    if (order.modeler_id && modelers.length) {
      return (
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Исполнитель</Title>
          <Text>{getModelerName()}</Text>
        </Flex>
      );
    } else {
      return <></>;
    }
  };

  const renderEditsItems = () => edits.map((e, i) => (
    <span key={`edit-${i}`}>{e.specification}</span>
  ));

  const renderEdits = () => {
    if (edits && edits.length) {
      return (
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Правки</Title>
          {renderEditsItems()}
        </Flex>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={detailsTitle}
      centered={true}
      overlayProps={{
        blur: 4,
      }}
    >
      <Flex direction={"column"} gap={"sm"}>
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Название</Title>
          <Text>{order.name}</Text>
        </Flex>
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Описание</Title>
          <Text>{order.specification}</Text>
        </Flex>
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Описание для исполнителя</Title>
          <Text>{order.private_description}</Text>
        </Flex>
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Срок</Title>
          <Text>{order.deadline ?  new Date(order.deadline).toLocaleString() : "Пока не установлен"}</Text>
        </Flex>
        <Flex direction={"column"}>
          <Title color={"violet"} order={4}>Статус</Title>
          <Text>{statusMap[order.state]}</Text>
        </Flex>
        {renderWorker()}
        {renderEdits()}
      </Flex>
    </Modal>
  );
});

export default ManagerAndModelerOrderDetails;
