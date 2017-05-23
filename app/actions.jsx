export const constants = {
	CHANGE_TAB: 'CHANGE_TAB'
}

export const changeTab = (tab) => {
	return {
		type: constants.CHANGE_TAB,
		payload: tab
	}
}
