/*****************
 
 Check if admin mode 

*****************/

document.addEventListener("DOMContentLoaded", () => {
  // check if token is present in localStorage
  const token = window.localStorage.getItem("authToken");

  // DOM elements
  const editBand = document.querySelector(".edit");
  const linkOpenModal = document.querySelector(".js-modal");
  const linkLogin = document.querySelector(".link-login");
  const filtres = document.querySelector(".filtres");

  if (token) {
    console.log("Admin is logged in");
    //modify the elements - show elements on the page, delete filters
    if (editBand) {
      editBand.style.display = "flex";
    }
    if (linkOpenModal) {
      linkOpenModal.style.display = "inline-block";
    }
    if (linkLogin) {
      linkLogin.innerText = "Logout";

      linkLogin.addEventListener("click", (e) => {
        e.preventDefault();
        window.localStorage.removeItem("authToken");
        window.location.href = "index.html";
      });
    }
    if (filtres) {
      filtres.style.display = "none";
    } else {
      console.log("Admin layout applied");
    }
  } else {
    console.log("Public access");
    //load normal page
  }
});

fetchCategories();
fetchWorks();

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
    console.log(works);
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

// CALL functions FETCH API categories and works
// fetchCategories();
// fetchWorks();

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
  document.querySelector(".addPhotoForm").style.display = "none";
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-stop-propagation")
    .addEventListener("click", stopPropagation);
  displayContentModal(works);
  document.querySelector(".bottomModal").style.display = "block";
  document.querySelector(".btnModal").style.display = "block";
  document.querySelector(".btnModal").addEventListener("click", () => {
    document.querySelector(".modalPhotos").style.display = "none";
    document.querySelector(".modalAddPhoto").style.display = "block";
    document.querySelector(".addPhotoForm").style.display = "flex";
    document.querySelector(".bottomModal").style.display = "none";
    populateCategoryOptions();
  });
};

// fetch and add categories to the form addPhotoForm
async function populateCategoryOptions() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Couldn't fetch categories");
    }
    const categories = await response.json();
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = "";
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

document.querySelector(".btnModal").addEventListener("click", () => {
  populateCategoryOptions();
});

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

function displayContentModal(worksToDisplay) {
  // Ensure modalPhotos is correctly defined
  const modalPhotos = document.querySelector(".modalPhotos");
  if (!modalPhotos) {
    console.error("Modal photos container not found");
    return;
  }
  // Empty the gallery first
  modalPhotos.innerHTML = "";

  for (let i = 0; i < worksToDisplay.length; i++) {
    const work = worksToDisplay[i];

    // Create image element

    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure-wrapper");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const deleteElement = document.createElement("button");
    deleteElement.classList.add("delete");

    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can");

    // Attach elements to the page
    deleteElement.appendChild(iconElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteElement);

    // Append the container to modal
    modalPhotos.appendChild(figureElement);

    // Add event listener to the delete button
    deleteElement.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${work.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.localStorage.getItem(
                "authToken"
              )}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Couldn't delete the work");
        }

        // Remove the figure element from the modal and page
        figureElement.remove();
        // Remove the work from the global works array
        works = works.filter((w) => w.id !== work.id);

        // Re-render the main page gallery
        displayWorks(works);
        console.log(`Work with id ${work.id} deleted`);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

/*****************
 
Add pictures to the gallery - modal  

*****************/

const form = document.querySelector(".addPhotoForm");
const modalPhotos = document.querySelector(".modalPhotos");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log(form);

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
      },
    });
    if (response.ok) {
      const newWork = await response.json();
      addPhotoToGallery(newWork);
      addPhotoToModal(newWork);
      form.reset();
      console.log("Photo uploaded successfully");
    } else {
      console.log(`Failed to upload image: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
});

function addPhotoToGallery(work) {
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

function addPhotoToModal(work) {
  const figureElement = document.createElement("figure");
  figureElement.classList.add("figure-wrapper");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;

  const deleteElement = document.createElement("button");
  deleteElement.classList.add("delete");

  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-solid", "fa-trash-can");

  // Attach elements to the page
  deleteElement.appendChild(iconElement);
  figureElement.appendChild(imageElement);
  figureElement.appendChild(deleteElement);

  // Append the container to modal
  modalPhotos.appendChild(figureElement);

  // Add delete functionality
  deleteElement.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5678/api/works/${work.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't delete the work");
      }

      // Remove the figure element from the modal and page
      figureElement.remove();
      // Remove the work from the global works array
      works = works.filter((w) => w.id !== work.id);

      // Re-render the main page gallery
      displayWorks(works);
      console.log(`Work with id ${work.id} deleted`);
    } catch (error) {
      console.error(error);
    }
  });
}
