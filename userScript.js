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
  const photosContainer = document.createElement("ol");
  photosContainer.setAttribute("class", "photosContainer");
  const modalCanvas = document.createElement("canvas");
  //   modalCanvas.style.display="block"
  modalCanvas.class = "modalCanvas";

  //style for modelBox
  modalBox.style.position = "fixed";
  modalBox.style.zIndex = "10000";
  modalBox.style.display = "none";
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
  modalContent.style.display = "block";
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

  //clone a photo container for canvas
  const layoutContent = photosContainer.cloneNode();
  layoutContent.className = "layoutContent";
  const layoutContainer = modalContent.cloneNode();
  layoutContainer.className = "layoutContainer";
  layoutContainer.appendChild(layoutContent);
  layoutContainer.style.display = "none";

  // modalBox.insertBefore(layoutContainer, modalBox.firstChild.nextSibling);
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
  modalBox.appendChild(layoutContainer);
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

  //utility function
  function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
    var oRatio = width / height,
      cRatio = cWidth / cHeight;
    return function () {
      if (contains ? oRatio > cRatio : oRatio < cRatio) {
        this.width = cWidth;
        this.height = cWidth / oRatio;
      } else {
        this.width = cHeight * oRatio;
        this.height = cHeight;
      }
      this.left = (cWidth - this.width) * (pos / 100);
      this.right = this.width + this.left;
      return this;
    }.call({});
  }

  function putImageIntoRow() {
    // let smallest = null;
    let row = new Map();
    for (let i = 0; i < highlightedImages.length; i++) {
      // let x = highlightedImages[i].getBoundingClientRect().x;
      let y = Math.floor(highlightedImages[i].getBoundingClientRect().y);
      if (row.has(y)) {
        row.get(y).push(highlightedImages[i]);
      } else {
        row.set(y, [highlightedImages[i]]);
      }
    }
    return row;
  }
  function getImgSizeInfo(img) {
    var pos = window
      .getComputedStyle(img)
      .getPropertyValue("object-position")
      .split(" ");
    return getRenderedSize(
      true,
      img.width,
      img.height,
      img.naturalWidth,
      img.naturalHeight,
      parseInt(pos[0])
    );
  }

  //factor method
  function wrap_image(imgSrc) {
    const img_li = document.createElement("li");
    const img = document.createElement("img");
    img.src = imgSrc;
    img_li.appendChild(img);
    //styling img_li
    img_li.style.height = "20vh";
    img_li.style.flexGrow = "1";
    img_li.style.margin = "10px";
    //styling img
    img.style.maxHeight = "100%";
    img.style.minWidth = "100%";
    img.style.objectFit = "scale-down";
    img.style.verticalAlign = "bottom";
    img.style.borderRadius = "1%";
    // img_li.style.backgroundColor = "red";
    img_li.classList.add("modalImage");
    img.classList.add("modalImage");

    return img_li;
  }

  function toggle_images(event) {
    let selected_image = event.target;
    console.log(event.target.getBoundingClientRect());
    console.log(getImgSizeInfo(selected_image));
    if (selected_image.classList.contains("selected")) {
      // Remove the image from the list
      const index = highlightedImages.indexOf(event.target);
      if (index > -1) {
        highlightedImages.splice(index, 1);
      }
      selected_image.style.border = "";
      selected_image.classList.remove("selected");
      //also mark the containner
      selected_image.parentElement.classList("selected");
      //   event.target.style.zIndex = 2;
    } else {
      selected_image.style.border = "2px solid red";
      selected_image.classList.add("selected");
      //also mark the containner
      selected_image.parentElement.classList.add("selected");
      // Add the image to the list
      highlightedImages.push(event.target);
      //   event.target.style.filter = "grayscale(80%) opacity(0.7)";
      //   event.target.style.zIndex = 2;
    }
  }
  function resize_canvas(setting) {
    const ctx = modalCanvas.getContext("2d");
    modalCanvas.width = setting.width;
    modalCanvas.height = setting.height;
    ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalCanvas.style.border = "1px solid black";
  }
  //bottom
  // :
  // 355.7265625
  // height
  // :
  // 106.3984375
  // left
  // :
  // 453.734375
  // right
  // :
  // 915.2265625
  // top
  // :
  // 249.328125
  // width
  // :
  // 461.4921875
  // x
  // :
  // 453.734375
  // y
  // :
  // 249.328125
  function get_canvas_height_and_width() {
    //TODO: get from input

    //find starting position which the smallest x and y
    let smallestX = Infinity;
    let smallestY = Infinity;
    for (let i = 0; i < highlightedImages.length; i++) {
      let x = highlightedImages[i].getBoundingClientRect().x;
      let y = highlightedImages[i].getBoundingClientRect().y;
      if (x < smallestX) {
        smallestX = x;
      }
      if (y < smallestY) {
        smallestY = y;
      }
    }
    //find the ending position which is the largest x and y + width and height
    let largestX = 0;
    let largestY = 0;
    for (let i = 0; i < highlightedImages.length; i++) {
      let x = highlightedImages[i].getBoundingClientRect().x;
      let y = highlightedImages[i].getBoundingClientRect().y;
      let width = highlightedImages[i].getBoundingClientRect().width;
      let height = highlightedImages[i].getBoundingClientRect().height;
      if (x + width > largestX) {
        largestX = x + width;
      }
      if (y + height > largestY) {
        largestY = y + height;
      }
    }
    let width = largestX - smallestX;
    let height = largestY - smallestY;
    return {
      height: Math.floor(height),
      width: Math.floor(width),
      startingPoint: { x: smallestX, y: smallestY },
    };
  }

  function generate_photo_grid(startingPoint) {
    let rows = putImageIntoRow();
    const ctx = modalCanvas.getContext("2d");
    
    // ctx.clearRect(0,0, modalCanvas.width, modalCanvas.height);
    for (let [key, imgs] of rows) {                 
      // let current_position = highlightedImages[i].getBoundingClientRect();
      let x = 0;
      let y = key-Math.floor(startingPoint.y);
      for (let i = 0; i < imgs.length; i++) {
        let image_size = getImgSizeInfo(imgs[i]);
        ctx.drawImage(imgs[i], x, y, image_size.width, image_size.height);
        x += image_size.width + 10;
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
    while (photosContainer.firstChild) {
      photosContainer.removeChild(photosContainer.firstChild);
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
      //render selected image to image containner

      modalBox.style.display = "flex";
      imagesSrcList.forEach((src) => {
        const img = wrap_image(src);
        photosContainer.appendChild(img);
      });
    } else if (event.target == modalClose) {
      close_modal();
    } else if (event.target == creatCanvas) {
      //show the canvas and hide content
      //hide all unhighlighted images
      const modalImages = document.querySelectorAll(
        ".modalImage:not(.selected)"
      );
      modalImages.forEach((image) => {
        image.style.display = "none";
      });
      //wait one sec for the images to be hidden
      setTimeout(function () {
        const canvasSetting = get_canvas_height_and_width();
        // layoutContainer.style.display = "block";
        resize_canvas(canvasSetting);
        generate_photo_grid(canvasSetting.startingPoint);
        canvasContainner.style.display = "block";
        modalContent.style.display = "none";
      }, 1000);
      // alert("create canvas");
    } else if (event.target == checkImages) {
      const modalImages = document.querySelectorAll(
        ".modalImage:not(.selected)"
      );
      modalImages.forEach((image) => {
        image.style.display = "block";
      });

      modalContent.style.display = "block";
      // layoutContainer.style.display = "none";
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
