import { Avatar, Form, Input, Modal, Select, Spin } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../Contex/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Contex/AuthProvider";
import { debounce, update } from "lodash";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function DebouncsSelect({
  fetchOptions,
  debounceTimeout = 300,
  curMembers,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  // console.log(options)
  const debuonceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        // console.log(newOptions);
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, curMembers]);

  useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debuonceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {`${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

const fetchUserList = async (search, curMembers) => {
  console.log(search);
  const collectionSearch = collection(db, "user");
  const q = query(
    collectionSearch,
    where("keywords", "array-contains", search?.toLowerCase()),
    orderBy("displayName", "asc"),
    limit(20)
  );
  try {
    const querySnapshot = await getDocs(q);
    const a = [];
    querySnapshot
      .forEach((doc) => {
        const b = {
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        };
        console.log(curMembers);
        let cout = 0;
        for(let i = 0; i <curMembers.length; i++) {
          if(b.value === curMembers[i]){
            cout ++;
          }
        }
        console.log(cout);
        if(cout === 0){
          a.push(b)
        }
        // a.push(b);
      })
    
    return a;
  } catch (err) {
    console.log("err: ", err);
  }
};

export default function InviteMemberModal () {
  const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoom, selectedRoomId } =
    useContext(AppContext);
  const [value, setValue] = useState([]);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.resetFields();

    const roomRef = doc(db, "rooms", selectedRoomId)

    updateDoc(roomRef, {
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    })
    setIsInviteMemberVisible(false);
  };
  const handleCancel = () => {
    setIsInviteMemberVisible(false);
  };

  // console.log({value});
  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebouncsSelect
            mode="multiple"
            name="search-user"
            label="Tên thành viên"
            value={value}
            placeholder="Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
