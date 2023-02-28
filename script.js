//create a hidden floating window
let floatingWindow = document.createElement("div");

floatingWindow.setAttribute("id", "floatingwindow");
floatingWindow.style.position = "fixed";
floatingWindow.style.display = "none";
floatingWindow.style.zIndex = "100";
var updateFloatingWindowPos = true;
//create a number field
const InputLabel = document.createElement("label");
InputLabel.innerText = "Enter # pic on one row:";
const numberInput = document.createElement("input");
numberInput.setAttribute("type", "number");
numberInput.id = "numPicPerRow";

//create a selected counter
const selectedCounter = document.createElement("label");
selectedCounter.id = "selectedCounter";
// Create a button element
const downloadButton = document.createElement("button");
downloadButton.setAttribute("type", "button");
// Set the text of the button to 'Download'
downloadButton.innerText = "Download";

//add all to floating window
floatingWindow.appendChild(selectedCounter);
floatingWindow.appendChild(InputLabel);
floatingWindow.appendChild(numberInput);
floatingWindow.appendChild(downloadButton);
document.body.appendChild(floatingWindow);

function toggle_images(event) {
  console.log(event.target.src);
  if (event.target.classList.contains("highlighted")) {
    // Remove the image from the list
    const index = highlightedImages.indexOf(event.target);
    if (index > -1) {
      highlightedImages.splice(index, 1);
    }
    event.target.classList.remove("highlighted");
  } else {
    // Add the image to the list
    highlightedImages.push(event.target);
    event.target.classList.add("highlighted");
  }
}
const highlightedImages = [];

function generate_floating_windows(e) {
  if (highlightedImages.length > 0) {
    //show the floating window
    selectedCounter.innerText = "Selected: " + highlightedImages.length;
    floatingWindow.style.display = "block";
    const x = e.clientX;
    const y = e.clientY;
    console.log(x);
    console.log(y);
    //set the new postion
    if (updateFloatingWindowPos) {
      floatingWindow.style.left = x + "px";
      floatingWindow.style.top = y + "px";
    }
  } else {
    floatingWindow.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  if (event.target.id === "floatingwindow") {
    //do nothing
  }
  if (event.target.tagName === "IMG") {
    toggle_images(event);
    generate_floating_windows(event);
  }
});
//download selected images in a grid
function generate_canvas(imgPerRow, canvas) {
  var ctx = canvas.getContext("2d");
  const numOfImgs = highlightedImages.length;
  var x = 0;
  var y = 0;
  var width = canvas.width / imgPerRow;
  const colNum = numOfImgs / imgPerRow;
  var height = canvas.height / colNum;

  for (var i = 0; i < highlightedImages.length; i++) {
    ctx.drawImage(highlightedImages[i], x, y, width, height);
    x += width;
    if (x >= canvas.width) {
      x = 0;
      y += height;
    }
  }
  console.log("canvas created");
}
function create_an_canvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  canvas.style.display = "none";
  const parentElement = document.getElementsByTagName("body")[0];
  parentElement.appendChild(canvas);
  return canvas;
}

//TODO: select img first then create the canvas, fit into a min 300 length grid

// download created canvas
function download_canvas() {
  // Get the value of numPicPerRow
  const numPicPerRow = document.getElementById("numPicPerRow").value;
  // updateFloatingWindowPos = false;
  console.log("numPicPerRow: " + numPicPerRow);
  const canvas = create_an_canvas();
  generate_canvas(numPicPerRow, canvas);
  try {
    canvas.toBlob(function (blob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "my-image.png";
      link.click();
    });
  }
    catch (e) {
        alert("cannot download canvas due to image from external source, generated on the webpage instead")
        canvas.style.display="block";
    }
}
downloadButton.addEventListener("click", download_canvas);
