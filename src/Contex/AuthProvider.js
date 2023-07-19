import { createContext, useEffect, useState } from "react";
import { authentication } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";
import Loading from "../img/loading2.json"
import Lottie from "lottie-react"


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(authentication, (user) => {
      if (user) {
        // console.log(user);
        const { displayName, email, photoURL, uid } = user;
        setUser({ displayName, email, photoURL, uid });
        setIsLoading(false);
        history("/chat--app");
        return;
      }
      setIsLoading(false);
      history("/login");
    });
    return () => {
      unsub();
    };
  }, [history]);


  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Lottie animationData={Loading}  style={{width: "100%", height: "100vh",display: "flex", alignItems: "center", justifyContent:"center"}} /> : children}
    </AuthContext.Provider>
  );
};
