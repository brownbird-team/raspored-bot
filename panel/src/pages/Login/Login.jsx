import React, { useState } from "react";
import "./Login.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
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
            <ComponentHeader>
                <span>Prijavi se</span>
            </ComponentHeader>
			<ComponentBody className="login-body">
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
			</ComponentBody>
			<ComponentFooter>
				<PrimaryButton type="button" onClick={handleOnLogin}>Prijavi se</PrimaryButton>
			</ComponentFooter>
        </div>
    );
};

export default Login;
