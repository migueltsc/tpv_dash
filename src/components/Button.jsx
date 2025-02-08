import React from "react";
import styles from "./Button.module.css";

const Button = ({ children, onClick, variant = "default" }) => {
  let buttonClass = styles.button;

  if (variant === "primary") {
    buttonClass = `${styles.button} ${styles.primary}`;
  } else if (variant === "secondary") {
    buttonClass = `${styles.button} ${styles.secondary}`;
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
