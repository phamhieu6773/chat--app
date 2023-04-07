import { Button, Avatar, Typography } from "antd";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { authentication, db } from "../../firebase/config";
import { useContext, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../../Contex/AuthProvider";

const UserInfoStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  boder-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

const handleLongOut = () => {
  signOut(authentication)
    .then(() => {})
    .catch((error) => {});
};

export default function UserInfo() {
  // useEffect(() => {
  //   onSnapshot(doc(db, "user", "hieu"), (doc) => {
  //     console.log(doc.data());
  //   });
  // }, [])
  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext);
  return (
    <UserInfoStyled>
      <div style={{ display: "flex" }}>
        <div style={{width: 32}}> 
        <Avatar src={photoURL} ></Avatar>
        </div>
        <div style={{ marginTop: 5 }}>
          <Typography.Text className="username">
            {displayName}
          </Typography.Text>
        </div>
      </div>
      <Button ghost onClick={handleLongOut}>
        Đăng xuất
      </Button>
    </UserInfoStyled>
  );
}
