import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SendIcon from "@material-ui/icons/Send";
import { db } from "./firebase";
import Userlist from "./Userlist";
import { useHistory, useParams } from "react-router-dom";
import firebase from "firebase";
import Chatfeed from "./Chatfeed";
import IconButton from "@material-ui/core/IconButton";
import "./styles.css";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "85vh"
  },
  paper1: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: "85vh"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  root1: {
    position: "absolute",
    top: "90%",
    width: "58%;"
  }
}));

function Chat(props) {
  const classes = useStyles();
  const [chat, setChat] = useState("");
  const [using, setUsers] = useState([]);
  const { userid, roomid } = useParams();
  const [chating, setChats] = useState([]);
  useEffect(() => {
    db.collection("users")
      .orderBy("timestap", "asc")
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            users: doc.data()
          }))
        );
      });
  }, []);

  const send = () => {
    db.collection("messages").add({
      chat: chat,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user_id_1: props.user.uid,
      user_id_2: roomid
    });
    setChat("");
  };
  useEffect(() => {
    if (userid) {
      db.collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setChats(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              chats: doc.data()
            }))
          );
        });
    }
  }, [userid]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            USERS ONLINE
            {using.map(({ id, users }) => (
              <Userlist
                key={id}
                id={id}
                username={users.usename}
                online={users.isonline}
                user={props.user}
                propic={users.photourl}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.paper1}>
            <div
              className="chatscroll"
              style={{ overflowY: "scroll", height: "550px" }}
            >
              {chating.map(({ id, chats }) => (
                <Chatfeed
                  key={id}
                  id={id}
                  chat={chats.chat}
                  username={chats.username}
                  user={props.user}
                  user_id_1={chats.user_id_1}
                  user_id_2={chats.user_id_2}
                />
              ))}
            </div>
            <Paper component="form" className={classes.root1}>
              <form>
                <InputBase
                  className={classes.input}
                  placeholder="type msessage"
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                />

                <SendIcon
                  type="submit"
                  style={{ position: "relative", left: "70%", top: "5px" }}
                  onClick={send}
                />
              </form>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
export default Chat;
