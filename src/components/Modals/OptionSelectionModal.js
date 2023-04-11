import { Button, Form, Input, Modal } from "antd";
import { useContext } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function OptionSelectionModal() {
  const {isOptionSelectionModal, setIsOptionSelectionModal, selectedRoom} = useContext(AppContext);

  const handleCancel = () => {
    setIsOptionSelectionModal(false);
  };
  // console.log(selectedRoom.id);

  const handleDeleteMess = async () => {
    const q = query(collection(db, "message"), where("roomId", "==", selectedRoom.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc1) => {
      deleteDoc(doc(db, "message", doc1.id))
      // console.log(doc.id);
    })
    setIsOptionSelectionModal(false);
  }
  return (
    <div >
      <Modal
        style={{right: 'calc(-50% + 110px)', top: 50}}
        open={isOptionSelectionModal}
        onCancel={handleCancel}
        closable={false}
        footer={null}
        width={180}
      >
        <div>
            <Button onClick={handleDeleteMess}>Delete Message</Button>
        </div>
      </Modal>
    </div>
  );
}


