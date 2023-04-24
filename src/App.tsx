import * as React from "react";
import * as ReactDOM from "react-dom";
import { APP_TITLE } from "./constants/AppTitle";
import {Container, MantineProvider, Text} from '@mantine/core';
import AuthForm from "./components/AuthForm";
import styles from "./index.module.scss";
import "./index.scss";

const App = () => {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Container className={styles.container}>
        <AuthForm/>
      </Container>
    </MantineProvider>
  );
};

const setAppTitle = () => {
  document.querySelector("head title")!.innerHTML = APP_TITLE;
};

const initAppInterface = () => {
  const container = document.querySelector<HTMLDivElement>("#main")!
  ReactDOM.render(<App/>, container);
};

const bootstrap = () => {
  setAppTitle();
  initAppInterface();
};

bootstrap();
