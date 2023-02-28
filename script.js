//setting image and canvas size 
const maxImgheight = 300;
const padding_between_images = 10;




//create a hidden floating window
let floatingWindow = document.createElement("div");

floatingWindow.setAttribute("id", "floatingwindow");
floatingWindow.style.position = "fixed";
floatingWindow.style.display = "none";
floatingWindow.style.zIndex = "100";
floatingWindow.style.padding = "10px";
floatingWindow.style.width = "200px";
floatingWindow.style.backgroundColor = "white";
floatingWindow.style.border = "1px solid black";
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

var canvas = null
function toggle_images(event) {
  console.log(event.target.src);
  if (event.target.style.filter === "grayscale(80%) opacity(0.7)") {
    // Remove the image from the list
    const index = highlightedImages.indexOf(event.target);
    if (index > -1) {
      highlightedImages.splice(index, 1);
    }
    event.target.style.filter = '';
    event.target.style.zIndex = 2;
  } else {
    // Add the image to the list
    highlightedImages.push(event.target);
    event.target.style.filter = 'grayscale(80%) opacity(0.7)';
    event.target.style.zIndex = 2;
  }
}
var highlightedImages = [];

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
  else if (event.target.tagName === "IMG") {
    toggle_images(event);
    generate_floating_windows(event);
  }
  
});

//download selected images in a grid
function generate_photo_grid(imgPerRow, canvas) {
  var ctx = canvas.getContext("2d");
  const numOfImgs = highlightedImages.length;
  var x = 0;
  var y = 0;

  for (var i = 0; i < highlightedImages.length; i++) {
    const scale = maxImgheight / highlightedImages[i].height;
    const width = highlightedImages[i].width * scale;
    ctx.drawImage(highlightedImages[i], x, y, width, maxImgheight);
    x += width+padding_between_images;
    x = Math.floor(x)
    if ((i+1) % imgPerRow == 0) {
      x = 0;
      y += maxImgheight + padding_between_images;
      y = Math.floor(y)
    }
  }
  console.log("canvas created");
}
function get_canvas_height_and_width(numPicPerRow) {
    let height = 0;
    let width = 0;
    let current_row_width = 0;
    let rowCount = 1;
    //loop thought each image
    for (var i = 0; i < highlightedImages.length; i++) {
        //when current image is add to a new row
        if ((i+1) % numPicPerRow == 0) {
            height += maxImgheight;
            current_row_width = 0;
            rowCount++;
        }
        //get scale make height == maxImgheight
        const scale = maxImgheight / highlightedImages[i].height;
        //scale width 
        const scaledWidth = highlightedImages[i].width * scale;
        current_row_width += scaledWidth;
        width = width < current_row_width ? current_row_width : width;
        }
    return {height: height, width: width, rowCount: rowCount};
}

function create_an_canvas(setting) {
  let canvas = document.createElement("canvas");
  canvas.width = setting.width + (setting.rowCount-1) * padding_between_images;
  canvas.height = setting.height + (setting.rowCount-1) * padding_between_images;
  canvas.style.display = "none";
  canvas.style.zIndex = "100000"; // just a large enough number
  canvas.style.position = "fixed";
  canvas.style.border = "1px solid black";
  canvas.id = "myCanvas";
  const parentElement = document.getElementsByTagName("body")[0];
  parentElement.appendChild(canvas);
  return canvas;
}


// download created canvas
function download_canvas(e) {
  //if value not define then set to 1
  const numPicPerRow = document.getElementById("numPicPerRow").value ? document.getElementById("numPicPerRow").value : 1;
// const numPicPerRow = document.getElementById("numPicPerRow").value;
  // updateFloatingWindowPos = false;
  console.log("numPicPerRow: " + numPicPerRow);

  //get canvas height and width
  const canvasSetting = get_canvas_height_and_width(numPicPerRow);
  canvas = create_an_canvas(canvasSetting);
  generate_photo_grid(numPicPerRow, canvas);
  try {
    canvas.toBlob(function (blob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "my-image.png";
      link.click();
    });
  }
    catch (e) {
        canvas.style.display="block";
        canvas.style.left = e.clientX + "px";
        canvas.style.top = e.clientY + "px";
        alert( "cannot download canvas due to image from external source, generated on the webpage instead" );
    }
//    highlightedImages = [];
}
downloadButton.addEventListener("click", download_canvas);
