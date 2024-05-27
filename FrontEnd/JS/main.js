/*****************
 
 Generating main page : filters and gallery of works 

*****************/

// FILTERS (BUTTONS)
const containerFilters = document.querySelector(".filtres");
let filters = [];

// fetch categories from API
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Couldn't fetch categories");
    }
    //if response is ok
    filters = await response.json();
    // console.log(filters);
    makeButtons(filters);
  } catch (error) {
    console.error(error);
  }
}

// Use fetched categories to make button filters
function makeButtons(filters) {
  containerFilters.innerHTML = "";
  filters.forEach(({ id, name }) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.addEventListener("click", () => {
      filterCategories(id);
    });
    containerFilters.appendChild(button);
  });
  // Add the "all" button
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => {
    // Call a function to display all elements
    displayAllElements();
  });
  containerFilters.prepend(allButton);
}

// Function to display all elements
function displayAllElements() {
  displayWorks(works);
}

// GALLERY OF WORKS

// DOM container for WORKS
const gallery = document.querySelector(".gallery");
let works = [];

// function fetch works from API
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

// function to display works on the page
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

// CALL functions FETCH API
fetchCategories();
fetchWorks();

// Filter WORKS by ID
function filterCategories(categoryId) {
  const filteredWorks = works.filter((work) => work.categoryId === categoryId);
  displayWorks(filteredWorks);
}

/*****************
 
The modal  

*****************/

// the variable checking which modal is open
let modal = null;

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
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-stop-propagation")
    .addEventListener("click", stopPropagation);
};

// function to CLOSE the modal
const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  // reactivate display: none
  modal.style.display = "none";
  // reactivate aria hidden
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-stop-propagation")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

// event listener calling the function to open the modal on click
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
