// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// ==/UserScript==
(function () {
  "use strict";
  //create floating circle
  // create the div elements
  const floatingCircle = document.createElement("div");
  floatingCircle.setAttribute("id", "floating-circle");
  const floatingCircleContent = document.createElement("div");
  floatingCircleContent.setAttribute("id", "floating-circle-content");
  const counterDisplay = document.createElement("h1");
  counterDisplay.innerText = "count";
  floatingCircle.appendChild(floatingCircleContent);
  floatingCircleContent.appendChild(counterDisplay);
  // append the floatingCircle div to the body of the webpage
  document.body.appendChild(floatingCircle);

  // set the CSS styles for floatingCircle
  floatingCircle.style.position = "fixed";
  floatingCircle.style.top = "1em";
  floatingCircle.style.right = "1em";
  floatingCircle.style.zIndex = "10000";
  floatingCircle.style.height = "100px";
  floatingCircle.style.width = "100px";
  floatingCircle.style.backgroundColor = "aquamarine";
  floatingCircle.style.opacity = "0.6";
  floatingCircle.style.borderRadius = "50%";
  floatingCircle.style.display = "flex";
  floatingCircle.style.color = "white";
  floatingCircle.style.alignItems = "center";
  floatingCircle.style.justifyContent = "center";
  //css for floating-circle-content
  floatingCircleContent.style.display = "flex";
  floatingCircleContent.style.flexDirection = "column";
  floatingCircleContent.style.alignItems = "center";
  floatingCircleContent.style.justifyContent = "center";
  floatingCircleContent.style.height = "100%";
  floatingCircleContent.style.width = "100%";

  //create modal component
  const modalBox = document.createElement("div");
  modalBox.setAttribute("class", "modalBox");
  const modalNav = document.createElement("div");
  modalNav.setAttribute("class", "modalNav");
  const modalClose = document.createElement("span");
  modalClose.setAttribute("class", "modalClose");
  modalClose.innerHTML = "&times"; // set the close symbol as text content
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modalContent");
  const photosContainer = document.createElement("ul");
  photosContainer.setAttribute("class", "photosContainer");
  const modalCanvas = document.createElement("canvas");
  //   modalCanvas.style.display="block"
  modalCanvas.class = "modalCanvas";

  //style for modelBox
  modalBox.style.position = "fixed";
  modalBox.style.zIndex = "10000";
  modalBox.style.display = "flex";
  modalBox.style.flexDirection = "column";
  modalBox.style.left = "20%";
  modalBox.style.top = "10%";
  modalBox.style.width = "60vw";
  modalBox.style.height = "60vh";
  modalBox.style.backgroundColor = "rgba(255,255,255,0.4)";
  //styling modalContent
  modalContent.style.zIndex = "10000";
  // modalContent.style.padding = "0";
  modalContent.style.height = "100%";
  modalContent.style.overflowY = "auto";
  modalContent.style.overflowX = "auto";
  modalContent.style.display = "flex";
  modalContent.style.flexWrap = "wrap";
  modalContent.style.alignItems = "flex-start";
  //styling modalNav
  modalNav.style.backgroundColor = "white";
  modalNav.style.display = "flex";
  modalNav.style.justifyContent = "end";
  //close styleing
  modalClose.style.marginLeft = "10px";
  modalClose.style.color = "rgb(48, 56, 71)";
  modalClose.style.fontSize = "28px";
  modalClose.style.fontWeight = "bold";
  modalClose.style.cursor = "pointer";
  //photosContainer styling
  photosContainer.style.display = "flex";
  photosContainer.style.flexWrap = "wrap";
  photosContainer.style.margin = "2%";
  //create createCanvas
  const creatCanvas = modalClose.cloneNode();
  creatCanvas.className = "createCanvas";
  creatCanvas.innerHTML = String.fromCodePoint(0x1f304);

  const canvasContainner = modalContent.cloneNode();
  canvasContainner.style.display = "none";

  //add modalBox to DOM
  modalContent.appendChild(photosContainer);
  modalBox.appendChild(modalNav);
  canvasContainner.appendChild(modalCanvas);
  modalBox.appendChild(canvasContainner);
  modalBox.appendChild(modalContent);
  document.body.appendChild(modalBox);
  //create check image
  const checkImages = modalClose.cloneNode();
  checkImages.className = "checkImages";
  checkImages.innerHTML = String.fromCodePoint(0x1f5bc);
  modalNav.appendChild(checkImages);
  modalNav.appendChild(creatCanvas);
  modalNav.appendChild(modalClose);

  var imageSourceMap = new Map();
  var imagesSrcList = [];
  var imagePerRow = 1;
  var highlightedImages = [];
  var maxImgheight = 1000;
  var padding_between_images = 10;

  //factor method
  function wrap_image(imgSrc) {
    const img_li = document.createElement("li");
    const img = document.createElement("img");
    img.src = imgSrc;
    img_li.appendChild(img);
    //styling img_li
    img_li.style.height = "20vh";
    img_li.style.flexGrow = "1";
    img_li.style.margin = "2%";
    //styling img
    img.style.maxHeight = "100%";
    img.style.minWidth = "100%";
    img.style.objectFit = "cover";
    img.style.verticalAlign = "bottom";
    img.style.borderRadius = "1%";
    return img_li;
  }

  function toggle_images(event) {
    let selected_image = event.target;
    if (selected_image.classList.contains("selected")) {
      // Remove the image from the list
      const index = highlightedImages.indexOf(event.target);
      if (index > -1) {
        highlightedImages.splice(index, 1);
      }
      selected_image.style.border = "";
      selected_image.classList.remove("selected");
      //   event.target.style.zIndex = 2;
    } else {
      selected_image.style.border = "2px solid red";
      selected_image.classList.add("selected");
      // Add the image to the list
      highlightedImages.push(event.target);
      //   event.target.style.filter = "grayscale(80%) opacity(0.7)";
      //   event.target.style.zIndex = 2;
    }
  }
  function resize_canvas(setting) {
    modalCanvas.width =
      setting.width + setting.rowCount * padding_between_images;
    modalCanvas.height =
      setting.height + setting.rowCount * padding_between_images;
    modalCanvas.style.border = "1px solid black";
  }

  function get_canvas_height_and_width(numPicPerRow) {
    let height = 0;
    let width = 0;
    let current_row_width = 0;
    let rowCount = 1;
    //loop thought each image
    for (let i = 0; i < highlightedImages.length; i++) {
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
  function generate_photo_grid(imgPerRow) {
    var ctx = modalCanvas.getContext("2d");
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
  }

  function countAndAddImages() {
    let newImages = document.getElementsByTagName("img");
    for (let i = 0; i < newImages.length; i++) {
      //   create a new newImage from source
      if (imageSourceMap.has(newImages[i].src)) {
        continue;
      }
      imageSourceMap.set(newImages[i].src, true);
      let newImageSrc = newImages[i].src;
      imagesSrcList.push(newImageSrc);
    }

    return imagesSrcList.length;
  }

  function add_count_to_view(imageCount) {
    counterDisplay.innerHTML = imageCount;
  }
  function close_modal() {
    modalBox.style.display = "none";
    while (modalContent.firstChild) {
      modalContent.removeChild(modalContent.firstChild);
    }
  }
  document.addEventListener("scroll", async () => {
    //add number of image to the floating window
    const imageCount = countAndAddImages();
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    if (scrollPosition >= bodyHeight) {
      add_count_to_view(imageCount);
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target === floatingCircleContent || target === counterDisplay) {
      //display all image to the model box
      modalBox.style.display = "flex";
      imagesSrcList.forEach((src) => {
        const img = wrap_image(src);
        photosContainer.appendChild(img);
      });
    } else if (event.target == modalClose) {
      close_modal();
    } else if (event.target == creatCanvas) {
      //show the canvas and hide content
      modalContent.style.display = "none";
      const canvasSetting = get_canvas_height_and_width(imagePerRow);
      canvasContainner.style.display = "block";
      resize_canvas(canvasSetting);
      generate_photo_grid(imagePerRow);
      //   alert("create canvas");
    } else if (event.target == checkImages) {
      modalContent.style.display = "flex";
      canvasContainner.style.display = "none";

      //   alert("check images");
    } else if (event.target.classList.contains("modalImage")) {
      toggle_images(event);
    }
  });

  // set a once second delay
  setTimeout(function () {
    const count = countAndAddImages();
    add_count_to_view(count);
  }, 1000);
})();
