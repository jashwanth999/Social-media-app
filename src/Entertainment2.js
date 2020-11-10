import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import Card from "@material-ui/core/Card";
import { db } from "./firebase";
import firebase from "firebase";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 480,
    margin: theme.spacing(2)
  },
  media: {
    height: 300
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 450
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function Entertainment2(props) {
  const { loading = false } = props;
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const sendcomment = (event) => {
    event.preventDefault();
    db.collection("images").doc(props.id).collection("comments").add({
      comment: comment,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      propic: props.propic
    });
    setComment("");
  };
  useEffect(() => {
    if (props.id) {
      db.collection("images")
        .doc(props.id)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [props.id]);

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
            />
          ) : (
            <Avatar alt="Ted talk" src={props.propic} />
          )
        }
        action={
          loading ? null : (
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            `${props.username}`
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            `${props.timestamp}`
          )
        }
      />
      {loading ? (
        <Skeleton animation="wave" variant="rect" className={classes.media} />
      ) : (
        <CardMedia
          className={classes.media}
          image={props.imageurl}
          title="Ted talk"
        />
      )}

      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
          <Typography variant="body2" color="textSecondary" component="p">
            {props.caption}
          </Typography>
        )}
        <br />
        <Divider />
        <br />
        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {props.user ? (
            <SendIcon onClick={sendcomment} />
          ) : (
            <SendIcon onClick={() => alert("please Login")} />
          )}
        </Paper>

        {comments.map((com) => (
          <div className="comments" style={{ display: "flex", margin: "10px" }}>
            <Avatar alt="Ted talk" src={com.propic} />
            <Typography style={{ marginTop: "5px", marginLeft: "8px" }}>
              {com.username}
            </Typography>

            <Typography
              style={{ marginTop: "5px", marginLeft: "20px" }}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {com.comment}
            </Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

Entertainment2.propTypes = {
  loading: PropTypes.bool
};
