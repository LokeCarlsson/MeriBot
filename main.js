const ImageVault = require("./imagevault.client")

class ClientWrapper {
	constructor(searchString, size, service) {
		this.core = new ImageVault.Client({
		core: "http://iv5qa.azurewebsites.net/apiv2",
		username: "hackathon",
		password: "ImageVault2016"
		})

		this.service = service || "MediaService/Find"
		this.searchString = searchString || ''
		this.size = size || ''
		this.width = 0
		this.height = 0
	}

	clientRequest(callback) {
		const clientConfig = this.clientRequestConfig(this.searchString)

		// passing callback so I can use promises
		this.core.json(this.service, clientConfig, callback)
	}

	setResolution() {
		switch(this.size) {
			case 'small':
				this.width = 240
				this.height = 160
				break;
			case 'large':
				this.width = 1280
				this.height = 720
				break;
			case 'hd':
					this.width = 1920
					this.height = 1080
					break;
			default:
				this.width = 720
				this.height = 480
		}
	}

	clientRequestConfig(searchString) {
		this.setResolution()
		return {
		  MediaUrlBase: "http://iv5qa.azurewebsites.net/",
		  Populate: {
			PublishIdentifier: "hackathon",
			MediaFormats: [{
				$type : "ImageVault.Common.Data.ThumbnailFormat,ImageVault.Common",
				Effects : [{
					$type : "ImageVault.Common.Data.Effects.ResizeEffect,ImageVault.Common",
					"Width" : this.width,
					"Height" : this.height,
					"ResizeMode" : "ScaleToFill"
				  }],
			  }
			],
			Metadata: [{
				Filter: {
					MetadataDefinitionType : "User"
				}
			}]
		},
		  "Filter" : {
			"SearchString" : searchString
		  }
		}
	}
}

module.exports = ClientWrapper
