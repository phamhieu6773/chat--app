import { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isEditRoomVisible, setIsEditRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [isOptionSelectionModal, setIsOptionSelectionModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  
  // const [selectedMessId, setSelectedMessId] = useState("");

  const {
    user: { uid },
  } = useContext(AuthContext);

  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);

  const roomList = useFirestore("rooms", roomsCondition);

  const selectedRoom = useMemo(
    () =>
      roomList.find((room) => room.id === selectedRoomId) || {
        members: ["null"],
      },
    [roomList, selectedRoomId]
  );
  // console.log(selectedRoom);
  // if(selectedRoom === {}){
  //   selectedRoom
  // }

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);
  // console.log(userCondition);

  const listMember = useFirestore("user", userCondition);
  let membersss = listMember;
  if (listMember.length !== 0) {
    membersss = listMember.filter(
      (ele, ind) => ind === listMember.findIndex((elem) => elem.uid === ele.uid)
    );
    // console.log(membersss);
  }

  const condition = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    };
  }, [selectedRoom.id]);

  const messagesa = useFirestore("message", condition);

  // const selectedMessage = useMemo(
  //   () =>
  //   messagesa.find((mess) => mess.id === selectedMessId) || {
  //       members: ["null"],
  //     },
  //   [roomList, selectedMessId]
  // );

  // console.log(messagesa);
  return (
    <AppContext.Provider
      value={{
        roomList,
        selectedRoom,
        membersss,
        messagesa,
        isAddRoomVisible,
        setIsAddRoomVisible,
        isEditRoomVisible,
        setIsEditRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        isOptionSelectionModal,
        setIsOptionSelectionModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
