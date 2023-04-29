import React, {FC} from 'react';
import {Button, Card, Flex, Input, PasswordInput, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useUserContext} from "../../contexts/user-context";

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
  const {setUser} = useUserContext();
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

    const signUpData = await window.API.register(login, password, `${firstName} ${lastName}`);
    setUser(signUpData);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "400px" }}>
      <Flex direction={"column"} gap={"sm"}>
        <Title order={3}>Регистрация</Title>
        <Input.Wrapper
          label={"Логин"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите логин"} {...form.getInputProps("login")}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Имя"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите имя"} {...form.getInputProps("firstName")}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Фамилия"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите фамилию"} {...form.getInputProps("lastName")}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Пароль"}
          withAsterisk={true}
          required={true}
        >
          <PasswordInput placeholder={"Введите пароль"} {...form.getInputProps("password")}/>
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
