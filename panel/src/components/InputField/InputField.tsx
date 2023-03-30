import React from "react";
import "./InputField.css";

interface Props {
  type: "text" | "email" | "password" | "file";
  name: string;
  placeholder?: string;
}

const InputField = ({ type, name, placeholder }: Props) => {
  return (
    <div className="input-field">
      <input type={type} placeholder={placeholder} />
      <button type="button">{name}</button>
    </div>
  );
};

export default InputField;
