import { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

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
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
