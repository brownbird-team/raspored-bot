import React, { useState } from "react";
import "./InputField.css";

const InputField = ({ type, name, placeholder, onClick }) => {
    const [input, setInput] = useState("");
    return (
        <div className="input-field">
            <input type={type} placeholder={placeholder} onChange={(e) => setInput(e.target.value)} />
            <button type="button" onClick={() => onClick(input)}>
                {name}
            </button>
        </div>
    );
};

export default InputField;
