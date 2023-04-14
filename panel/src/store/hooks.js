import { useSelector } from "react-redux";

export const useLogin = () => {
	return useSelector((state) => state.login.value);
}