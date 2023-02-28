// ==UserScript==
// @name         Photo Grid Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate and download Image Grid from selected images. If not able to download the grid, it will display as a floating modal for download
// @author       Lamonkey
// @match        *://*/*
// @icon         https://cdn-icons-png.flaticon.com/512/9813/9813564.png
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";
    //setting image and canvas size
    const maxImgheight = 600;
    const padding_between_images = 10;
  
    //create a hidden floating window
    let floatingWindow = document.createElement("form");
    floatingWindow.setAttribute("id", "floatingwindow");
    floatingWindow.style.position = "fixed";
    floatingWindow.style.display = "none";
    floatingWindow.style.zIndex = "100";
    floatingWindow.style.padding = "10px";
    floatingWindow.style.width = "180px";
    floatingWindow.style.padding = "3px";
    floatingWindow.style.backgroundColor = "white";
    floatingWindow.style.border = "1px solid black";
  
    //create input a number field
    const InputLabel = document.createElement("label");
    InputLabel.innerText = "Enter # pic per rows";
    const numberInput = document.createElement("input");
    numberInput.setAttribute("type", "number");
    numberInput.id = "numPicPerRow";
  
    //create a selected counter
    const selectedCounter = document.createElement("label");
    selectedCounter.id = "selectedCounter";
    // Create a download element
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "Download";
    downloadButton.setAttribute("type", "button");
    downloadButton.style.display = "inline-block";
    downloadButton.style.padding = "5px";
    downloadButton.style.margin = "5px";
    //create a button to unselect all images
    const unselectButton = document.createElement("button");
    unselectButton.innerText = "Unselect All";
    unselectButton.setAttribute("type", "button");
    unselectButton.style.display = "inline-block";
    unselectButton.style.padding = "5px";
    //add all to floating window
    floatingWindow.appendChild(selectedCounter);
    floatingWindow.appendChild(document.createElement("br"));
    floatingWindow.appendChild(InputLabel);
    floatingWindow.appendChild(numberInput);
    const buttonContainer = document.createElement("span");
    buttonContainer.style.width = "100%";
    buttonContainer.style.textAlign = "center";
    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(unselectButton);
    floatingWindow.appendChild(buttonContainer);
    document.body.appendChild(floatingWindow);
  
    //create a modal box
    const modalBox = document.createElement("div");
    modalBox.style.display = "none";
    modalBox.style.position = "fixed";
    modalBox.style.zIndex = 10000;
    // modalBox.style.paddingTop = "100px";
    modalBox.style.left = "20%";
    modalBox.style.top = "10%";
    modalBox.style.width = "60vw";
    modalBox.style.height = "60vh";
    modalBox.style.overflowY = "auto";
    modalBox.style.backgroundColor = "rgb(0,0,0)";
    modalBox.style.backgroundColor = "rgba(0,0,0,0.4)";
  
    //modal content
    const modalContent = document.createElement("div");
    modalContent.style.position = "absolute";
    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.margin = "auto";
    modalContent.style.padding = "20px";
    modalContent.style.border = "1px solid #888";
    modalContent.style.width = "10000px";
    modalContent.style.height = "10000px"
  
    // modal close
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.color = "#aaaaaa";
    closeBtn.style.float = "left";
    closeBtn.style.fontSize = "28px";
    closeBtn.style.fontWeight = "bold";

    //modal content canvas
    const modalCanvas = document.createElement("canvas");
    modalCanvas.id = "modalCanvas";
    //add everything to modal
    modalBox.appendChild(closeBtn);
    modalBox.appendChild(modalCanvas);
    modalBox.appendChild(modalContent);
    //add modal box to body
    document.body.appendChild(modalBox);
  
    function close_modal() {
      modalBox.style.display = "none";
    }
  
    function toggle_images(event) {
      console.log(event.target.src);
      if (event.target.style.filter === "grayscale(80%) opacity(0.7)") {
        // Remove the image from the list
        const index = highlightedImages.indexOf(event.target);
        if (index > -1) {
          highlightedImages.splice(index, 1);
        }
        event.target.style.filter = "";
        event.target.style.zIndex = 2;
      } else {
        // Add the image to the list
        highlightedImages.push(event.target);
        event.target.style.filter = "grayscale(80%) opacity(0.7)";
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
        floatingWindow.style.left = x + 100 + "px";
        floatingWindow.style.top = y + "px";
      } else {
        floatingWindow.style.display = "none";
      }
    }
    //lisen to click event
    document.addEventListener("click", function (event) {
      if (event.target.id === "floatingwindow") {
        //do nothing
      } else if (event.target.tagName === "IMG") {
        toggle_images(event);
        generate_floating_windows(event);
      } else if (event.target == closeBtn) {
        close_modal();
      } else if (event.target === unselectButton) {
        // remove all images from the list
        highlightedImages.forEach((img) => {
          img.style.filter = "";
          img.style.zIndex = "";
        });
        highlightedImages = [];
        floatingWindow.style.display = "none";
      }
    });

    //TODO make the floating window draggable
    // document.addEventListener("mousedown", function (event) {
    //   if (event.target === floatingWindow){
    //     //floating window to be draged
    //     floatingWindow.style.position = "absolute";
    //     floatingWindow.style.zIndex = 1000;
    //     //get the current position of the floating window
    //     floatingWindow.style.left.x = event.clientX + "px";
    //     floatingWindow.style.top.y = event.clientY + "px";
       

    //   }
    // });


  
    //download selected images in a grid
    function generate_photo_grid(imgPerRow) {
      var ctx = modalCanvas.getContext("2d");
      const numOfImgs = highlightedImages.length;
      var x = 0;
      var y = 0;
  
      for (var i = 0; i < highlightedImages.length; i++) {
        const scale = maxImgheight / highlightedImages[i].height;
        const width = highlightedImages[i].width * scale;
        ctx.drawImage(highlightedImages[i], x, y, width, maxImgheight);
        x += width + padding_between_images;
        x = Math.floor(x);
        if ((i + 1) % imgPerRow == 0) {
          x = 0;
          y += maxImgheight + padding_between_images;
          y = Math.floor(y);
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
        //get scale make height == maxImgheight
        const scale = maxImgheight / highlightedImages[i].height;
        //scale width
        const scaledWidth = highlightedImages[i].width * scale;
        current_row_width += scaledWidth;
        width = width < current_row_width ? current_row_width : width;
        //when next image is add to a new row
        if ((i + 1) % numPicPerRow === 0) {
          height += maxImgheight;
          current_row_width = 0;
          rowCount++;
        }
      }
      return { height: height, width: width, rowCount: rowCount };
    }
  
    function create_an_canvas(setting) {
      modalCanvas.width =
        setting.width + (setting.rowCount) * padding_between_images;
      modalCanvas.height =
        setting.height + (setting.rowCount ) * padding_between_images;
      modalCanvas.style.border = "1px solid black";
    }
  
    // download created canvas
    function download_canvas(e) {
      //if value not define then set to 1
      const numPicPerRow = document.getElementById("numPicPerRow").value
        ? document.getElementById("numPicPerRow").value
        : 1;
  
      //get canvas height and width
      const canvasSetting = get_canvas_height_and_width(numPicPerRow);
      create_an_canvas(canvasSetting);
      generate_photo_grid(numPicPerRow);
      try {
        modalCanvas.toBlob(function (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "my-image.png";
          link.click();
        });
      } catch (e) {
        modalBox.style.display = "block";
        modalCanvas.style.left = e.clientX + "px";
        modalCanvas.style.top = e.clientY + "px";
        alert(
          "cannot download canvas due to image from external source, generated on the webpage instead"
        );
      }
    }
  
    downloadButton.addEventListener("click", download_canvas);
  })();
  