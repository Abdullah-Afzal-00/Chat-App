import React from "react";
import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { URL } from "../constants";

function SignUp() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLsatName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const checkCredentials = () => {
    console.log(username, password);
    email === "" ||
    password === "" ||
    username === "" ||
    firstName === "" ||
    lastName === ""
      ? Swal.fire({
          icon: "error",
          title: "Kindly Fill all the Information Blocks",
        })
      : axios
          .post(`${URL}/user/signup`, {
            email: email,
            password: password,
            username: username,
            lastName: lastName,
            firstName: firstName,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Sign Up",
            });
            // localStorage.setItem("email", email);
            // localStorage.setItem("username", username);
            axios
              .post(`${URL}/user/login`, { email: email, password: password })
              .then((res) => {
                // console.log(res);
                localStorage.setItem("token", res.data.token);
              })
              .catch((err) => {
                console.log(err);
              });
            //navigate("/main");
          })
          .catch((e) => {
            console.log("Erorr Found");
            console.log(e);

            Swal.fire({
              icon: "error",
              title: `${e.response.data.message}`,
            });
          });
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <h1>Sign Up</h1>
      </div>
      <form onKeyPress={(e) => e.key === "Enter" && checkCredentials()}>
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex p-4">
            {" "}
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                First Name
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="FirstName"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex p-4">
            {" "}
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                Last Name
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="LastName"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(event) => setLsatName(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex p-4">
            {" "}
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                Username
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex p-4">
            {" "}
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                Email
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex p-4">
            {" "}
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                Password
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                aria-label="Password"
                aria-describedby="addon-wrapping"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-dark"
          onClick={() => checkCredentials()}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}

export default SignUp;
