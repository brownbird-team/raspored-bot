import React from "react";
import "./Logout.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import { useDispatch } from "react-redux";
import { setLogout } from "../../features/login";

const Logout = () => {
    const dispatch = useDispatch();

    const handleSetLogout = () => {
        dispatch(setLogout());
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
