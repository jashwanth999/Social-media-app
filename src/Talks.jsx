import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import "./Talks.css";
import { db, storage } from "./firebase";
import firebase from "./firebase";
import Talks2 from "./Talks2.js";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Talks({ user }) {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState("");
  const [propic, setPropic] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      db.collection("users")
        .doc(user?.uid)
        .onSnapshot((doc) => {
          if (doc.data().photourl) {
            setPropic(doc.data().photourl);
          }
        });
    }
  }, [user?.uid]);
  const uploads = () => {
    const uploadTask = storage.ref(`talkimages/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("talkimages")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("talkimages").add({
              question: question,
              fileurl: url,
              propic: propic,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setQuestion("");
            setImage(null);
            handleClose();
          });
      }
    );
  };
  useEffect(() => {
    db.collection("talkimages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setImages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data()
          }))
        );
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleimage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Whats on your mind"}
        </DialogTitle>
        <DialogContent>
          <textarea
            placeholder="What is your question ?"
            className="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>
          <br></br>
          <progress max="100" value={progress} width="100%" />
          <input type="file" onChange={handleimage} />
          <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={uploads} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} sm={4}>
        {user ? (
          <Box
            boxShadow={3}
            bgcolor="background.paper"
            m={1}
            p={1}
            style={{
              marginLeft: "14px",
              width: "30rem",
              height: "6rem",
              cursor: "pointer"
            }}
            onClick={handleClickOpen}
          >
            <h3>Add your talks here.....</h3>
          </Box>
        ) : (
          <Box
            boxShadow={3}
            bgcolor="background.paper"
            m={1}
            p={1}
            style={{
              marginLeft: "14px",
              width: "30rem",
              height: "6rem",
              cursor: "pointer"
            }}
            onClick={() => alert("please Login")}
          >
            <h3>Add your talks here.....</h3>
          </Box>
        )}
      </Grid>

      {images.map(({ id, value }) => (
        <Talks2
          key={id}
          id={id}
          imageurl={value.fileurl}
          user={user}
          timestamp={value.timestamp?.toDate().toISOString()}
          username={value.username}
          question={value.question}
          propic={value.propic}
        />
      ))}
    </div>
  );
}
export default Talks;
