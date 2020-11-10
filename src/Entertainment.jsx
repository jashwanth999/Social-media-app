import React, { useState, useEffect } from "react";
import Entertainment2 from "./Entertainment2";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { DropzoneArea } from "material-ui-dropzone";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import { db, storage } from "./firebase";
import firebase from "./firebase";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 480,
    margin: theme.spacing(2)
  },
  media: {
    height: 230
  },
  root: {
    display: "flex",
    width: 380,
    height: 100,
    marginTop: 10
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    height: 100
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

function Entertainment({ user }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
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
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

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
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("images").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              fileurl: url,
              username: user.displayName,
              propic: propic
            });
            setCaption("");
            setImage(null);
            handleClose();
          });
      }
    );
  };
  useEffect(() => {
    db.collection("images")
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
          <progress max="100" value={progress} width="100%" />
          <input type="file" onChange={handleimage} />
          <DialogContentText id="alert-dialog-slide-description">
            <DropzoneArea />
            <Paper component="form" className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="Add Caption"
                inputProps={{ "aria-label": "search google maps" }}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </Paper>
          </DialogContentText>
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
            <h3>Add your enjoyment here.....</h3>
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
            <h3>Add your enjoyment here.....</h3>
          </Box>
        )}
      </Grid>
      {images.map(({ id, value }) => (
        <Entertainment2
          key={id}
          id={id}
          imageurl={value.fileurl}
          user={user}
          timestamp={value.timestamp?.toDate().toISOString()}
          username={value.username}
          caption={value.caption}
          propic={propic}
        />
      ))}
    </div>
  );
}
export default Entertainment;
