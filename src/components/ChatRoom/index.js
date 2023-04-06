import { Layout } from "antd";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./style.css";
export default function ChatRoom() {
  return (
    <Layout>
      <Layout style={{ display: "flex", position: "relative" }}>
        <div className="sidebar">
          <Sider width={250} breakpoint="sm" collapsedWidth="0">
            <Sidebar />
          </Sider>
        </div>
        <Content>
          <ChatWindow />
        </Content>
      </Layout>
    </Layout>
  );
}
