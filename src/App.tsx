import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { APP_TITLE } from "./constants/AppTitle";
import {MantineProvider} from '@mantine/core';
import AuthForm from "./components/AuthForm";
import TasksList from "./components/TasksList";
import styles from "./index.module.scss";
import "./index.scss";
import {useUserStore} from "./stores/userStore";
import {shallow} from "zustand/shallow";

const App = () => {
  const [user] = useUserStore(
    (state) => [state.user],
    shallow
  );

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
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <App/>
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
