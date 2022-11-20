const pickerOpts = {
	types: [
		{
			description: "media",
			accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        'video/*': ['.mp4']
      }
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
let sides = []
let middle = []
let middleDrops = []

// NOTE: these render file info if there is more than 0 elements in 
// the respective array. Currently useless
if (sides.length > 0) sides.forEach(file => renderFileInfo(file, "sides"))
if (middle.length > 0) middle.forEach(file => renderFileInfo(file, "middle"))
if (middleDrops.length > 0) middleDrops.forEach(file => renderFileInfo(file, "middleDrops"))

const clearFilesInColumn = (position) => {
  // TODO https://github.com/z-pattern-matching/z
  // i insist we implement this library later down
  // the line for moments like this & the newFile() switch
  if (position === "sides") sides = []
  if (position === "middle") middle = []
  if (position === "middleDrops") middleDrops = []

  // i wanted it to look cleaner
  // what have i done D:
  // position === "sides" ? sides = []
  // : position === "middle" ? middle = []
  // : position === "middleDrops" ? middleDrops = []
  // : alert("you were never supposed to see this popup wtf did you do")
}

const clearAllFiles = () => sides = middle = middleDrops = []

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
      renderFileInfo(fileData, 'sides')
      break
    case 'middle':
      middle.push(URL.createObjectURL(fileData))
      renderFileInfo(fileData, 'middle')
      break
    case 'middleDrops':
      middleDrops.push(URL.createObjectURL(fileData))
      renderFileInfo(fileData, 'middleDrops')
      break
    default:
      alert('make-pmv newFile() switch default case')
  }
  // NOTE console log
  // console.log(middle, sides, middleDrops)
}

// NOTE: newDir() calls newFile() for each file
// in the imported directory. sloppy approach but works for now
const newDir = async (position) => {
  let dirHandle = await window.showDirectoryPicker()
  for await (const entry of dirHandle.values()) {
    newFile(position, entry)
  }
}

// render file info & control buttons for each file added
const renderFileInfo = (file, position) => {
  // root div in which this gets rendered
  // depends on which column the file gets uploaded to
  let parentContainer = document.getElementById(position)
  
  // generate div for displaying file info and controls
  // one is made for each uploaded file
  let fileInfoDiv = document.createElement('div') // one for each file added to any array
  let fileInfoDivID = generateFileInfoDivID() // used for de-rendering fileInfoDiv
  fileInfoDiv.setAttribute('id', fileInfoDivID)
  parentContainer.appendChild(fileInfoDiv)

  // generate p tag that displays file name inside fileInfoDiv
  let fileName = document.createElement('p')
  let name = document.createTextNode(file.name)
  fileName.appendChild(name)
  fileInfoDiv.appendChild(fileName)

  // create & render delete button for rendered file info div
  let deleteButton = document.createElement('button')
  console.log(name)

  /* VERY BIG TODO */
  /* for some damn reason I can not pass the filename, file or position/column
  which the file is in. All I get is Uncaught SyntaxError: Unexpected identifier 'Text'.
  And if I try to pass the file itself I get the same but with 'File' at the end. 
  I am trying to pass this parameter because I later need to figure out which of the files
  is getting delete from the array (for the same reason position/column is needed).
  So far this does not seem like the way to do it. 

  clearThisFile(infoDiv, file, position) does 3 ifs to check which column the selected-for-deletion file
  is in. Yes, disgusting way of doing it, idc. For this the position let is also passed.
  Which, just like file or file.name throws an error. For this variable to be available I'd have to 
  redo some things I don't have the energy for right now.

  possible solutions --

  - Try upon uploading a file create an object inside sides/middle/middleDrops array with all the data being 
  created in renderFileInfo(). Then use this array of data to generate the html
  in a cleaner manner. Possibly this will end me up with the same SyntaxError
  + JSON files could be useful for this + i plan on including json files eventually
  anyway for the purpose of giving the user more control over the files.

  - The other and much more clear headed reasonable solution is to rewrite this whole thing
  inside app.js using https://github.com/remy/min.js and https://github.com/z-pattern-matching/z
  pray to god I wake up the next day with the main app hosted on a nodejs server. 
  
  min.js is a minimalist library that lets you fuck around with the DOM. My ignorant judgement
  tells me this library will fit seamlessly in this pure js design/coding style this project
  has so far. And it will massively simplify this exact function. Will likely still need to implement
  the file object anyway. But the whole program will be cleaner once I do.

  z pattern matching because pattern matching. Pattern matching doesn't need to prove itself to you.
  You need to prove yourself to pattern matching. 

  - ask on stackoverflow

  - get absolutely dunked on because I missed the simple and obvious solution to this.
  in this case you probably didn't get this far.

  --

  in the end solution 2 is inevitable when we switch to a nodejs server fully

  Before I get into this I'm gonna need to implement what I already have into the main
  GoonTok repo so that'll be the first thing
  */
  deleteButton.setAttribute('onClick', `clearThisFile(${fileInfoDivID}, ${file}, ${position})`) 
  // strangely sending fileInfoID gives the DOM element instead of the ID
  let btnText = document.createTextNode('X')
  deleteButton.appendChild(btnText)
  fileInfoDiv.appendChild(deleteButton)
}

/* generates a 3 character string ID for the div rendering the
file info. This id will be used to de-render any entries upon removal
TODO: find a cleaner way to do this, this mess can't be the only way to do it */
const generateFileInfoDivID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for ( var i = 0; i < 3; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/* FIXME: can only remove the DOM element right now
needs to also remove file from the respective array
however passing the file and array to the function 
as it is now will return an error */
const clearThisFile = (infoDiv,file, position) => {
  // infoDiv.remove()
  console.log(position)

  // TODO: do this cleaner. very ugly
  // if (position === 'sides') {
  //   const index = sides.indexOf(file)
  //   if (index > -1) sides.splice(index, 1)
  // }
  // if (position === 'middle') {
  //   const index = middle.indexOf(file)
  //   if (index > -1) middle.splice(index, 1)
  // }
  // if (position === 'middleDrops') {
  //   const index = middleDrops.indexOf(file)
  //   if (index > -1) middleDrops.splice(index, 1)
  // }
}

const generate = () => { 
  document.getElementById("setupDiv").hidden = true
  document.getElementById("pmv-loader").hidden = false

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
  document.getElementById("pmv-loader").hidden = true
  document.getElementById("setupDiv").hidden = false
  left.src, mid.src, right.src = "#"
 }
