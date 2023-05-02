import React, {FC, memo, useCallback} from 'react';
import {Button, Flex, Modal, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";

type AddEditFormType = {
  description: string;
  fileUrl: string;
};

type AddSubmitForm = {
  order: Order;
} & FormBaseProps;

const AddEditForm: FC<AddSubmitForm> = memo(({ opened, close, order }) => {
  if (!order) {
    return <></>;
  }

  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const form = useForm<AddEditFormType>({
    initialValues: {
      description: "",
      fileUrl: "",
    },
  });

  const submitEdit = useCallback(() => {
    const { description, fileUrl } = form.values;

    if (!description || !fileUrl) {
      return;
    }

    window.API.modeler.addSubmission(order.id, fileUrl, description);
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
          label={"Описание проделанной работы"}
          placeholder={"Введите текст описания работы"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("description")}
        />
        <TextInput
          label={"Ссылка на скачивание файла"}
          placeholder={"Введите ссылку"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("fileUrl")}
        />
        <Flex gap={"sm"}>
          <Button color={"green"} onClick={submitEdit}>Сохранить</Button>
        </Flex>
      </Flex>
    </Modal>
  );
});

export default AddEditForm;
