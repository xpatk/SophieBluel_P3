// DOM container
const gallery = document.querySelector(".gallery");

async function fetchWorks() {
  try {
    // fetch data from API
    const response = await fetch("http://localhost:5678/api/works");

    // if response is different than ok
    if (!response.ok) {
      throw new Error("Couldn't fetch data to display");
    }

    const works = await response.json();

    // create DOM elements
    for (let i = 0; i < works.length; i++) {
      const work = works[i];

      // create image element
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;

      //create title element
      const titleElement = document.createElement("figcaption");
      titleElement.innerText = work.title;

      //create figure element
      const figureElement = document.createElement("figure");

      // attach elements to the page
      figureElement.appendChild(imageElement);
      figureElement.appendChild(titleElement);

      gallery.appendChild(figureElement);
    }
  } catch (error) {
    console.error(error);
  }
}

// Call the function to fetch and display works
fetchWorks();
