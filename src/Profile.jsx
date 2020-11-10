import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { storage, db } from "./firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    position: "relative",
    left: "33%"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    justifyContent: "center"
  },
  root1: {
    flexGrow: 1
  }
}));
function Profile({ user }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { userid } = useParams();
  const [image, setImage] = useState(null);
  const [propic, setPropic] = useState(null);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const uploads = () => {
    const uploadTask = storage.ref(`userprofilepic/${image.name}`).put(image);

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
          .ref("userprofilepic")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("users").doc(userid).update({
              photourl: url
            });

            setImage(null);
            handleClose();
          });
      }
    );
  };
  useEffect(() => {
    if (userid && userid !== "undefined") {
      db.collection("users")
        .doc(userid)
        .onSnapshot((doc) => {
          setPropic(doc.data().photourl);
          setEmail(doc.data().email);
          setusername(doc.data().usename);
          setPassword(doc.data().password);
        });
    }
  }, [userid]);

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
      profile
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Choose your profile pic"}
        </DialogTitle>
        <DialogContent>
          <progress max="100" value={progress} width="100%" />
          <input type="file" onChange={handleimage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={uploads} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.root}>
                <Avatar
                  alt="Remy Sharp"
                  src={propic}
                  className={classes.large}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                Update
              </Button>
              <br />
              <div style={{ display: "inline-flex" }}>
                <h3> username :</h3> <h2>{username}</h2>
              </div>

              <br />
              <div style={{ display: "inline-flex" }}>
                <h3> Email :</h3> <h2>{email}</h2>
              </div>

              <br />
              <div style={{ display: "inline-flex" }}>
                <h3> Password :</h3> <h2>{password}</h2>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
export default Profile;
