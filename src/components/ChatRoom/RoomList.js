import { PlusSquareOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { useContext } from "react";
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
  const { roomList, setIsAddRoomVisible, setSelectedRoomId, setIsEditRoomVisible } =
    useContext(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const handleEditRoom = () => {
    setIsEditRoomVisible(true);
  };
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {roomList.map((room) => (
          <div
            key={room.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LinkStyled onClick={() => setSelectedRoomId(room.id)}>
              {room.name}
            </LinkStyled>
            <LinkStyled onClick={handleEditRoom}><EditOutlined  /></LinkStyled>
            
          </div>
        ))}

        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
