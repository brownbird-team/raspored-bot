import { useSelector } from "react-redux";


/* -- Definirani hooks za pristupanje vrijednostima stora -- */


export const useToken = () => {
	return useSelector((state) => state.login.token);
}

export const useUserActive = () => {
	return useSelector((state) => state.login.userActive);
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

export const useChanges = () => {
	return useSelector((state) => state.change.changes);
}

export const useChangeId = () => {
	return useSelector((state) => state.change.changeId);
}

export const useChangeMorning = () => {
	return useSelector((state) => state.change.changeMorning);
}

export const useChangeShift = () => {
	return useSelector((state) => state.change.changeShift);
}

export const useChangeEdit = () => {
	return useSelector((state) => state.change.changeEdit);
}

export const useUsers = () => {
	return useSelector((state) => state.users.users);
}