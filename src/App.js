import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Switch, Route, Redirect } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Talks from "./Talks";
import Entertainment from "./Entertainment";
import Profile from "./Profile";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import EmailIcon from "@material-ui/icons/Email";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonIcon from "@material-ui/icons/Person";
import { auth, db } from "./firebase";
import Pdf from "./Pdf";
import Chat from "./Chat.jsx";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import Videochat from "./Videochat";
import Avatar from "@material-ui/core/Avatar";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import "./styles.css";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SendIcon from "@material-ui/icons/Send";
const drawerWidth = 240;
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "black"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  margin: {
    margin: theme.spacing(1)
  },
  root1: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },

  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    position: "relative",
    bottom: "20px"
  },
  root2: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0),
      width: theme.spacing(70),
      height: theme.spacing(50)
    }
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  }
}));
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
}
function App(props) {
  const { window } = props;
  const classes = useStyles();

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const history = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [modalStyle] = React.useState(getModalStyle);
  const [opensignUp, setOpensignup] = React.useState(false);
  const [openlogin, setOpenlogin] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [isonline, setisonline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [propic, setPropic] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [live, setLive] = useState("");
  const [lives, setLives] = useState([]);
  const livechat = (event) => {
    event.preventDefault();
    db.collection("livechat").add({
      live: live,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setLive("");
  };
  useEffect(() => {
    db.collection("livechat")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setLives(snapshot.docs.map((doc) => doc.data()));
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handlelogin = () => {
    setOpenlogin(true);
  };

  const handlesignUp = () => {
    setOpensignup(true);
  };
  const handleClose = () => {
    setOpensignup(false);
    setOpenlogin(false);
    setOpen(false);
  };

  useEffect(() => {
    const can = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        setLoading(false);
        setAuthenticated(true);
      } else {
        setUser(null);
        setLoading(false);
        setAuthenticated(false);
      }
      return () => {
        can();
      };
    });
  }, []);
  const Signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })

      .then(() => {
        const userid = auth.currentUser.uid;
        setisonline(true);
        db.collection("users").doc(userid).set({
          email: email,
          password: password,
          usename: username,
          isonline: true,
          timestap: firebase.firestore.FieldValue.serverTimestamp()
        });
      })

      .catch((error) => alert(error.message));
    setUsername("");
    setEmail("");
    setPassword("");
    handleClose();
  };
  const signin = (event) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setisonline(true);
        const userid = auth.currentUser.uid;
        db.collection("users").doc(userid).update({
          isonline: true
        });
      })
      .catch((error) => alert(error.message));
    setEmail("");
    setPassword("");
    handleClose();
  };

  const useridpush = () => {
    history.push(`/Chat/${user?.uid}/:roomid`);
  };
  const signout = (event) => {
    event.preventDefault();
    setisonline(false);
    auth.signOut().then(() => {
      db.collection("users").doc(user.uid).update({
        isonline: false
      });
    });
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection("users")
        .doc(user?.uid)
        .onSnapshot((doc) => {
          setPropic(doc.data().photourl);
        });
    }
  }, [user?.uid]);
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <h3
        style={{
          textDecoration: "none",
          fontSize: "21px",
          display: "flex",
          color: "blue",
          fontStyle: "Normal"
        }}
      >
        {user ? (
          <div className={classes.root1}>
            <Avatar alt="Remy Sharp" src={propic} className={classes.large} />
          </div>
        ) : (
          <div className={classes.root1}>
            <Avatar alt="Remy Sharp" src={""} className={classes.large} />
          </div>
        )}

        {user?.displayName}
      </h3>
      <Divider style={{ color: "white" }} />
      <List>
        <ListItem button>
          <NavLink
            className="active-link"
            style={{
              textDecoration: "none",
              fontSize: "21px",
              color: "white",
              marginLeft: "8px",
              marginBottom: "14px"
            }}
            to="/"
          >
            Talks
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink
            className="active-link"
            style={{
              textDecoration: "none",
              fontSize: "21px",
              color: "white",
              marginLeft: "8px",
              marginBottom: "14px"
            }}
            to="/Entertainment"
          >
            Entertainment
          </NavLink>
        </ListItem>
        <ListItem button>
          <NavLink
            className="active-link"
            style={{
              textDecoration: "none",
              fontSize: "21px",
              color: "white",
              marginLeft: "8px"
            }}
            to="/pdfs/:yearid"
          >
            PDFs
          </NavLink>
        </ListItem>

        <ListItem button>
          <Button
            style={{ textDecoration: "none", fontSize: "19px", color: "white" }}
            onClick={useridpush}
          >
            Chat
          </Button>
        </ListItem>
        <ListItem button>
          <Button
            style={{ textDecoration: "none", fontSize: "19px", color: "white" }}
            onClick={() => {
              history.push(`/profile/${user?.uid}`);
            }}
          >
            Profile
          </Button>
        </ListItem>
        <ListItem button>
          <NavLink
            style={{
              textDecoration: "none",
              fontSize: "21px",
              color: "white",
              marginLeft: "8px"
            }}
            to="/Videochat"
          >
            Videochat
          </NavLink>
        </ListItem>
        <ListItem button>
          <Button color="primary" onClick={handleClickOpen}>
            LiveChat <FiberManualRecordIcon style={{ color: "red" }} />
          </Button>
        </ListItem>
        <ListItem button>
          {user ? (
            <Button color="secondary" onClick={signout}>
              Logout
            </Button>
          ) : (
            <ListItem button>
              <Button color="primary" onClick={handlelogin}>
                Login
              </Button>
              <Button color="primary" onClick={handlesignUp}>
                SignUp
              </Button>
            </ListItem>
          )}
        </ListItem>
      </List>
      primary
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  const SignUp = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <PersonIcon />
          </Grid>
          <Grid item>
            <TextField
              id="input-with-icon-grid"
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <EmailIcon />
          </Grid>
          <Grid item>
            <TextField
              id="input-with-icon-grid"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <VpnKeyIcon />
            </Grid>
            <Grid item>
              <TextField
                id="input-with-icon-grid"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Button
          style={{ position: "relattive", left: "250px", top: "30px" }}
          color="primary"
          onClick={Signup}
        >
          SignUp
        </Button>
      </div>
    </div>
  );
  const login = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <EmailIcon />
          </Grid>
          <Grid item>
            <TextField
              id="input-with-icon-grid"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <VpnKeyIcon />
            </Grid>
            <Grid item>
              <TextField
                id="input-with-icon-grid"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Button
          style={{ position: "relattive", left: "250px", top: "30px" }}
          color="primary"
          onClick={signin}
        >
          Login
        </Button>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Cbit Talks
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Switch>
          <Route path="/" component={() => <Talks user={user} />} exact />
          <Route
            path="/Entertainment"
            component={() => <Entertainment user={user} />}
          />
          <Route path="/pdfs/:yearid">
            <Pdf user={user} />
          </Route>
          <PrivateRoute
            path="/Chat/:userid/:roomid"
            authenticated={authenticated}
            component={() => <Chat user={user} />}
          ></PrivateRoute>
          <PrivateRoute path="/Videochat">
            <Videochat user={user} />
          </PrivateRoute>
          <PrivateRoute path="/profile/:userid">
            <Profile user={user} />
          </PrivateRoute>
          <Route component={Error} />
        </Switch>

        <Modal
          open={opensignUp}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {SignUp}
        </Modal>
        <Modal
          open={openlogin}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {login}
        </Modal>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Live Chat"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className={classes.root2}>
                <Paper elevation={2} style={{ overflowY: "scroll" }}>
                  {lives.map((e) => (
                    <div
                      style={{
                        padding: "1px",
                        boxShadow: "1px 5px 8px 0px rgba(0,0,0,0.2)",
                        width: "200px",
                        margin: "8px",
                        backgroundColor: "lightblue",
                        borderRadius: "10px"
                      }}
                    >
                      <h5 style={{ padding: "3px" }}>{e.live}</h5>
                    </div>
                  ))}
                </Paper>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Paper component="form" className={classes.root}>
              <form>
                <InputBase
                  className={classes.input}
                  placeholder="Add live chat"
                  inputProps={{ "aria-label": "search google maps" }}
                  style={{ width: "400px", marginRight: "30px" }}
                  value={live}
                  onChange={(e) => setLive(e.target.value)}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                  onClick={livechat}
                >
                  <SendIcon />
                </IconButton>
              </form>
            </Paper>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default App;
