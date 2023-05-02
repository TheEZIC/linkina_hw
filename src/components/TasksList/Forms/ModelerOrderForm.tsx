import {FormBaseProps} from "../types/FormBaseProps";
import {useForm} from "@mantine/form";
import {useModelers} from "../../../hooks/useModelers";
import {useManagerOrders} from "../../../hooks/useManagerOrders";
import {Button, Flex, Modal, Select, Textarea} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";
import {FC, useEffect} from "react";

export type ModelerOrderFormType = {
};

export type Modeler = {
  order?: Order;
} & FormBaseProps;

const ManagerOrderForm: FC<Modeler> = ({ opened, close, order }) => {
  if (!order) {
    return <></>;
  }

  const form = useForm<ModelerOrderFormType>();
  const [orders, getOrders] = useManagerOrders();

  useEffect(() => {
    form.setValues({
      privateDescription: order.private_description ?? "",
      modelerId: order.modeler_id ?? 0,
      deadline: order.deadline ?? Date.now(),
    });
  }, [order]);

  const onSave = async () => {
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
          <Select
            label={"Исполнитель"}
            placeholder={"выберите исполнителя"}
            data={[]}
            searchable={true}
            {...form.getInputProps("modelerId")}
          />
          <Flex gap={"sm"}>
            <Button color={"green"} onClick={onSave} type={"submit"}>Сохранить</Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};

export default ManagerOrderForm;
