import React, {FC, memo, useCallback} from 'react';
import {Button, Flex, Modal, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";
import {useModelerOrders} from "../../../hooks/useModelerOrders";

type AddEditFormType = {
  specification: string;
};

type AddEditFormProps = {
  order: Order;
} & FormBaseProps;

const AddEditForm: FC<AddEditFormProps> = memo(({ opened, close, order }) => {
  if (!order) {
    return <></>;
  }

  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );
  const [orders, getOrders] = useModelerOrders(user.id);

  const form = useForm<AddEditFormType>({
    initialValues: {
      specification: "",
    },
  });

  const submitEdit = useCallback(() => {
    const { specification } = form.values;

    if (!specification) {
      return;
    }

    window.API.requester.submitEdit(user.id, order.id, specification);
    getOrders();
    close();
  }, [form]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={"Добавить правку"}
      centered={true}
      overlayProps={{
        blur: 4,
      }}
    >
      <Flex direction={"column"} gap={"sm"}>
        <Textarea
          label={"Текст правки"}
          placeholder={"Введите текст правки"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("specification")}
        />
        <Flex gap={"sm"}>
          <Button color={"green"} onClick={submitEdit}>Сохранить</Button>
        </Flex>
      </Flex>
    </Modal>
  );
});

export default AddEditForm;
