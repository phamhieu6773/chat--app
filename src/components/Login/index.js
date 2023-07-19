import React from "react";
import { Row, Col, Button, Typography, message, Form, Divider } from "antd";
import "./Login.css";
// import firebase, { auth } from '../../firebase/config';
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { authentication } from "../../firebase/config";
import { db } from "../../firebase/config";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { generateKeywords } from "../../firebase/services";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
// const fbProvider = new firebase.auth.FacebookAuthProvider();
// import {useNavigate} from 'react-router-dom'
export default function Login() {
  // const history = useNavigate()
  const fbProvider = new FacebookAuthProvider();
  const ggProvider = new GoogleAuthProvider();
  const handleLogin = async (provider) => {
    const data = await signInWithPopup(authentication, provider);
    // console.log(data);

    const newDocument = doc(collection(db, "user"), data.user.email);
    setDoc(newDocument, {
      displayName: data.user.displayName,
      email: data.user.email,
      photoURL: data.user.photoURL,
      uid: data.user.uid,
      providerId: data.user.providerId,
      keywords: generateKeywords(data.user.displayName?.toLocaleLowerCase()),
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="login_Bg">
      <Form className="loginForm">
        <Typography.Title block>Chat App</Typography.Title>
        <Button className="buttonLogin"  type="primary" block onClick={() => handleLogin(ggProvider)}>
          <GoogleOutlined style={{color: "#de4032"}}/> Google
        </Button>
        <Divider style={{ borderColor: "black" }}>or Login with</Divider>
        <Button className="buttonLogin" type="primary" block onClick={() => handleLogin(fbProvider)}>
          <FacebookOutlined style={{color: "blue"}}/> Facebook
        </Button>
      </Form>
    </div>
  );
}


