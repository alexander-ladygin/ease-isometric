/*
  source: https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/master/src/helpers/convertColor.ts
*/

const namesRGB = ['r', 'g', 'b']

/**
 * this function converts figma color to RGB(A) (array)
 */

// RGBToWebRGB({r: 0.887499988079071, g: 0.07058823853731155, b: 0.0665624737739563})
//=> [226, 18, 17]

function RGBToWebRGB(color: RGBA): webRGBA
function RGBToWebRGB(color: RGB): webRGB
function RGBToWebRGB(color): any {
	const rgb = []

	namesRGB.forEach((e, i) => {
		rgb[i] = Math.round(color[e] * 255)
	})

	if (color['a'] !== undefined) rgb[3] = Math.round(color['a'] * 100) / 100
	return rgb
}

/**
 * this function converts RGB(A) color (array) to figma color
 */

// webRGBToRGB([226, 18, 17])
//=> {r: 0.8862745098039215, g: 0.07058823529411765, b: 0.06666666666666667}

function webRGBToRGB(color: webRGBA): RGBA
function webRGBToRGB(color: webRGB): RGB
function webRGBToRGB(color): any {
	const rgb = {}

	namesRGB.forEach((e, i) => {
		rgb[e] = color[i] / 255
	})

	if (color[3] !== undefined) rgb['a'] = color[3]
	return rgb
}

/**
 * this function converts figma color to HEX (string)
 */

// RGBToHex({ r: 0, g: 0.1, b: 1 })
//=> #001aff

function RGBToHex(color: RGB | RGBA): string {
	let hex = '#'

	const rgb = RGBToWebRGB(color) as webRGB | webRGBA
	hex += ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)

	if (rgb[3] !== undefined) {
		const a = Math.round(rgb[3] * 255).toString(16)
		if (a.length == 1) {
			hex += '0' + a
		} else {
			if (a !== 'ff') hex += a
		}
	}
	return hex
}

/**
 * this function converts HEX color (string) to figma color
 */

// hexToRGB(#001aff)
//=> { r: 0, g: 0.10196078431372549, b: 1 }

function hexToRGB(color: string): RGB | RGBA {
	let opacity = ''

	color = color.toLowerCase()

	if (color[0] === '#') color = color.slice(1)
	if (color.length === 3) {
		color = color.replace(/(.)(.)(.)?/g, '$1$1$2$2$3$3')
	} else if (color.length === 8) {
		const arr = color.match(/(.{6})(.{2})/)
		color = arr[1]
		opacity = arr[2]
	}

	const num = parseInt(color, 16)
	const rgb = [num >> 16, (num >> 8) & 255, num & 255]

	if (opacity) {
		rgb.push(parseInt(opacity, 16) / 255)
		return webRGBToRGB(rgb as webRGBA)
	} else {
		return webRGBToRGB(rgb as webRGB)
	}
}

export { RGBToWebRGB, webRGBToRGB, RGBToHex, hexToRGB }

type webRGB = [number, number, number]
type webRGBA = [number, number, number, number]