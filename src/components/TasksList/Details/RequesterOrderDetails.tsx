import React, {FC} from 'react';
import {Modal, Title, Text, Flex} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";

type RequesterOrderDetailsProps = {
  order?: Order;
} & FormBaseProps;

const detailsTitle = "Подробности заказа";

const RequesterOrderDetails: FC<RequesterOrderDetailsProps> = ({ order, opened, close }) => {
  if (!order) {
    return <></>;
  }

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
          <Title color={"violet"} order={4}>Срок</Title>
          <Text>{order.deadline ?? "Пока не установлен"}</Text>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default RequesterOrderDetails;
