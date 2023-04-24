import * as React from "react";
import * as ReactDOM from "react-dom";
import { APP_TITLE } from "./constants/AppTitle";
import { MantineProvider, Text } from '@mantine/core';

const App = () => {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Text>Welcome to Mantine!</Text>
    </MantineProvider>
  );
};

const setAppTitle = () => {
  document.querySelector("head title").innerHTML = APP_TITLE;
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
