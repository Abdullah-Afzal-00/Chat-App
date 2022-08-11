import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../constants";

const FindUser = () => {
  const [foundedUser, setFoundedUser] = useState({});

  useEffect(() => {
    axios.get();
  }, []);
  return <div>FindUser</div>;
};

export default FindUser;
