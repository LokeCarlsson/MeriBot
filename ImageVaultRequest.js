
const ClientWrapper = require('./main.js')
class ImageVaultRequest {
	constructor(searchString, size) {
		this.searchString = searchString || ''
		this.clientWrapper = new ClientWrapper(this.searchString, size)
	}

	doRequest() {
		return new Promise((resolve, reject) => {
			this.clientWrapper.clientRequest(response => {
				try {
					const pictures = this.processRequest(response)
					resolve(pictures)
				} catch (error) {
					reject(error)
				}
			})
		})
	}

	processRequest(response) {
		if (response.length === 0 || response === null) {
			throw new Error(`No pictures has the tag ${this.searchString} `)
		}

		return response.map(picture => picture.MediaConversions[0])
	}
}

module.exports = ImageVaultRequest
