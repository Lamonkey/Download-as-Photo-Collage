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
  floatingCircleContent.appendChild(counterDisplay);
  floatingCircle.appendChild(floatingCircleContent);
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
  floatingCircle.style.color = "gray";
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
  modalNav.appendChild(modalClose);
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modalContent");
  modalBox.appendChild(modalNav);
  modalBox.appendChild(modalContent);
  document.body.appendChild(modalBox);

  //style for modelBox
  modalBox.style.position = "fixed";
  modalBox.style.zIndex = "10000";
  modalBox.style.display = "none";
  modalBox.style.flexDirection = "column";
  modalBox.style.left = "20%";
  modalBox.style.top = "10%";
  modalBox.style.width = "60vw";
  modalBox.style.height = "60vh";
  modalBox.style.backgroundColor = "rgba(0,0,0,0.4)";
  //styling modalContent

  modalContent.style.zIndex = "10000";
  modalContent.style.padding = "20px";
  modalContent.style.height = "100%";
  modalContent.style.overflowY = "auto";
  modalContent.style.overflowX = "auto";
  modalContent.style.display = "flex";
  modalContent.style.flexWrap = "wrap";
  modalContent.style.alignItems = "flex-start";

  //styling modalNav
  modalNav.style.backgroundColor = "white";
  //styling modalClose
  modalClose.style.color = "rgb(48, 56, 71)";
  modalClose.style.float = "right";
  modalClose.style.fontSize = "28px";
  modalClose.style.fontWeight = "bold";
  var imageSourceMap = new Map();
  var imagesList = [];
  function countAndAddImages() {
    let newImages = document.getElementsByTagName("img");
    for (let i = 0; i < newImages.length; i++) {
      //create a new newImage from source
      if (imageSourceMap.has(newImages[i].src)) {
        continue;
      }
      imageSourceMap.set(newImages[i].src, true);
      let newImage = newImages[i].cloneNode();
      imagesList.push(newImage);
    }
    console.log("run loop here")
    return imagesList.length;
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
    if (target === floatingCircle || target === counterDisplay) {
      //display all image to the model box
      modalBox.style.display = "flex";
      imagesList.forEach((img) => {
        img.className = "modalImage";
        img.style.width = "100px";
        img.style.marginBottom = "15px";
        img.style.margin = "15px 15px";
        modalContent.appendChild(img);
      });
    } else if (event.target == modalClose) {
      close_modal();
    }
  });

  // set a once second delay
  setTimeout(function () {
    const count = countAndAddImages();
    add_count_to_view(count);
  }, 1000);
})();
