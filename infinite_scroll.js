// Define a function to load more images
var imageCount = 0;
function loadMoreImages() {
   
   
    const image = document.createElement('img');
    image.src = "./cat1.png"
    // Append the new images to the document body
    const imageContainer = document.getElementById('app');
    for(let i = 0; i < 10; i++){
      imageCount++;
      imageContainer.appendChild(image.cloneNode());
    }
  }
  
//   // Attach a scroll event listener to the document
  document.addEventListener('scroll', async () => {
    console.log("total images: " + imageCount)
    // Check if the user has scrolled to the bottom of the page
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    if (scrollPosition >= bodyHeight) {
      // If the user has scrolled to the bottom, load more images
      loadMoreImages();
    }
  });

loadMoreImages();