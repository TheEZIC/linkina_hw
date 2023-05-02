import React, {FC, memo} from 'react';
import {Button, Flex, Modal, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";

type AddEditFormType = {
  specification: string;
};

type AddEditFormProps = {
  order: Order;
  user: BaseUser;
} & FormBaseProps;

const AddEditForm: FC<AddEditFormProps> = memo(({ opened, close, order, user }) => {
  const form = useForm<AddEditFormType>({
    initialValues: {
      specification: "",
    },
  });

  const submitEdit = () => {
    const { specification } = form.values;

    if (!specification) {
      return;
    }

    window.API.requester.submitEdit(user.id, order.id, specification);
    close();
  };

  if (!order || !user) {
    return <></>;
  }

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
