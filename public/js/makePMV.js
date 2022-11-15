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

const newFile = async (position, file = null) => {
  let fileData = undefined

  // if the function is called from the page this runs
  if (file === null) {
    [fileHandle] = await window.showOpenFilePicker(pickerOpts)
    fileData = await fileHandle.getFile()
  }

  // if the function is called from newDir() this runs
  if (file !== null) fileData = await file.getFile()

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

// NOTE: newDir() calls newFile() for each file
// in the imported directory. sloppy approach but works for now
const newDir = async (position) => {
  let dirHandle = await window.showDirectoryPicker()
  for await (const entry of dirHandle.values()) {
    newFile(position, entry)
  }
}

// TODO: 
// - move this into newFile()
// - display info independently of adding a file
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
    // TODO: 
    // - seperate mid image switch from sides image switch
    // - call a new image on set times or on a set timer
    loopProcedure(loops)
    // TODO: set dropToggle to true on random chance or other condition
    // then turn it back off before the next image switch
    loops++
  }

  // changes the images on screen when called upon from the loop
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