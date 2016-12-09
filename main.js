const ImageVault = require("./imagevault.client")

class ClientWrapper {
	constructor(searchString, service) {
		this.core = new ImageVault.Client({
		core: "http://iv5qa.azurewebsites.net/apiv2",
		username: "hackathon",
		password: "ImageVault2016"
		})

		this.service = service || "MediaService/Find"
		this.searchString = searchString || ''
	}

	clientRequest(callback) {
		const clientConfig = this.clientRequestConfig(this.searchString)

		// passing callback so I can use promises
		this.core.json(this.service, clientConfig, callback)
	}

	clientRequestConfig(searchString) {
		return {
		  MediaUrlBase: "http://iv5qa.azurewebsites.net/",
		  Populate: {
			PublishIdentifier: "hackathon",
			MediaFormats: [{
				$type : "ImageVault.Common.Data.ThumbnailFormat,ImageVault.Common",
				Effects : [{
					$type : "ImageVault.Common.Data.Effects.ResizeEffect,ImageVault.Common",
					"Width" : 200,
					"Height" : 200,
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