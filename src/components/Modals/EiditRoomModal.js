import { Button, Form, Input, Modal } from "antd";
import { useContext } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function EiditRoomModal() {
  const {
    isEditRoomVisible,
    setIsEditRoomVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext);
  //   console.log(selectedRoomId);
  //   const {
  //     user: { uid },
  //   } = useContext(AuthContext);
  const [form] = Form.useForm();
  const handleOk = () => {
    if (
      form.getFieldsValue().name !== undefined &&
      form.getFieldsValue().description !== undefined
    ) {
      console.log({ formData: form.getFieldsValue() });
      const roomRef = doc(db, "rooms", selectedRoomId);
      updateDoc(roomRef, {
        name: form.getFieldsValue().name,
        description: form.getFieldsValue().description,
      });
      form.resetFields();
      setIsEditRoomVisible(false);
    }
    setIsEditRoomVisible(false);
  };
  const handleCancel = () => {
    setIsEditRoomVisible(false);
  };

  const handleDelete = () => {
    const roomRef = doc(db, "rooms", selectedRoomId);
    deleteDoc(roomRef);
    form.resetFields();
    setIsEditRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title="Sửa tên phòng"
        open={isEditRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="1" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="2" type="primary" onClick={handleOk}>
            Ok
          </Button>,
          <Button key="3" type="primary" onClick={handleDelete}>
            Delete Room
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name">
            <Input placeholder="Nhập lại tên phòng" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Nhập lại mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
