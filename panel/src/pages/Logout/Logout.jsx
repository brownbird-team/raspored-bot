import React from "react";
import "./Logout.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import routes from "../../data/routes.json";
import { useDispatch } from "react-redux";
import { removeLoginData } from "../../features/login";
import { useToken } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import API_HOST from "../../data/api";

const Logout = ({ logout }) => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useToken();

    const handleSetLogout = async() => {

        const postLogout = async() => {
			const res = await fetch(`${API_HOST}/api/admin/logout`, {
				headers: {
					"Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                    "Authorization" : `Bearer ${token}`
				},
				method: "POST"
			});

			const result = await res.json();

            if (result.code === 200) {
                logout();
				dispatch(removeLoginData());
				navigate(routes.login.path);
            }
		}

		await postLogout();
    }

    return <MainLayout pageItems={["Odjava"]}>
        <div className="logout-main">
            <Component.Header>
                <span>Želite li se odjaviti ?</span>
            </Component.Header>
            <Component.Footer>
                <Component.PrimaryButton type="button" onClick={handleSetLogout}>Odjava</Component.PrimaryButton>
            </Component.Footer>
        </div>
    </MainLayout>;
};

export default Logout;
