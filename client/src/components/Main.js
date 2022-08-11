import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../constants";
import Navbar from "./Navbar";
import Swal from "sweetalert2";

const Main = () => {
  const [friends, setFriends] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [chats, setChats] = useState([]);
  const [name, setName] = useState("");
  const [recieverEmail, setRecieverEmail] = useState("");
  const [sendingMessage, setSendingMessage] = useState("");
  //const [selectedFriend, setSelectedFriend] = useState();

  useEffect(() => {
    axios
      .get(`${URL}/user/show/friends`)
      .then((res) => {
        console.log(res.data.friendList);
        setFriends(res.data.friendList);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${URL}/user/getUser`)
      .then((res) => {
        console.log(res.data.firstName);
        setName(res.data.firstName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const openChat = (email) => {
    //email = recieverEmail;
    axios
      .get(`${URL}/chat/recieve/${email}`)
      .then((res) => {
        //console.log("dattta ", res.data);
        console.log(email);
        setChats(res.data);
        setRecieverEmail(email);
        setClicked(true);
        console.log(res);
      })
      .catch((err) => {
        Swal.fire("Some Error Happened", "", "error");
        console.log(err);
      });
  };
  const sendMessage = () => {
    sendingMessage != "" &&
      axios
        .post(`${URL}/chat/send/${recieverEmail}`, { message: sendingMessage })
        .then((res) => {
          console.log(res);
          Swal.fire("Message Sent Succesfully", "", "success");
          setSendingMessage("");
        })
        .catch((err) => {
          console.log(err);
          Swal.fire("Some Error Happened", "", "error");
        });
  };
  const getMessage = () => {
    axios
      .get(`${URL}/chat/recieve/${recieverEmail}`)
      .then((res) => {
        console.log(res);
        setChats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <center>
        <h1>Hi {name}! &#128075;</h1>
      </center>
      <div class="list-group">
        <a
          href="#"
          class="list-group-item list-group-item-action active"
          aria-current="true"
        >
          Friends
        </a>
        {friends.length === 0 ? (
          <center>
            <h1>No Friends Added</h1>
          </center>
        ) : (
          friends.map((val, index) => {
            return (
              <a
                href="#"
                class="list-group-item list-group-item-action"
                onClick={() => openChat(val.email)}
              >
                {val.firstName}
              </a>
            );
          })
        )}
      </div>
      <div>
        {!clicked ? (
          <center>
            <h3>Click on any friend and have chat with that Friend</h3>
          </center>
        ) : (
          <div>
            {chats === "No Message Found" ? (
              <div>No Messages Found</div>
            ) : (
              chats.map((val, index) => {
                return (
                  <div>
                    <div>{val.message}</div>
                    <small>
                      <p> Time : {val.createdAt}</p>
                    </small>
                  </div>
                );
              })
            )}
            <input
              placeholder="Send Message"
              value={sendingMessage}
              onChange={(e) => {
                setSendingMessage(e.target.value);
              }}
            />
            <button
              className="btn btn-warning"
              onClick={() => {
                sendMessage();
              }}
            >
              Send Message
            </button>
            <button className="btn btn-success" onClick={() => getMessage()}>
              Get Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
