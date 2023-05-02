import React, {FC, useEffect} from 'react';
import {Button, Flex, Modal, Select, Textarea, TextInput} from "@mantine/core";
import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useManagerOrders} from "../../../hooks/useManagerOrders";
import {useModelers} from "../../../hooks/useModelers";
import {DateTimePicker} from "@mantine/dates";

export type ManagerOrderFormType = {
  privateDescription: string;
  modelerId: number;
  deadline: number;
};

export type ManagerOrderFormProps = {
  order?: Order;
} & FormBaseProps;

const ManagerOrderForm: FC<ManagerOrderFormProps> = ({ opened, close, order }) => {
  if (!order) {
    return <></>;
  }

  const form = useForm<ManagerOrderFormType>();
  const [modelers, getModelers] = useModelers();
  const [orders, getOrders] = useManagerOrders();

  useEffect(() => {
    form.setValues({
      privateDescription: order.private_description ?? "",
      modelerId: order.modeler_id ?? 0,
      deadline: order.deadline ?? Date.now(),
    });
  }, [order]);

  useEffect(() => {
    getModelers();
  }, [opened]);

  const getOptions = () => {
    return [
      {label: "Не установлен", value: 0},
      ...modelers.map((m) => ({
        value: m.id,
        label: m.name,
      })),
    ];
  };

  const onSave = async () => {
    const { privateDescription, deadline } = form.values;
    let { modelerId } = form.values;

    if (privateDescription) {
      await window.API.manager.updatePrivateDescription(order.id, privateDescription);
    }

    if (modelerId !== null && modelerId !== undefined && deadline) {
      if (modelerId === 0) {
        modelerId = null;
      }

      await window.API.manager.assignOrder(order.id, modelerId, new Date(deadline));
    }

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
      <form>
        <Flex direction={"column"} gap={"sm"}>
          <Textarea
            label={"Описание для исполнителя"}
            placeholder={"Введите описание для исполнителя"}
            required={true}
            {...form.getInputProps("privateDescription")}
          />
          <Select
            label={"Исполнитель"}
            placeholder={"выберите исполнителя"}
            data={getOptions()}
            searchable={true}
            {...form.getInputProps("modelerId")}
          />
          {form.values.deadline && (
            <DateTimePicker
              label={"Срок выполнения"}
              placeholder={"Укажите срок выполнения"}
              dropdownType={"modal"}
              value={new Date(form.values.deadline)}
              onChange={(d) => form.setFieldValue("deadline", d.valueOf())}
              modalProps={{
                centered: true,
                overlayProps: {
                  blur: 4,
                },
              }}
            />
          )}
          <Flex gap={"sm"}>
            <Button color={"green"} onClick={onSave} type={"submit"}>Сохранить</Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};

export default ManagerOrderForm;
