import {
  DownOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons/lib/icons";
import {
  Alert,
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Space,
  Tooltip,
} from "antd";
import styled from "styled-components";
import Message from "./Message";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import {
  collection,
  limit,
  onSnapshot,
  query,
  orderBy,
  doc,
  where,
  updateDoc,
  deleteField,
} from "firebase/firestore";
// import { orderBy } from "lodash";
import { db } from "../../firebase/config";
import MenuItem from "antd/es/menu/MenuItem";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../../firebase/config";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
    }
    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 78px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;



export default function ChatWindow() {
  const { selectedRoom, membersss, setIsInviteMemberVisible, messagesa } =
    useContext(AppContext);
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [listMess, setListMess] = useState([]);
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument("message", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });
    form.resetFields(["message"]);
    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messagesa]);


  useEffect(() => {
    if(selectedRoom.id !== undefined) {
    const q = query(collection(db, "message"), where("roomId", "==", selectedRoom.id), orderBy("createdAt", "asc"));
    setListMess([]);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        const a = {
          ...doc.data(),
        };
        cities.push(a);
        setListMess(cities);
      });
    });

    return () => {
      unsubscribe();
    };
  }
  }, [selectedRoom.id]);
  
  // const handleDeleteMess = () => {
    
  //    onAuthStateChanged(authentication, (user) => {
  //     console.log(user);
  //   });
  // }

  // const items = [
  //   {
  //     key: "1",
  //     label: <MenuItem style={{ textAlign: "center" }} onClick={handleDeleteMess} >Delete Message</MenuItem>,
  //   },
  // ];


  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">
                {selectedRoom === undefined ? "" : selectedRoom.name}
              </p>
              <span className="header__description">
                {selectedRoom === undefined ? "" : selectedRoom.description}
              </span>
            </div>

            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {membersss.map((member) => (
                  <Tooltip key={member.id} title={member.displayName}>
                    <Avatar src={member.photoURL}>
                      {" "}
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
              {/* Dropdown */}
              {/* <Space direction="vertical">
                <Space wrap>
                  <Dropdown
                    menu={{
                      items,
                    }}
                    placement="bottomLeft"
                  >
                    <Button>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </Space>
              </Space> */}
            </ButtonGroupStyled>
          </HeaderStyled>

          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {listMess.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item className="item" name="message">
                <Input
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
