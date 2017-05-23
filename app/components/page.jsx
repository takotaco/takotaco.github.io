import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import PageNotFound from './page-not-found'
import Image from './image'

const buildImages = (data) => {
	return _.map(data, (datum, i) => {

		return (
			<Image key={i} image={datum.image} description={datum.description} />
		)
	})
}

const Page = ({ data }) => {
	const images = buildImages(data)

	if (data) {
		return (
			<div className="page">
				{images}
			</div>
		)
	}
	else {
		return (
			<PageNotFound />
		)
	}
}

Page.propTypes = {
	data: PropTypes.array
}

export default Page
