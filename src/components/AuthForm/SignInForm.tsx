import React, {FC} from 'react';
import {Button, Card, Flex, Input, PasswordInput, Space, Title} from "@mantine/core";
import {useForm} from "@mantine/form";

type LoginFormType = {
  login: string;
  password: string;
};

export type SignInFormProps = {
  toggle: () => void;
};

const SignInForm: FC<SignInFormProps> = ({toggle}) => {
  const form = useForm<LoginFormType>({
    initialValues: {
      login: "",
      password: "",
    }
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "400px" }}>
      <Flex direction={"column"} gap={"sm"}>
        <Title order={3}>Авторизация</Title>
        <Input.Wrapper
          label={"Логин"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите логин"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Пароль"}
          withAsterisk={true}
          required={true}
        >
          <PasswordInput placeholder={"Введите пароль"}/>
        </Input.Wrapper>
        <Flex justify={"space-between"}>
          <Button color="green">Войти</Button>
          <Button color="yellow" onClick={toggle}>Регистрация</Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SignInForm;
