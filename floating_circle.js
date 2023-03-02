var imagesList = [];
function countImages() {
  const images = Array.from(document.getElementsByTagName("img"));
  const imageCount = images.length;
  imagesList = images;
  return imageCount;
}
function add_count_to_view(imageCount) {
  const counter = document.getElementById("floating-circle-content");
  counter.innerHTML = imageCount;
}

function close_modal() {
  const modalBox = document.getElementsByClassName("modalBox")[0];
  modalBox.style.display = "none";
  //remove all images from the modalContent
  const modalContent = document.getElementsByClassName("modalContent")[0];
  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }
}
document.addEventListener("scroll", async () => {
  //add number of image to the floating window
  const imageCount = countImages();
  const scrollPosition = window.innerHeight + window.scrollY;
  const bodyHeight = document.body.offsetHeight;
  if (scrollPosition >= bodyHeight) {
    add_count_to_view(imageCount);
  }
});
document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.id === "floating-circle-content") {
    //display all image to the model box
    const modalBox = document.getElementsByClassName("modalBox")[0];
    modalBox.style.display = "flex";
    const modalContent = document.getElementsByClassName("modalContent")[0];
    imagesList.forEach((img) => {
      const modalImage = img.cloneNode();
      modalImage.className = "modalImage";
      modalContent.appendChild(modalImage);
    });
  } else if (event.target.className == "modalClose") {
    close_modal();
  }
});

// set a once second delay
setTimeout(function () {
  const count = countImages();
  add_count_to_view(count);
}, 1000);
