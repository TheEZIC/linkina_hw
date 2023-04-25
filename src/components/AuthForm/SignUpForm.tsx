import React, {FC} from 'react';
import {Button, Card, Flex, Input, PasswordInput, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import backend from "../../backend";

type SignUpFormType = {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type SignUpFormProps = {
  toggle: () => void;
};

const SignUpForm: FC<SignUpFormProps> = ({ toggle }) => {
  const form = useForm<SignUpFormType>({
    initialValues: {
      login: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const signUp = async () => {
    const { login, password, firstName, lastName } = form.values;

    if (!login || !password || !firstName || !lastName) {
      return;
    }

    const signUpData = await backend.register(login, password, `${firstName} ${lastName}`);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "400px" }}>
      <Flex direction={"column"} gap={"sm"}>
        <Title order={3}>Регистрация</Title>
        <Input.Wrapper
          label={"Логин"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("login")}
        >
          <Input placeholder={"Введите логин"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Имя"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("firstName")}
        >
          <Input placeholder={"Введите имя"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Фамилия"}
          withAsterisk={true}
          required={true}
          {...form.getInputProps("lastName")}
        >
          <Input placeholder={"Введите фамилию"}/>
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
          <Button color="green" onClick={signUp}>Зарегистрироваться</Button>
          <Button color="yellow" onClick={toggle}>Авторизация</Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SignUpForm;
