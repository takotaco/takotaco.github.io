import { constants } from './actions'
import { combineReducers } from 'redux'
import art from './data/art'

const tabs = (state = [], action) => {
	switch (action.type) {
	default:
		return ['ART', 'CODE', 'STORE', 'ABOUT']
	}
}

const currentTab = (state = 'ART', action) => {
	switch (action.type) {
	case constants.CHANGE_TAB:
		return action.payload
	default:
		return state
	}
}

const data = (state = {}, action) => {
	switch (action.type) {
	default:
		return {
			ART: art
		}
	}
}

const app = combineReducers({
	tabs,
	currentTab,
	data
})

export default app
