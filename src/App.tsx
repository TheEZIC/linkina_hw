import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { APP_TITLE } from "./constants/AppTitle";
import {MantineProvider} from '@mantine/core';
import AuthForm from "./components/AuthForm";
import {UserProvider, useUserContext} from "./contexts/user-context";
import {useLocalStorage} from "@mantine/hooks";
import TasksList from "./components/TasksList";
import styles from "./index.module.scss";
import "./index.scss";
import {useState} from "react";
import {DataProvider} from "./contexts/data-context";

const App = () => {
  const {user} = useUserContext();

  const renderContent = () => {
    return !user ? <AuthForm/> : <TasksList/>;
  };

  return (
    <div className={styles.container}>
      {renderContent()}
    </div>
  );
};

const Providers = () => {
  const [user, setUser] = useLocalStorage<BaseUser>({ key: "user" });
  const [data, setData] = useState<unknown[]>([]);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <UserProvider value={{
        user,
        setUser: (user: BaseUser) => setUser(user),
        removeUser: () => setUser(undefined),
      }}>
        <DataProvider value={{ data, setData }}>
          <App/>
        </DataProvider>
      </UserProvider>
    </MantineProvider>
  );
};

const setAppTitle = () => {
  document.querySelector("head title")!.innerHTML = APP_TITLE;
};

const initAppInterface = () => {
  const container = document.querySelector<HTMLDivElement>("body")!
  ReactDOM.createRoot(container).render(<Providers />);
};

const bootstrap = () => {
  setAppTitle();
  initAppInterface();
};

bootstrap();
