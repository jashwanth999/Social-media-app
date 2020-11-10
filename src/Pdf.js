import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import InputBase from "@material-ui/core/InputBase";
import { db, storage } from "./firebase";
import firebase from "./firebase";
import Uploadpdf from "./Uploadpdf";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "200px"
  }
}));
function Pdf({ user }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState("");
  const [pdf, setPdf] = useState(null);
  const history = useHistory();
  const { yearid } = useParams();
  const [subname, setSubname] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [progress, setProgress] = useState(0);
  const uploads = () => {
    const uploadTask = storage.ref(`files/${pdf?.name}`).put(pdf);

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
          .ref("files")
          .child(pdf?.name)
          .getDownloadURL()
          .then((url) => {
            if (yearid) {
              db.collection("files").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                subname: subname,
                fileurl: url,
                username: user.displayName
              });
            }

            setSubname("");
            setPdf(null);
            handleClose();
            setProgress(0);
          });
      }
    );
  };
  useEffect(() => {
    db.collection("files")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPdfs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data()
          }))
        );
      });
  }, []);

  const handChange = (e) => {
    history.push(`/pdfs/${e.target.value}`);
    setYear(e.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlefile = (e) => {
    if (e.target.files[0]) {
      setPdf(e.target.files[0]);
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
          {"Please upload your files here"}
        </DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-label">year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            className="year"
            value={year}
            onChange={handChange}
          >
            <MenuItem value={1}>1styear</MenuItem>
            <MenuItem value={2}>2ndyear</MenuItem>
            <MenuItem value={3}>3rdyear</MenuItem>
            <MenuItem value={4}>4thyear</MenuItem>
          </Select>
          <br />
          <progress max="100" value={progress} width="100%" />
          <input type="file" onChange={handlefile} />
          <DialogContentText id="alert-dialog-slide-description">
            <Paper component="form" className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="Subject name"
                inputProps={{ "aria-label": "search google maps" }}
                value={subname}
                onChange={(e) => setSubname(e.target.value)}
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
        <Box
          boxShadow={3}
          bgcolor="background.paper"
          m={1}
          p={1}
          style={{ marginLeft: "14px", width: "30rem", height: "5rem" }}
          onClick={handleClickOpen}
        >
          <h3>Add your Files here.....</h3>
        </Box>
      </Grid>
      {pdfs.map(({ id, value }) => (
        <Uploadpdf
          key={id}
          id={id}
          fileurl={value.fileurl}
          caption={value.subname}
          user={user}
          username={value.username}
        />
      ))}
    </div>
  );
}
export default Pdf;
