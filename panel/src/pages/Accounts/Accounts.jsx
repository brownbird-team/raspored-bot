import React, { useState, useEffect } from "react";
import "./Accounts.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import LoginData from "../Login/utils/LoginData";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useToken, useUsers, useUserActive } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { addUsers } from "../../features/users";
import { MdDelete } from "react-icons/md";
import API_HOST from "../../data/api";

const Accounts = () => {

	const dispatch = useDispatch();
	const token = useToken();
	const users = useUsers();
	const userActive = useUserActive();

	const [userActivePassword, setUserActivePassword] = useState(null);
	const [newUser, setNewUser] = useState(new LoginData());
	const [updateTrigger, setUpdateTrigger] = useState(false);
	const [alert, setAlert] = useState(null);

	useEffect(() => {
        const getUsers = async() => {
            const res = await fetch(`${API_HOST}/api/admin/users`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
					"Authorization" : `Bearer ${token}`
                },
                method: "GET"
            });

            const users = await res.json();
            
			if (users.code === 200) {
				dispatch(addUsers(users.users));
			}			
        }

        getUsers();
	}, [updateTrigger]);

	const handleSetUserActivePassword = (value) => setUserActivePassword(value);

	const handleOnUpdateUserActivePassword = async() => {

		const putPassword = async() => {
			const res = await fetch(`${API_HOST}/api/admin/user`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                    "Authorization" : `Bearer ${token}`
                },
                method: "PUT",
				body: JSON.stringify({ userId: userActive.userId, password: userActivePassword })
            });

            const result = await res.json();

			switch (result.status) {
				case "error": {
					setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom ažuriranja lozinke</>));
					break;
				}
				case "ok": {
					setAlert(new NotificationSuccess(<>Lozinka je uspješno ažurirana za korisnika <b className="highlight">{userActive.username}</b></>))
					break;
				}
			}
		}

		await putPassword();
	}

	const handleSetNewUserUsername = (value) => setNewUser(newUser.setUsername(value));

	const handleSetNewUserPassword = (value) => setNewUser(newUser.setPassword(value));

	const handleAddNewUser = async() => {

		if (!newUser.validate()) 
			return setAlert(new NotificationWarning(<>Polja <b className="highlight">Naziv korisnika</b> i <b className="highlight">Lozinka</b> ne smiju biti prazna</>));
	
		const postNewUser = async() => {
			const res = await fetch(`${API_HOST}/api/admin/user`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                    "Authorization" : `Bearer ${token}`
                },
                method: "POST",
				body: JSON.stringify(newUser)
            });

            const result = await res.json();

			switch (result.code) {
				case 409: {
					setAlert(new NotificationWarning(<>Korisnik <b className="highlight">{newUser.getUsername()}</b> već postoji</>));
					break;
				}
				case 200: {
					setAlert(new NotificationSuccess(<>Uspješno je dodan novi korisnik <b className="highlight">{newUser.getUsername()}</b></>))
					setUpdateTrigger(!updateTrigger);
					break;
				}
				default: {
					setAlert(new NotificationWarning(<>Došlo je do pogreške, pokušajte kasnije</>));
				}
			}
		}

		await postNewUser();
	}

	const handleDeleteUser = async(userId) => {

		if (userId === userActive.userId)
			return setAlert(new NotificationWarning(<>Nije moguće obrisati aktivan korisnički račun</>));

		const deleteUser = async() => {
			const res = await fetch(`${API_HOST}/api/admin/user?id=${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                    "Authorization" : `Bearer ${token}`
                },
                method: "DELETE"
            });

            const result = await res.json();

			switch (result.code) {
				case 200: {
					setAlert(new NotificationSuccess(<>Uspješno je obrisan korisnički račun</>));
					setUpdateTrigger(!updateTrigger);
					break;
				}
				default: {
					setAlert(new NotificationWarning(<>Došlo je do pogreške, pokušajte kasnije</>));
				}
			}
		}

		await deleteUser();
	}

    return <MainLayout pageItems={["Postavke računa"]}>
		<div className="layout-space account-main">

			{alert ? (
				<Component.Alert type={alert.type} onClose={() => setAlert(null)}>
					{alert.message}
				</Component.Alert>
			) : null}

			<div className="my-account-edit">
				<Component.Header>
					<span>Promijeni lozinku korisnika <b className="custom-badge">{userActive.username}</b></span>
				</Component.Header>
				<Component.Body>
	
					<div className="my-account-change-password-container">
						<input 
							type="password" 
							className="custom-input-box"
							placeholder="Nova lozinka"
							onChange={(event) => handleSetUserActivePassword(event.target.value)} 
						/>
						<Component.SecondaryButton type="button" onClick={handleOnUpdateUserActivePassword}>
							Promijeni
						</Component.SecondaryButton>
					</div>
				</Component.Body>
			</div>

			<div className="account-add-user">
				<Component.Header>
					<span>Dodaj novog korisnika</span>
				</Component.Header>
				<Component.Body>
					<div className="account-add-user-container">
						<input 
							type="text" 
							className="custom-input-box"
							placeholder="Naziv korisnika"
							onChange={(event) => handleSetNewUserUsername(event.target.value)}
						/>
						<input 
							type="password" 
							className="custom-input-box"
							placeholder="Lozinka"
							onChange={(event) => handleSetNewUserPassword(event.target.value)}
						/>
					</div>
				</Component.Body>
				<Component.Footer>
					<Component.PrimaryButton type="button" onClick={handleAddNewUser}>
						Dodaj korisnika
					</Component.PrimaryButton>
				</Component.Footer>
			</div>

			<div className="accounts-view">
				<Component.Header>
					<span>Pregled svih korisničkih računa</span>
				</Component.Header>
				<Component.Body className="account-view-body">
					<table className="custom-table account-view-table">
						<thead>
							<tr>
								<th>Korisničko ime</th>
								<th>Obirši račun</th>
							</tr>
						</thead>
						<tbody>
							{users.map(({ userId, username }, index) => (
								<tr key={index}>
									<td>{username}</td>
									<td>
										<MdDelete 
											size={25} 
											className="delete icon"
											onClick={() => handleDeleteUser(userId)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Component.Body>
			</div>

		</div>
	</MainLayout>;
};

export default Accounts;
