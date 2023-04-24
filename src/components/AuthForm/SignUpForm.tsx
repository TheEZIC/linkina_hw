import React, {FC} from 'react';
import {Button, Card, Flex, Input, PasswordInput, Title} from "@mantine/core";

export type SignUpFormProps = {
  toggle: () => void;
};

const SignUpForm: FC<SignUpFormProps> = ({ toggle }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: "400px" }}>
      <Flex direction={"column"} gap={"sm"}>
        <Title order={3}>Регистрация</Title>
        <Input.Wrapper
          label={"Логин"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите логин"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Имя"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите имя"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Фамилия"}
          withAsterisk={true}
          required={true}
        >
          <Input placeholder={"Введите фамилию"}/>
        </Input.Wrapper>
        <Input.Wrapper
          label={"Пароль"}
          withAsterisk={true}
          required={true}
        >
          <PasswordInput placeholder={"Введите пароль"}/>
        </Input.Wrapper>
        <Flex justify={"space-between"}>
          <Button color="green">Зарегистрироваться</Button>
          <Button color="yellow" onClick={toggle}>Авторизация</Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default SignUpForm;
