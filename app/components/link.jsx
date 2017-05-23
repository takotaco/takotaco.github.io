import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

const Link = ({onClick, text, selected}) => {
	const classes = classNames('link', {selected : selected})

	return (
		<span className={classes} onClick={(e) => {onClick(text)}}>{text}</span>
	)
}

Link.propTypes = {
	onClick: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired
}

export default Link
