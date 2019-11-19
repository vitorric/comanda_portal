import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../components/CustomAlert/CustomAlert.jsx";

//Comunicao com API
import { AlterarSenhaApp } from "../services/api/cliente";
import { login, logout } from "../services/auth";
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

export default function RecuperarSenha(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    password: "",
    confirmarPassword: ""
  });
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  const [info, setInfo] = React.useState({
    email: "",
    token: ""
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

  useEffect(() => {
    const checarParametros = () => {
      if (
        typeof props.match.params.token === "undefined" ||
        typeof props.match.params.email === "undefined"
      ) {
        props.history.push("/login");
        return;
      }

      setInfo({
        token: props.match.params.token,
        email: props.match.params.email
      });
    };

    checarParametros();
  }, [props.history, props.match.params.token, props.match.params.email]);

  const handleRecuperarSenha = async e => {
    e.preventDefault();

    if (values.password !== values.confirmarPassword) {
      openAlert("warning", "Senhas não conferem!");
      return;
    }

    try {
      login(info.token, "");

      const response = await AlterarSenhaApp({
        email: info.email,
        token: info.token,
        novaSenha: md5(values.password)
      });

      if (response.data.sucesso) {
        openAlert("success", "Senha alterada com sucesso!");
        logout();
        return;
      }

      logout();
      openAlert("warning", response.data.mensagem);
    } catch (err) {
      logout();
      openAlert("error", "Solicitação inválida, tente novamente!");
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
          Altere sua senha do aplicativo!
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleRecuperarSenha}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nova Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange("password")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmarPassword"
            label="Confirmar Nova Senha"
            type="password"
            id="confirmarPassword"
            autoComplete="current-password"
            value={values.confirmarPassword}
            onChange={handleChange("confirmarPassword")}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            alterar senha
          </Button>
          {/* <Grid container direction="row" justify="center" alignItems="center">
            <LinkUI href="#" variant="body2">
              Esqueci a senha
            </LinkUI>
          </Grid> */}
        </form>
      </div>
      <Box mt={5}>
        <SubTitulo />
      </Box>
    </Container>
  );
}
