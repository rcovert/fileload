import "./App.css";
import React, { useState } from "react";
import { nanoid } from "nanoid";

import {
  Link,
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const App = () => {
  const [base64, setBase64] = useState("");
  const [theSSN, setSSN] = useState("");
  const [theTY, setTY] = useState("");
  const [theNC, setNC] = useState("");
  const [theResponse, setResp] = useState("");
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  // generate unique file-id
  const fileid = nanoid() + ".pdf";
  //console.log('fileid: ', fileid);

  const onChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    getBase64(file);
  };

  const onChangeS = (e) => {
    setSSN(e.target.value);
  };

  const onChangeT = (e) => {
    //console.log(e.target.value);
    setTY(e.target.value);
  };

  const onChangeN = (e) => {
    setNC(e.target.value);
  };

  const onLoad = (fileString) => {
    setBase64(fileString);
    console.log(base64);
  };

  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(file);
      onLoad(reader.result);
      console.log(base64);
    };
  };

  async function doFetch() {
    await fetch(
      "https://icqq4168y3.execute-api.us-east-2.amazonaws.com/sendEmail",
      {
        mode: "cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: "randycovert@gmail.com",
          senderEmail: "randycovert@gmail.com",
          ssn: theSSN,
          taxperiod: theTY,
          namecontrol: theNC,
          message: "HELLO WORLD THIS IS FROM REACT APP",
          base64Data: base64,
          date: new Date(),
          fileName: fileid,
        }),
      }
    )
      .then((response) => response.json())
      .then((j) => {
        console.log("test j: ", j);
        //setResp(j.messageId);
        navigate("/results", { state: { msgid: fileid } });
      })
      .catch((e) => console.log("test e", e))
      .catch((e) => console.log("test e2", e));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    doFetch();
    //console.log("res: ", theResponse);
  };

  return (
    <div className="App">
      <form>
        <label>SSN:</label>
        <br></br>
        <input type="text" id="SSN" name="SSN" onChange={onChangeS}></input>
        <br></br>
        <label>Tax Period (MM/YYYY):</label>
        <br></br>
        <input
          type="text"
          id="TaxPeriod"
          name="TaxPeriod"
          onChange={onChangeT}
        ></input>
        <br></br>
        <label>Name Control (####):</label>
        <br></br>
        <input
          type="text"
          id="NameControl"
          name="NameControl"
          onChange={onChangeN}
        ></input>
        <br></br>
        <br></br>
        <input type="file" accept="application/pdf" onChange={onChange} />
        <br></br>
        <br></br>
        <button onClick={handleSubmit}>SEND TO LAMBDA</button>
        <br></br>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        ></nav>
      </form>
    </div>
  );
};

export default App;
