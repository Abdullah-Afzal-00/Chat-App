import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { URL } from "../constants";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [foundedUser, setFoundedUser] = useState({});

  const navigate = useNavigate();

  const logOut = () => {
    Swal.fire({
      title: "Do you really want to Logout",
      //showDenyButton: true,
      //showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Logged Out", "", "success");
        localStorage.clear();
        navigate("/");
      }
      // else if (result.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
    });
  };

  const searchUser = () => {
    axios
      .get(`${URL}/user/searchUser/${username}`)
      .then((res) => {
        //navigate("findUser");
        setFoundedUser(res.data.data);
        console.log(foundedUser);
        console.log(res);
      })
      .catch((err) => {
        Swal.fire("User Not Find", "", "error");
        setFoundedUser({});
        console.log(err);
      });
  };
  const addFriend = (email) => {
    axios
      .post(`${URL}/user/addFriend/${email}`)
      .then((res) => {
        console.log(res);
        Swal.fire("Friend Added", "", "success");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Some Error Happened", "", "error");
      });
  };

  {
    return (
      <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              Chat App
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a
                    class="nav-link active"
                    aria-current="page"
                    href="#"
                    onClick={logOut}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
              <form class="d-flex">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search by username"
                  aria-label="Search"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  class="btn btn-outline-success"
                  type="button"
                  onClick={() => {
                    searchUser();
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
        {foundedUser.username ? (
          <div
            class="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>
              {foundedUser.firstName} {foundedUser.lastName}
            </strong>
            <p>User ID : {foundedUser.username}</p>
            <div className="d-flex justify-content-end align-items-center">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
              {foundedUser.isFriend ? (
                <h4>Already Friends</h4>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addFriend(foundedUser.email);
                  }}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ) : null}
        {foundedUser === "It's Your own ID" && (
          <div
            class="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>It's Your ID</strong>
            <div className="d-flex justify-content-end align-items-center">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          </div>
        )}
        <hr />
        <Outlet />
      </div>
    );
  }
};

export default Navbar;
