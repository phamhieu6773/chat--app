import React from "react";
import { Row, Col, Button, Typography, message } from "antd";
// import firebase, { auth } from '../../firebase/config';
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { authentication } from "../../firebase/config";
import { db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { addDocument, generateKeywords } from "../../firebase/services";
// const fbProvider = new firebase.auth.FacebookAuthProvider();
// import {useNavigate} from 'react-router-dom'
export default function Login() {
  // const history = useNavigate()
  const fbProvider = new FacebookAuthProvider();
  const ggProvider = new GoogleAuthProvider();
  const handleLogin = async (provider) => {
    const data = await signInWithPopup(authentication, provider);
    // console.log(data);

    addDocument("user",  {
      displayName: data.user.displayName,
      email: data.user.email,
      photoURL: data.user.photoURL,
      uid: data.user.uid,
      providerId: data.user.providerId,
      keywords: generateKeywords(data.user.displayName?.toLocaleLowerCase())
    });
    // await setDoc(doc(db, "user", "hieu"), {

    // });
  };

  return (
    <div>
      <Row justify="center" style={{ height: 800 }}>
        <Col span={8}>
          <Typography style={{ textAlign: "center" }}>Chat App</Typography>
          <Button style={{ width: "100%", marginBottom: 5 }} onClick={() => handleLogin(ggProvider)} >
            Đăng nhập bằng Google
          </Button>
          <Button style={{ width: "100%" }} onClick={() => handleLogin(fbProvider)}>
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}
