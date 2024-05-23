/*****************
 
 Generating index.html gallery and filters 

*****************/

// DOM container for works
const gallery = document.querySelector(".gallery");
let works = [];

// function fetch data from API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    // if response is different than ok
    if (!response.ok) {
      throw new Error("Couldn't fetch data to display");
    }
    // if response is ok call function displayWorks
    works = await response.json();
    displayWorks(works);
  } catch (error) {
    console.error(error);
  }
}

// function display works on the page
function displayWorks(worksToDisplay) {
  // empty the gallery first
  gallery.innerHTML = "";

  for (let i = 0; i < worksToDisplay.length; i++) {
    const work = worksToDisplay[i];

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
}

// Call the function to fetch and display all of the works to begin with
fetchWorks();

/*****************
 
Filters 

*****************/

// button to display all works
const buttonTous = document.querySelector(".btn-tous");
buttonTous.addEventListener("click", function () {
  displayWorks(works);
});

// button to display objects
const buttonObjects = document.querySelector(".btn-objets");
buttonObjects.addEventListener("click", function () {
  const filteredWorks = works.filter((work) => work.category.name === "Objets");
  displayWorks(filteredWorks);
});

// button to display apartments
const buttonApartments = document.querySelector(".btn-appartements");
buttonApartments.addEventListener("click", function () {
  const filteredWorks = works.filter(
    (work) => work.category.name === "Appartements"
  );
  displayWorks(filteredWorks);
});

// button to display hotels and restaurants
const buttonHotels = document.querySelector(".btn-hotels-restaurants");
buttonHotels.addEventListener("click", function () {
  const filteredWorks = works.filter(
    (work) => work.category.name === "Hotels & restaurants"
  );
  displayWorks(filteredWorks);
});

/*****************
 
The modal  

*****************/

// function to open the modal - to be used in the listener
const openModal = function (event) {
  event.preventDefault();
  const target = document.querySelector(event.target.getAttribute("href"));
  // desactivate display: none
  target.style.display = null;
  // desactivate aria hidden
  target.removeAttribute("aria-hidden");
  // for assistive technologies - the element is modal
  target.setAttribute("aria-modal", "true");
};

// event listener calling the function to open the modal on click
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
