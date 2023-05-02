import React, {FC, useEffect} from 'react';
import {Button, Flex, Modal, Select, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useUserStore} from "../../../stores/userStore";
import {shallow} from "zustand/shallow";

type ContactInformationFormType = {
  address: string;
  phone: string;
  email: string;
};

export type ContactInformationFormProps = {
} & FormBaseProps;

const ContactInformationForm: FC<ContactInformationFormProps> = ({ opened, close }) => {
  const form = useForm<ContactInformationFormType>({
    initialValues: {
      address: "",
      phone: "",
      email: "",
    },
  });

  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

  const getContactInfo = async () => {
    const info = await window.API.getContactInfo(user.id);
    console.log(info, "info")
    form.setValues(info);
  }

  useEffect(() => {
    if (opened) {
      getContactInfo();
    }
  }, [opened]);

  const onSave = async (e: any) => {
    e.preventDefault();
    console.log(form.values, "values")
    await window.API.updateContactInfo(user.id, form.values);
    close();
  };

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
      <form>
        <Flex direction={"column"} gap={"sm"}>
          <TextInput
            label={"Адрес"}
            placeholder={"Введите адрес"}
            {...form.getInputProps("address")}
          />
          <TextInput
            label={"Телефон"}
            placeholder={"Введите телефон"}
            {...form.getInputProps("phone")}
          />
          <TextInput
            label={"Почта"}
            placeholder={"Введите почту"}
            {...form.getInputProps("email")}
          />
          <Flex gap={"sm"}>
            <Button color={"green"} onClick={onSave} type={"submit"}>Сохранить</Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};

export default ContactInformationForm;
