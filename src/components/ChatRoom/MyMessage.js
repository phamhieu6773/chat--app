import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import styled from "styled-components";

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }
  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }
  .content {
    margin-left: 30px;
  }
`;

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function MyMessage({
  text,
  displayName,
  createdAt,
  photoURL,
  img,
}) {
  return (
    <div style = {{display: "flex", justifyContent: "flex-end", marginRight: 20,}} >

    <WrapperStyled style={{ backgroundColor: "#e8ebfa", padding: "5px 10px", borderRadius: 5}} >
      <div >
        <Typography.Text className="date" >
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
          {img && text ? (
            <div style={{display: "flex", flexDirection: "column"}}>
              <Typography.Text className="content" style={{marginLeft: 10}}>{text}</Typography.Text>
              <img
                style={{
                  maxWidth: 200,
                  height: "auto",
                  borderRadius: 10,
                  marginTop: 10,
                }}
                src={img}
                alt=""
              />
            </div>
          ) : img ? (
            <img
              style={{
                maxWidth: 200,
                height: "auto",
                borderRadius: 10,
                marginTop: 10,
              }}
              src={img}
              alt=""
            />
          ) : (
            <Typography.Text className="content" style={{marginLeft: 10}}>{text}</Typography.Text>
          )}
        </div>
    </WrapperStyled>
      </div>
  );
}
