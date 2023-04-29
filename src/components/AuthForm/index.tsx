import React from "react";
import {useDisclosure} from "@mantine/hooks";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import styles from "./index.module.scss";

const AuthForm = () => {
  const [loginForm, handlers] = useDisclosure(false);
  const renderForm = () => !loginForm
    ? <SignInForm toggle={handlers.toggle}/>
    : <SignUpForm toggle={handlers.toggle}/>;

  return (
    <div className={styles.wrapper}>
      {renderForm()}
    </div>
  );
};

export default AuthForm;
