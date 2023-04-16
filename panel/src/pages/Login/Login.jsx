import React, { useState } from "react";
import "./Login.css";
import * as Component from "../../components";
import { useDispatch } from "react-redux";
import { saveLoginData } from "../../features/login";
import { useNavigate } from "react-router-dom";
import { NotificationWarning } from "../../services/Notification";
import routes from "../../data/routes.json";
import LoginData from "./utils/LoginData";
import API_HOST from "../../data/api";

const Login = ({ login }) => {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loginData, setLoginData] = useState(new LoginData());
	const [alert, setAlert] = useState(null);

	const handleSetUsername = (value) => {
		setLoginData(loginData.setUsername(value));
	}

	const handleSetPassword = (value) => {
		setLoginData(loginData.setPassword(value));
	}

	const handleOnLogin = async() => {
		
		if (!loginData.validate()) return;
		
		const postLogin = async() => {
			const res = await fetch(`${API_HOST}/api/admin/login`, {
				headers: {
					"Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
				},
				method: "POST",
				body: JSON.stringify(loginData)
			});

			const result = await res.json();

			switch (result.code) {
				case 400: {
					setAlert(new NotificationWarning(<>Polja <b className="highlight">Korisničko ime</b> ili <b className="highlight">lozinka</b> ne smiju biti prazna</>));
					break;
				}
				case 401: {
					setAlert(new NotificationWarning(<><b className="highlight">Korisničko ime</b> ili <b className="highlight">lozinka</b> su neispravni</>));
					break;
				}
				case 200: {
					login();
					dispatch(saveLoginData({ token: result.token, username: loginData.getUsername() }));
					navigate(routes.changes.path);
					break;
				}
				default: {
					setAlert(new NotificationWarning(<>Došlo je do pogreške, pokušajte kasnije</>));
					break;
				}
			}
		}

		await postLogin();
	}

    return (
        <div className="login-main">
			{alert ? <Component.Alert type={alert.type} onClose={() => setAlert(false)}>{alert.message}</Component.Alert> : null}
            
			<div className="login-box">

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
        </div>
    );
};

export default Login;
