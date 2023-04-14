import React from "react";
import "./Logout.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import { useDispatch } from "react-redux";
import { setLogout } from "../../features/login";

const pageItems = ["Odjava"];

const Logout = () => {
    const dispatch = useDispatch();

    const handleSetLogout = () => {
        dispatch(setLogout());
    }

    return <MainLayout pageItems={pageItems}>
        <div className="logout-main">
            <ComponentHeader>
                <span>Želite li se odjaviti ?</span>
            </ComponentHeader>
            <ComponentFooter>
                <PrimaryButton type="button" onClick={handleSetLogout}>Odjava</PrimaryButton>
            </ComponentFooter>
        </div>
    </MainLayout>;
};

export default Logout;
