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

export const useClasses = () => {
	return useSelector((state) => state.classes.classes);
}

export const useClassesShift = () => {
	return useSelector((state) => state.classes.classesByShift);
}

export const useShifts = () => {
	return useSelector((state) => state.shifts.shifts);
}

export const useChangeId = () => {
	return useSelector((state) => state.change.changeId);
}