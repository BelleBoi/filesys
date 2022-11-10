const pickerOpts = {
	types: [
		{
			description: "clips",
			accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
		}
	],
	excludeAcceptAllOption: true,
	multiple: false
}

let fileHandle, fileLeft, fileMiddle, fileRight

async function getFile(position) {
	[fileHandle] = await window.showOpenFilePicker(pickerOpts)
	const fileData = await fileHandle.getFile()
	switch (position) {
		case 'left':
			fileLeft = fileData
			break
		case 'middle':
			fileMiddle = fileData
			break
		case 'right':
			fileRight = fileData
			break
		default:
			alert('something went wrong: app.js line 29')
	}
	console.log(fileData)
}