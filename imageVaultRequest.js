
const ClientWrapper = require('./main.js')
class ImageVaultRequest {
	constructor(searchString) {
		this.searchString = searchString || ''
		this.clientWrapper = new ClientWrapper(this.searchString)
	}

	doRequest() {
		return new Promise((resolve, reject) => {
			this.clientWrapper.clientRequest(response => {
				const pictures = this.processRequest(response)
				resolve(pictures)
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

const vault = new ImageVaultRequest('alche')
vault.doRequest().then(res => {
	console.log(res)
})


module.exports = imageVault
