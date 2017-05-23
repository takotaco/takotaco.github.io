import React from 'react'
import PropTypes from 'prop-types'
import Link from './link'
import _ from 'lodash'

const buildTabs = (currentTab, onClickTab, tabs) => {
	return _.map(tabs, (tab, i) => {
		const selected = (tab === currentTab)
		debugger
		
		return (
			<Link selected={selected} onClick={onClickTab} text={tab} key={i} />
		)
	})
}

const Header = ({ onClickTab, tabs, currentTab }) => {
	const tabElems = buildTabs(currentTab, onClickTab, tabs)

	return (
		<div className="header">
			<div className="logo">
				<img src="logo.png"></img>
			</div>
			<div className="menu">
				{tabElems}
			</div>
		</div>
	)
}

Header.propTypes = {
	onClickTab: PropTypes.func.isRequired
}

export default Header
