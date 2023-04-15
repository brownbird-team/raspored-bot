import { useSelector } from "react-redux";

export const useLogin = () => {
	return useSelector((state) => state.login.value);
}

export const useTheme = () => {
	return useSelector((state) => state.theme.value);
}

export const useLeftsidebar = () => {
	return useSelector((state) => state.leftSidebar.value);
}