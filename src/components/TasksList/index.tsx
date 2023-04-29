import React from 'react';
import {ActionIcon, Button, Flex, Table, Text} from "@mantine/core";
import {useUserContext} from "../../contexts/user-context";
import RequesterHeader from "./TableHeaders/RequesterHeader";
import styles from "./index.module.scss";
import {BiLogOut} from "react-icons/bi";
import RequesterControls from "./Controls/RequesterControls";
import RequesterBody from "./TableBodies/RequesterBody";

const TasksList = () => {
  const { user, removeUser } = useUserContext();
  const { role } = user;

  const renderHeader = () => {
    switch (role) {
      case "requester":
        return <RequesterHeader/>;
      case "manager":
        return <></>;
      case "modeler":
        return <></>;
    }
  };

  const renderControls = () => {
    switch (role) {
      case "requester":
        return <RequesterControls/>
      case "manager":
        return <></>;
      case "modeler":
        return <></>;
    }
  };

  const renderBody = () => {
    switch (role) {
      case "requester":
        return <RequesterBody/>
      case "manager":
        return <></>;
      case "modeler":
        return <></>;
    }
  };

  return (
    <div className={styles.container}>
      <Flex
        justify={"flex-end"}
        className={styles.controls}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[9],
          borderBottomColor: theme.colors.gray[7],
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        })}
      >
        <Text>{user.name}</Text>
        <ActionIcon
          color={"blue.5"}
          variant={"light"}
          ml={"sm"}
          onClick={removeUser}
        >
          <BiLogOut/>
        </ActionIcon>
      </Flex>
      <div className={styles.table}>
        <Table>
          <thead>{renderHeader()}</thead>
          <tbody>{renderBody()}</tbody>
        </Table>
      </div>

      <Flex
        className={styles.controls}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[9],
          borderTopColor: theme.colors.gray[7],
          borderTopWidth: 1,
          borderTopStyle: "solid"
        })}
      >
        {renderControls()}
      </Flex>
    </div>
  );
};

export default TasksList;
