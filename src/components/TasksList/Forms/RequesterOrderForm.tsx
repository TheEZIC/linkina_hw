import React, {FC, useEffect} from 'react';
import {Button, Flex, Modal, Select, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useUserContext} from "../../../contexts/user-context";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {FormBaseProps} from "../types/FormBaseProps";

export type RequesterOrderFormType = {
  name: string;
  specification: string;
};

export type RequesterOrderFormProps = {
  title: string;
  initialValues?: Partial<RequesterOrderFormType>;
  onSave: (user: BaseUser, order: Pick<Order, "name" | "specification">) => Promise<unknown> | unknown;
} & FormBaseProps;

const RequesterOrderForm: FC<RequesterOrderFormProps> = ({ initialValues, opened, close, onSave, title }) => {
  const { user } = useUserContext();
  const [orders, getOrders] = useRequesterOrders();
  const form = useForm<RequesterOrderFormType>();

  useEffect(() => {
    form.setValues({
      name: initialValues?.name ?? "",
      specification: initialValues?.specification ?? "",
    });
  }, [initialValues]);

  const addOrder = async () => {
    const { name, specification } = form.values;

    if (!name || !specification) {
      return;
    }

    onSave(user, { name, specification });
    getOrders();
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={title}
      centered={true}
      overlayProps={{
        blur: 4,
      }}
    >
      <Flex direction={"column"} gap={"sm"}>
        <TextInput
          label={"Название заказа"}
          placeholder={"Введите название заказа"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("name")}
        />
        <Textarea
          label={"Описание заказа"}
          placeholder={"Введите подробное описание заказа"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("specification")}
        />
        <Flex gap={"sm"}>
          <Button color={"green"} onClick={addOrder}>Сохранить</Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default RequesterOrderForm;
