import React from 'react';
import {Button} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";

type AddOrderFormType = {
  name: string;
  specification: string;
};

const addTitle = "Создать заказ";

const RequesterControls = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) =>
    window.API.requester.submitOrder(user.id, order);

  return (
    <>
      <Button color={"green"} onClick={open}>{addTitle}</Button>
      <RequesterOrderForm
        opened={opened}
        close={close}
        onSave={onSave}
      />
    </>
  );
};

export default RequesterControls;
