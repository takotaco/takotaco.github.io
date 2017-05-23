import { connect } from 'react-redux'
import { changeTab } from '../actions'
import Header from '../components/header'

const mapStateToProps = (state) => {
	return {
		currentTab: state.currentTab,
		tabs: state.tabs
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onClickTab: (tabName) => {
			dispatch(changeTab(tabName))
		}
	}
}

const HeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Header)

export default HeaderContainer
