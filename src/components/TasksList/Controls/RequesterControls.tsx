import React from 'react';
import {Button} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import RequesterOrderForm from "../Forms/RequesterOrderForm";
import ContactInformationForm from "../Forms/ContactInformationForm";

const RequesterControls = () => {
  const [createOrderOpened, { open: openCreateOrder, close: closeCreateOrder }] = useDisclosure(false);
  const [contactInfoOpened, { open: openContactInfo, close: closeContactInfo }] = useDisclosure(false);
  const onSave = (user: BaseUser, order: Pick<Order, "name" | "specification">) => {
    window.API.requester.submitOrder(user.id, order);
  }

  return (
    <>
      <Button color={"green"} onClick={openCreateOrder}>Создать заказ</Button>
      <Button color={"orange"} onClick={openContactInfo}>Добавить контактную информацию</Button>
      <RequesterOrderForm
        title={"Создать заказ"}
        opened={createOrderOpened}
        close={closeCreateOrder}
        onSave={onSave}
      />
      <ContactInformationForm
        opened={contactInfoOpened}
        close={closeContactInfo}
      />
    </>
  );
};

export default RequesterControls;
