import React from 'react'
import PropTypes from 'prop-types'

const Image = ({ image, description }) => (
	<div className="image square">
		{image}
		<span>{description}</span>
	</div>
)

Image.propTypes = {
	image: PropTypes.string,
	description: PropTypes.string
}

export default Image
