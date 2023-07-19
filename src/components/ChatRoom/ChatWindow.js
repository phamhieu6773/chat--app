import {
  CameraOutlined,
  DownOutlined,
  UserAddOutlined,
  SendOutlined,
} from "@ant-design/icons/lib/icons";
import { Alert, Avatar, Button, Form, Tooltip } from "antd";
import styled from "styled-components";
import Message from "./Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";
// import { orderBy } from "lodash";
import { storage } from "../../firebase/config";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import InputEmojiWithRef from "react-input-emoji";
import MyMessage from "./MyMessage";

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
    if (img && inputValue) {
      console.log(img);
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
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
              text: inputValue,
            });
          });
        }
      );
      setImg(null);
      setInputValue("");
    } else {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await addDocument("message", {
                  img: downloadURL,
                  uid,
                  photoURL,
                  roomId: selectedRoom.id,
                  displayName,
                });
              }
            );
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
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
          });
        }
      }
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
  };

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messagesa]);
  // console.log(messagesa);
  // console.log(uid);

  // update file or image
  return (
    <WrapperStyled style={{ backgroundColor: "#f5f5f5" }}>
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
            <MessageListStyled
              ref={messageListRef}
              style={{ margin: "0px 0px 0px 30px" }}
            >
              {messagesa.map((mes, i) => {
                // console.log(mes.uid);
                // console.log(uid === mes.uid);
                return mes.uid !== uid ? (
                  <Message
                    key={i}
                    text={mes.text}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                    img={mes.img}
                  />
                ) : (
                  <MyMessage
                    key={i}
                    text={mes.text}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                    img={mes.img}
                  />
                );
              })}
            </MessageListStyled>
            <FormStyled form={form} style={{ margin: "0px 30px" }}>
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
                <SendOutlined style={{ paddingLeft: 3 }} />
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
