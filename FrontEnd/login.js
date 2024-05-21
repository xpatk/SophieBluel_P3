/*****************
 
 Logging in 

*****************/
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
        throw new Error(`Unable to fetch data: ${response.status}`);
      }

      // if response is ok create a const token with the token from the server response
      const data = await response.json();
      // extract the token
      const token = data.jwt;
      // store the token in local storage
      window.localStorage.setItem("authToken", token);
      console.log("Success! Token:", token);
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

listenerSubmit();
