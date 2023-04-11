import {
  CameraOutlined,
  DownOutlined,
  UploadOutlined,
  UserAddOutlined,
  UserOutlined,
  SmileOutlined,
  SendOutlined,
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
  Upload,
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
  arrayUnion,
} from "firebase/firestore";
// import { orderBy } from "lodash";
import { db, storage } from "../../firebase/config";
import MenuItem from "antd/es/menu/MenuItem";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../../firebase/config";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Picker from "emoji-picker-react";
import InputEmojiWithRef from "react-input-emoji";

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
  const {
    selectedRoom,
    membersss,
    setIsInviteMemberVisible,
    messagesa,
    setIsOptionSelectionModal,
  } = useContext(AppContext);
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  // const [listMess, setListMess] = useState([]);
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [img, setImg] = useState(null);
  // const handleInputChange = (e) => {
  //   setInputValue(e.target.value);
  // };
  const handleOnSubmit = async () => {
    if (img) {
      console.log(img);
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addDocument("message", {
              img: downloadURL,
              uid,
              photoURL,
              roomId: selectedRoom.id,
              displayName,
            });
          });
        }
      );
      setImg(null);
      setInputValue("");
    } else {
      if (inputValue === "") {
        <Alert message="Tin nhắn trống" type="success" />;
      } else {
        await addDocument("message", {
          text: inputValue,
          // image: inputValue,
          uid,
          photoURL,
          roomId: selectedRoom.id,
          displayName,
        });
      }

      form.resetFields(["message"]);
      // focus to input again after submit
      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current.focus();
        });
      }
      setImg(null);
      setInputValue("");
    }
  };

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messagesa]);

  // update file or image
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
              <Avatar.Group
                size="small"
                maxCount={2}
                style={{ marginLeft: 2, marginRight: 2 }}
              >
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
              <Button onClick={() => setIsOptionSelectionModal(true)}>
                <DownOutlined />
              </Button>
            </ButtonGroupStyled>
          </HeaderStyled>

          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messagesa.map((mes, i) => (
                <Message
                  key={i}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  img={mes.img}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item className="item" name="message">
                <InputEmojiWithRef
                  ref={inputRef}
                  value={inputValue}
                  onChange={setInputValue}
                  onEnter={handleOnSubmit}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              <div
                style={{
                  marginRight: 5,
                  backgroundColor: "#1677ff",
                  color: "white",
                  // height: "100%",
                  display: "flex",
                  alignItems: "center",
                  width: 30,
                  justifyContent: "center",
                  borderRadius: "5px",
                }}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="file"
                  onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                  <CameraOutlined />
                </label>
              </div>
              <Button type="primary" onClick={handleOnSubmit}>
                <SendOutlined style={{paddingLeft: 3}} />
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
