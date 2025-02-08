import React from "react";
import styles from "./Input.module.css";

const Input = ({ label, type, value, onChange, error }) => {
  let inputClass = styles.input;

  if (error) {
    inputClass = `${styles.input} ${styles.error}`;
  }

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={label}>
        {label}:
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </div>
  );
};

export default Input;
