function listenerSubmit() {
  const formLogin = document.querySelector(".form-login");
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    // Creation of the object loginUser containing the data needed
    const loginUser = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    // Json conversion
    const dataLogin = JSON.stringify(loginUser);

    // fetch POST to users/login
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataLogin,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch data : ${response.status}");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

listenerSubmit();
