import React, {FC, useEffect, useState} from 'react';
import {Modal, Title, Text, Flex} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {statusMap} from "../../../utils";
import {useModelers} from "../../../hooks/useModelers";

type ManagerOrderDetailsProps = {
  order?: Order;
} & FormBaseProps;

const detailsTitle = "Подробности заказа";

const ManagerOrderDetails: FC<ManagerOrderDetailsProps> = ({ order, opened, close }) => {
  if (!order) {
    return <></>;
  }

  const [edits, setEdits] = useState<Edit[]>();
  const [modelers, getModelers] = useModelers();

  const getEdits = async () => {
    const edits = await window.API.modeler.getEdits(order.id);
    setEdits(edits);
  }

  useEffect(() => {
    getEdits();
    getModelers();
  }, [opened]);

  const renderEdits = () => edits.map((e, i) => (
    <span key={`edit-${i}`}>{e.specification}</span>
  ));

  const getModelerName = () => {
    return modelers.find(m => m.id === order.modeler_id)?.name;
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
        {order.modeler_id && modelers.length && (
          <Flex direction={"column"}>
            <Title color={"violet"} order={4}>Исполнитель</Title>
            <Text>{getModelerName()}</Text>
          </Flex>
        )}
        {edits && (
          <Flex direction={"column"}>
            <Title color={"violet"} order={4}>Правки</Title>
            {renderEdits()}
          </Flex>
        )}
      </Flex>
    </Modal>
  );
};

export default ManagerOrderDetails;
