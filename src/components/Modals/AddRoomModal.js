import { Form, Input, Modal } from "antd";
import { useContext } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";

export default function AddRoomModal() {
  const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
  const {user: {uid}} = useContext(AuthContext);
  const [form] = Form.useForm();
  const handleOk = () => {
    console.log({formData: form.getFieldsValue()});
    addDocument("rooms", {
        ...form.getFieldsValue(), 
        members: [uid]
    })
    form.resetFields();
    setIsAddRoomVisible(false);
  };
  const handleCancel = () => {
    setIsAddRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title="Tạo phòng"
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên phòng" name="name">
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


