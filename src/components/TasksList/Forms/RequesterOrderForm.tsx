import React, {FC, memo, useCallback, useEffect} from 'react';
import {Button, Flex, Modal, Select, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useRequesterOrders} from "../../../hooks/useRequesterOrders";
import {FormBaseProps} from "../types/FormBaseProps";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";

export type RequesterOrderFormType = {
  name: string;
  specification: string;
};

export type RequesterOrderFormProps = {
  title: string;
  initialValues?: Partial<RequesterOrderFormType>;
  onSave: (user: BaseUser, order: Pick<Order, "name" | "specification">) => Promise<unknown> | unknown;
} & FormBaseProps;

const RequesterOrderForm: FC<RequesterOrderFormProps> = memo(({ initialValues, opened, close, onSave, title }) => {
  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const [orders, getOrders] = useRequesterOrders();
  const form = useForm<RequesterOrderFormType>();

  useEffect(() => {
    form.setValues({
      name: initialValues?.name ?? "",
      specification: initialValues?.specification ?? "",
    });
  }, [initialValues, opened]);

  const addOrder = useCallback(async () => {
    const { name, specification } = form.values;

    if (!name || !specification) {
      return;
    }

    onSave(user, { name, specification });
    getOrders();
    close();
  }, [form]);

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
      <form>
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
            <Button color={"green"} onClick={addOrder} type={"submit"}>Сохранить</Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
});

export default RequesterOrderForm;
