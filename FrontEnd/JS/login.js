/*****************
 
 Logging in 

*****************/

// preparing error handling with DOM
let errorElement = document.querySelector(".error");
errorElement.style.display = "none";

listenerSubmit();

function listenerSubmit() {
  // add event listenet to the form
  const formLogin = document.querySelector(".form-login");
  formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    // creating a constant with all the data of the user needed
    const loginUser = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    const dataLogin = JSON.stringify(loginUser);

    try {
      // "try" to log in - posting/sending the data of the user
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataLogin,
      });

      // errow handling
      if (!response.ok) {
        errorElement.textContent = "Something went wrong.";
        errorElement.style.display = "block";
        throw new Error(`Unable to fetch data: ${response.status}`);
      }

      // Remove the error element if present
      errorElement.style.display = "none"; // Hide the error element

      // if response is ok create a const token with the token from the server response
      const data = await response.json();
      // extract the token
      const token = data.jwt;
      // store the token in local storage
      window.localStorage.setItem("authToken", token);

      // redirection to the main page
      window.location.href = "../pages/adminmain.html";
      console.log("Success! Token:", token);
    } catch (error) {
      console.error("Error:", error);
    }
  });
}
