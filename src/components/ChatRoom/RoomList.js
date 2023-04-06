import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Contex/AuthProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
// import useFirestore from "../../hooks/useFirestore";
import { AppContext } from "../../Contex/AppProvider";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;

export default function RoomList() {

  const {roomList, setIsAddRoomVisible, setSelectedRoomId} = useContext(AppContext)

  // console.log({roomList});

  const handleAddRoom = () => {
    setIsAddRoomVisible(true)
  }
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {
            roomList.map((room, index) =>  <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)} >{room.name}</LinkStyled>)
        }

        <Button type="text" icon={<PlusSquareOutlined />} className="add-room" onClick={handleAddRoom}>
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
