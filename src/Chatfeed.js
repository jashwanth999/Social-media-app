import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useParams } from "react-router-dom";

function Chatfeed({ id, username, user, chat, user_id_1, user_id_2 }) {
  const { userid, roomid } = useParams();
  return (
    <div>
      {(user_id_1 === userid && user_id_2 === roomid) ||
      (user_id_2 === userid && user_id_1 === roomid) ? (
        username === user?.displayName ? (
          <div
            style={{
              display: "flex",
              padding: "4px",
              boxShadow: "1px 5px 8px 0px rgba(0,0,0,0.2)",
              width: "150px",
              margin: "8px",
              backgroundColor: "lightblue",
              borderRadius: "10px",
              position: "relative",
              left: "70%"
            }}
          >
            <h5 style={{ padding: "10px" }}>{chat}</h5>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              padding: "4px",
              boxShadow: "1px 5px 8px 0px rgba(0,0,0,0.2)",
              width: "150px",
              margin: "8px",
              borderRadius: "16px"
            }}
          >
            <h5 style={{ padding: "4px" }}>{chat}</h5>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}

export default Chatfeed;
