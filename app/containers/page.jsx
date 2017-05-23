import { connect } from 'react-redux'
import Page from '../components/page'

const mapStateToProps = (state) => {
	return {
		data: state.data[state.currentTab]
	}
}

const PageContainer = connect(
	mapStateToProps
)(Page)

export default PageContainer
