import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LinkUI from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../components/CustomAlert/CustomAlert.jsx";

//Comunicao com API
import { LoginEstabelecimento } from "../services/api/login";
import { login } from "../services/auth";
import md5 from "md5";

function SubTitulo() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"CPG - Consume Playing Game 2019"}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    email: "estab1@email.com",
    password: "1234"
  });
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  function handleCloseAlert() {
    setOptionsAlert({ ...optionsAlert, open: false });
  }

  function openAlert(variant, message) {
    setOptionsAlert({
      variant: variant,
      message: message,
      open: true
    });
  }

  const handleLogin = async e => {
    e.preventDefault();

    const { email, password } = values;

    if (!email || !password) {
      openAlert("warning", "Preencha o email e a senha!");
    } else {
      try {
        const response = await LoginEstabelecimento({
          email,
          password: md5(password)
        });

        if (response.data.sucesso) {
          login(
            response.data.retorno.token,
            JSON.stringify(response.data.retorno.estabelecimento)
          );
          props.history.push("/admin");
          return;
        }

        openAlert("warning", response.data.mensagem);
      } catch (err) {
        openAlert("error", "Solicitação inválida, tente novamente!");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={optionsAlert.open}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
      >
        <CustomAlert
          onClose={handleCloseAlert}
          variant={optionsAlert.variant}
          message={optionsAlert.message}
        />
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Acesse sua conta
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange("email")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange("password")}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Grid container direction="row" justify="center" alignItems="center">
            <LinkUI href="#" variant="body2">
              Esqueci a senha
            </LinkUI>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <SubTitulo />
      </Box>
    </Container>
  );
}
