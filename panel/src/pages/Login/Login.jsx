import React, { useState } from "react";
import "./Login.css";
import * as Component from "../../components";
import { useDispatch } from "react-redux";
import { setLogin } from "../../features/login";
import { useNavigate } from "react-router-dom";
import routes from "../../data/routes.json";
import LoginData from "./utils/LoginData";

const Login = () => {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loginData, setLoginData] = useState(new LoginData());

	const handleSetUsername = (value) => {
		setLoginData(loginData.setUsername(value));
	}

	const handleSetPassword = (value) => {
		setLoginData(loginData.setPassword(value));
	}

	const handleOnLogin = () => {
		if (loginData.validate()) {
			dispatch(setLogin());
			navigate(routes.schedule.import.path);
		}
	}

    return (
        <div className="login-main">
            <Component.Header>
                <span>Prijavi se</span>
            </Component.Header>
			<Component.Body className="login-body">
				<input 
					type="text" 
					className="custom-input-box" 
					placeholder="Korisničko ime"
					onChange={(e) => handleSetUsername(e.target.value)} 
					required
				/>
				<input 
					type="password" 
					className="custom-input-box" 
					placeholder="Lozinka" 
					onChange={(e) => handleSetPassword(e.target.value)}
					required 
				/>
			</Component.Body>
			<Component.Footer>
				<Component.PrimaryButton type="button" onClick={handleOnLogin}>Prijavi se</Component.PrimaryButton>
			</Component.Footer>
        </div>
    );
};

export default Login;
