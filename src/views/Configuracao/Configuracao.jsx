import React, { useEffect } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../components/CustomAlert/CustomAlert.jsx";
import QRCode from "qrcode.react";

import {
  AlterarStatusEstab,
  ObterEstabelecimento
} from "../../services/api/estabelecimento";

export default function SwitchLabels() {
  const [values, setValues] = React.useState({
    _id: ""
  });

  const [
    configEstabelecimentoAtual,
    setConfigEstabelecimentoAtual
  ] = React.useState({ estaAberta: false });

  const handleChangeStatusOnline = name => event => {
    setConfigEstabelecimentoAtual({
      ...configEstabelecimentoAtual,
      [name]: event.target.checked
    });
    alterarStatusEstab(event.target.checked);
  };

  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

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
    const obterEstabelecimento = async () => {
      const response = await ObterEstabelecimento();

      setConfigEstabelecimentoAtual(
        response.data.retorno.configEstabelecimentoAtual
      );
      setValues(response.data.retorno);
    };
    obterEstabelecimento();
  }, []);

  async function alterarStatusEstab(online) {
    try {
      const response = await AlterarStatusEstab({
        status: online
      });

      if (response.data.sucesso) {
        openAlert(
          "success",
          online
            ? "Estabelecimento foi aberto!"
            : "Estabelecimento foi fechado!"
        );
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("alterarStatusEstab:", err);
    }
  }

  return (
    <Grid container spacing={3}>
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
      <Grid item xs={12}>
        <Typography variant="h6" id="tableTitle">
          configurações do estabelecimento
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={configEstabelecimentoAtual.estaAberta}
                onChange={handleChangeStatusOnline("estaAberta")}
                value="estaAberta"
                color="primary"
              />
            }
            label="Estabelecimento Aberto?"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <QRCode value={values._id} />
        <Typography variant="body2" gutterBottom>
          QRCode usado para os clientes entrarem no estabelecimento
        </Typography>
      </Grid>
    </Grid>
  );
}
