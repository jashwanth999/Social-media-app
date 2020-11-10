import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Avatar from "@material-ui/core/Avatar";

function Userslist({ id, username, online, user, propic }) {
  const history = useHistory();
  const push = () => {
    if (id) {
      history.push(`/chat/${user.uid}/${id}`);
    }
  };
  return (
    <div style={{ display: "flex" }}>
      {user && user.displayName !== username ? (
        <Button color="primary" onClick={push}>
          <Avatar
            alt="Ted talk"
            style={{ display: "flex", marginRight: "4px" }}
            src={propic}
          />
          {username}
          {online ? (
            <FiberManualRecordIcon style={{ color: "#085e16" }} />
          ) : (
            <FiberManualRecordIcon style={{ color: "#dd0f0f" }} />
          )}
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}

export default Userslist;
