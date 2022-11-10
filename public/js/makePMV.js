const pickerOpts = {
	types: [
		{
			description: "media",
			accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
		}
	],
	excludeAcceptAllOption: true,
	multiple: false
}

// TODO
const maxFileSize = null
const maxFolderSize = null
let totalSides = 0
let sizeSides = 0
let totalMiddle = 0
let sizeMiddle = 0
let totalMiddleDrops = 0
let sizeMiddleDrops = 0
// ---

let fileHandle
const sides = []
const middle = []
const middleDrops = []

const newFile = async (position) => {
  [fileHandle] = await window.showOpenFilePicker(pickerOpts)
  let fileData = await fileHandle.getFile()
  switch (position) {
    case 'sides':
      sides.push(URL.createObjectURL(fileData))
      showFileInfo(fileData, 'sides')
      break
    case 'middle':
      middle.push(URL.createObjectURL(fileData))
      showFileInfo(fileData, 'middle')
      break
    case 'middleDrops':
      middleDrops.push(URL.createObjectURL(fileData))
      showFileInfo(fileData, 'middleDrops')
      break
    default:
      alert('make-pmv newFile() switch default case')
  }
  console.log(middle, sides, middleDrops)
}

// TODO: move this into newFile()
const showFileInfo = (file, position) => {
  let textBox = document.createElement('p')
  let fileInfo = document.createTextNode(file.name)
  textBox.appendChild(fileInfo)
  document.getElementById(position).appendChild(textBox)
}

const generate = () => { 
  document.getElementById("setupDiv").hidden = true
  document.getElementById("pmvDiv").hidden = false

  const left = document.getElementById("left")
  const mid = document.getElementById("mid")
  const right = document.getElementById("right")

  let loops = 0
  let dropToggle = false // TODO: properly implement drops
  while (loops < 10) {
    loopProcedure(loops)
    // TODO: set dropToggle to true on random chance or other condition
    // then turn it back off before the next image switch
    loops++
  }

  function loopProcedure(i) {
    setTimeout(function() {
      left.src = sides[Math.floor(Math.random() * sides.length)]
      dropToggle === true // see above todo, currently never shows middleDrops[] images
        ? mid.src = middleDrops[Math.floor(Math.random() * middleDrops.length)]
        : mid.src = middle[Math.floor(Math.random() * middle.length)]
      right.src = left.src
    }, 2000 * i)
  }
 }

 const stop = () => {
  document.getElementById("pmvDiv").hidden = true
  document.getElementById("setupDiv").hidden = false
  left.src, mid.src, right.src = "#"
 }