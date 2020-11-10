import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2)
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
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

function Videochat() {
  const classes = useStyles();
  const [join, setJoin] = React.useState("");
  return (
    <div>
      VideoChat
      <div>
        <img
          src="https://storage.googleapis.com/gweb-cloudblog-publish/images/Google_Meet_1.max-2000x2000.jpg"
          alt=""
          width="500"
        />
        <br />
        <br />
        <h3>
          {" "}
          Note: while clicking the new meeting you will be redirected to meeting
          page copy the link send to your friends to join meeting.
          <br />
          Thank You .
        </h3>
        <br />

        <Button
          variant="outlined"
          color="secondary"
          href="https://murmuring-beach-29452.herokuapp.com/"
          target="_blank"
        >
          New meeting
        </Button>
        <h3>--or--</h3>
        <div>
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="paste link here"
              inputProps={{ "aria-label": "search google maps" }}
              value={join}
              onChange={(e) => setJoin(e.target.value)}
            />
          </Paper>
          <br />
          <Button
            variant="contained"
            color="primary"
            href={join}
            target="_blank"
          >
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Videochat;
