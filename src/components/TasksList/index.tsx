import React, {useEffect} from 'react';
import {shallow} from "zustand/shallow";
import {ActionIcon, Flex, Table, Text} from "@mantine/core";
import RequesterHeader from "./TableHeaders/RequesterHeader";
import {BiLogOut} from "react-icons/bi";
import RequesterControls from "./Controls/RequesterControls";
import RequesterBody from "./TableBodies/RequesterBody";
import ManagerHeader from "./TableHeaders/ManagerHeader";
import ManagerBody from "./TableBodies/ManagerBody";
import styles from "./index.module.scss";
import ModelerBody from "./TableBodies/ModelerBody";
import ModelerHeader from "./TableHeaders/ModelerHeader";
import {useModelersStore} from "../../stores/modelersStore";
import {useUserStore} from "../../stores/userStore";

const TasksList = () => {
  const [getModelers] = useModelersStore(
    (state) => [state.getModelers],
    shallow
  );

  const [user, removeUser] = useUserStore(
    (state) => [state.user, state.removeUser],
    shallow
  );

  // request modelers ones when app opened
  useEffect(() => {
    getModelers();
  }, [])

  const { role } = user;

  const renderHeader = () => {
    switch (role) {
      case "requester":
        return <RequesterHeader/>;
      case "manager":
        return <ManagerHeader/>;
      case "modeler":
        return <ModelerHeader/>;
    }
  };

  const renderControls = () => {
    switch (role) {
      case "requester":
        return <RequesterControls/>
      default:
        return <></>;
    }
  };

  const renderBody = () => {
    switch (role) {
      case "requester":
        return <RequesterBody/>
      case "manager":
        return <ManagerBody/>;
      case "modeler":
        return <ModelerBody/>;
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
