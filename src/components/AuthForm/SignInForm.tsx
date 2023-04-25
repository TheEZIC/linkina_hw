import React, {FC} from 'react';
import {Button, Card, Flex, Input, PasswordInput, Space, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import backend from "../../backend";

type SignInFormType = {
  login: string;
  password: string;
};

export type SignInFormProps = {
  toggle: () => void;
};

const SignInForm: FC<SignInFormProps> = ({toggle}) => {
  const form = useForm<SignInFormType>({
    initialValues: {
      login: "",
      password: "",
    }
  });

  const signIn = async () => {
    const { login, password } = form.values;

    if (!login || !password) {
      return;
    }

    const loginData = await backend.login(login, password);
    console.log(loginData, "loginData");
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "400px" }}>
      <Flex direction={"column"} gap={"sm"}>
        <Title order={3}>Авторизация</Title>
        <Input.Wrapper
          label={"Логин"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("login")}
        >
          <Input placeholder={"Введите логин"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Пароль"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("password")}
        >
          <PasswordInput placeholder={"Введите пароль"}/>
        </Input.Wrapper>
        <Flex justify={"space-between"}>
          <Button color="green" onClick={signIn}>Войти</Button>
          <Button color="yellow" onClick={toggle}>Регистрация</Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SignInForm;
