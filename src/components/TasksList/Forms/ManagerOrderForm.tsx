import React, {FC, useEffect} from 'react';
import {Button, Flex, Modal, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useManagerOrders} from "../../../hooks/useManagerOrders";

export type ManagerOrderFormType = {
  privateDescription: string;
};

export type ManagerOrderFormProps = {
  order?: Order;
} & FormBaseProps;

const ManagerOrderForm: FC<ManagerOrderFormProps> = ({ opened, close, order }) => {
  if (!order) {
    return <></>;
  }

  const form = useForm<ManagerOrderFormType>();
  const [orders, getOrders] = useManagerOrders();

  useEffect(() => {
    form.setValues({
      privateDescription: order.private_description ?? "",
    });
  }, [order]);

  const onSave = async () => {
    const { privateDescription } = form.values;

    await window.API.manager.updatePrivateDescription(order.id, privateDescription);
    getOrders();
    close();
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={"Редактирование заказа"}
      centered={true}
      overlayProps={{
        blur: 4,
      }}
    >
      <Flex direction={"column"} gap={"sm"}>
        <Textarea
          label={"Описание для исполнителя"}
          placeholder={"Введите описание для исполнителя"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("privateDescription")}
        />
        <Flex gap={"sm"}>
          <Button color={"green"} onClick={onSave}>Сохранить</Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default ManagerOrderForm;
