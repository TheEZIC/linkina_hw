import React from 'react';
import {Button} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";

const RequesterControls = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) =>
    window.API.requester.submitOrder(user.id, order);

  return (
    <>
      <Button color={"green"} onClick={open}>Создать заказ</Button>
      <RequesterOrderForm
        title={"Создать заказ"}
        opened={opened}
        close={close}
        onSave={onSave}
      />
    </>
  );
};

export default RequesterControls;
