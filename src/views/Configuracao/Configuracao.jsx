import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import CustomAlert from "../../components/CustomAlert/CustomAlert.jsx";
import QRCode from "qrcode.react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import { whiteColor } from "assets/jss/material-dashboard-react.jsx";

import DataSelect from "../../components/DataSelect/DataSelect.jsx";
import CustomUpload from "../../components/CustomUpload/CustomUpload.jsx";

import {
  AlterarStatusEstab,
  ObterEstabelecimento,
  AlterarEstabelecimento
} from "../../services/api/estabelecimento";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    background: whiteColor,
    padding: theme.spacing(2)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  iconSmall: {
    fontSize: 20
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function Configuracao() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    _id: "",
    email: "",
    tipo: "",
    nome: "",
    descricao: "",
    cnpj: "",
    horarioAtendimentoInicio: "",
    horarioAtendimentoFim: "",
    telefone: "",
    celular: "",
    emailContato: "",
    coordenadas: {
      lat: "",
      long: ""
    },
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      cep: "",
      estado: ""
    }
  });

  const [
    configEstabelecimentoAtual,
    setConfigEstabelecimentoAtual
  ] = React.useState({ estaAberta: false });

  const [suggestions, setSuggestions] = React.useState([]);
  const [suggestionsEstado, setSuggestionsEstado] = React.useState([]);
  const [estado, setEstado] = React.useState({});

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
      response.data.retorno.tipo = {
        label: response.data.retorno.tipo,
        value: response.data.retorno.tipo
      };

      setEstado({
        label: response.data.retorno.endereco.estado,
        value: response.data.retorno.endereco.estado
      });

      setValues(response.data.retorno);
    };

    const opcoesTipoEstab = () => {
      setSuggestions([
        {
          label: "Café ou Bistrô",
          value: "Café ou Bistrô"
        },
        {
          label: "Fast Food",
          value: "Fast Food"
        },
        {
          label: "Food Truck",
          value: "Food Truck"
        },
        {
          label: "Restaurante Buffet",
          value: "Restaurante Buffet"
        },
        {
          label: "Restaurante",
          value: "Restaurante"
        },
        {
          label: "Bar",
          value: "Bar"
        },
        {
          label: "Bar Molhado",
          value: "Bar Molhado"
        },
        {
          label: "Café ou Bistrô",
          value: "Café ou Bistrô"
        },
        {
          label: "Boteco",
          value: "Boteco"
        },
        {
          label: "Cervejaria",
          value: "Cervejaria"
        },
        {
          label: "Pub",
          value: "Pub"
        }
      ]);
    };

    const opcoesEstado = () => {
      setSuggestionsEstado([
        { value: "AC", label: "AC" },
        { value: "AL", label: "AL" },
        { value: "AP", label: "AP" },
        { value: "AM", label: "AM" },
        { value: "BA", label: "BA" },
        { value: "CE", label: "CE" },
        { value: "DF", label: "DF" },
        { value: "ES", label: "ES" },
        { value: "GO", label: "GO" },
        { value: "MA", label: "MA" },
        { value: "MT", label: "MT" },
        { value: "MS", label: "MS" },
        { value: "MG", label: "MG" },
        { value: "PA", label: "PA" },
        { value: "PB", label: "PB" },
        { value: "PR", label: "PR" },
        { value: "PE", label: "PE" },
        { value: "PI", label: "PI" },
        { value: "RJ", label: "RJ" },
        { value: "RN", label: "RN" },
        { value: "RS", label: "RS" },
        { value: "RO", label: "RO" },
        { value: "RR", label: "RR" },
        { value: "SC", label: "SC" },
        { value: "SP", label: "SP" },
        { value: "SE", label: "SE" },
        { value: "TO", label: "TO" }
      ]);
    };

    opcoesEstado();
    opcoesTipoEstab();
    obterEstabelecimento();
  }, []);

  const handleChangeComum = name => event => {
    setValues({ ...values, [name]: event });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeComposto = (name, subname) => event => {
    values[name][subname] = event.target.value;
    setValues({ ...values, values });
  };

  const handleChangeEstado = () => event => {
    setEstado(event);
  };

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

  const salvarEstabelecimento = async e => {
    try {
      e.preventDefault();

      const response = await AlterarEstabelecimento({
        tipo: values.tipo.value,
        descricao: values.descricao,
        horarioAtendimentoInicio: values.horarioAtendimentoInicio,
        horarioAtendimentoFim: values.horarioAtendimentoFim,
        telefone: values.telefone,
        celular: values.celular,
        endereco: {
          rua: values.endereco.rua,
          numero: values.endereco.numero,
          bairro: values.endereco.bairro,
          cidade: values.endereco.cidade,
          cep: values.endereco.cep,
          estado: estado.value
        },
        coordenadas: values.coordenadas
      });

      if (response.data.sucesso) {
        openAlert("success", "Registro alterado com sucesso!");
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("salvarEstabelecimento:", err);
    }
  };

  return (
    <form
      className={classes.container}
      autoComplete="off"
      onSubmit={salvarEstabelecimento}
    >
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
          {typeof values._id !== "undefined" && (
            <CustomUpload
              type="estabelecimento"
              id={values._id}
              imgAtual={values.icon}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <QRCode value={values._id} />
          <Typography variant="body2" gutterBottom>
            QRCode usado para os clientes entrarem no estabelecimento
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="nome"
            disabled
            label="Nome"
            style={{ margin: 8 }}
            placeholder="Nome"
            helperText="Nome"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.nome}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="cnpj"
            disabled
            label="CNPJ"
            style={{ margin: 8 }}
            placeholder="CNPJ"
            helperText="CNPJ"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.cnpj}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="email"
            disabled
            label="Email"
            style={{ margin: 8 }}
            placeholder="Email"
            helperText="Email de login"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.email}
          />
        </Grid>
        <Grid item xs={6}>
          <DataSelect
            label={"Segmento do Estabelecimento"}
            placeholder="Segmento do Estabelecimento"
            onChange={handleChangeComum("tipo")}
            value={values.tipo}
          >
            {suggestions}
          </DataSelect>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="descricao"
            label="Descrição"
            style={{ margin: 8 }}
            placeholder="Descrição"
            helperText="Descrição que aparece no aplicativo"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            multiline
            rows="4"
            onChange={handleChange("descricao")}
            value={values.descricao}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="horarioAtendimentoInicio"
            label="Inicio do Horário de Atendimento"
            style={{ margin: 8 }}
            placeholder="Inicio do Horário de Atendimento"
            helperText="Inicio do Horário de Atendimento"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChange("horarioAtendimentoInicio")}
            value={values.horarioAtendimentoInicio}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="horarioAtendimentoFim"
            required
            label="Fim do Horário de Atendimento"
            style={{ margin: 8 }}
            placeholder="Fim do Horário de Atendimento"
            helperText="Fim do Horário de Atendimento"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChange("horarioAtendimentoFim")}
            value={values.horarioAtendimentoFim}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="telefone"
            label="Telefone"
            style={{ margin: 8 }}
            placeholder="Telefone"
            helperText="Telefone"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChange("telefone")}
            value={values.telefone}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="celular"
            label="Celular"
            style={{ margin: 8 }}
            placeholder="Celular"
            helperText="Celular"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChange("celular")}
            value={values.celular}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="emailContato"
            label="Email de contato"
            style={{ margin: 8 }}
            placeholder="Email de contato"
            helperText="Email de contato"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChange("emailContato")}
            value={values.emailContato}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" id="tableTitleEndereco">
            Endereço
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="lat"
            required
            label="Latitude"
            style={{ margin: 8 }}
            placeholder="Latitude"
            helperText="Latitude"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("coordenadas", "lat")}
            value={values.coordenadas.lat}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="long"
            required
            label="Longitude"
            style={{ margin: 8 }}
            placeholder="Longitude"
            helperText="Longitude"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("coordenadas", "long")}
            value={values.coordenadas.long}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="rua"
            label="Rua"
            style={{ margin: 8 }}
            placeholder="Rua"
            helperText="Rua"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("endereco", "rua")}
            value={values.endereco.rua}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="numero"
            label="Número"
            style={{ margin: 8 }}
            placeholder="Número"
            helperText="Número"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("endereco", "numero")}
            value={values.endereco.numero}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="bairro"
            label="Bairro"
            style={{ margin: 8 }}
            placeholder="Bairro"
            helperText="Bairro"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("endereco", "bairro")}
            value={values.endereco.bairro}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="cidade"
            label="Cidade"
            style={{ margin: 8 }}
            placeholder="Cidade"
            helperText="Cidade"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("endereco", "cidade")}
            value={values.endereco.cidade}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="cep"
            label="CEP"
            style={{ margin: 8 }}
            placeholder="CEP"
            helperText="CEP"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleChangeComposto("endereco", "cep")}
            value={values.endereco.cep}
          />
        </Grid>
        <Grid item xs={6}>
          <DataSelect
            label={"Segmento do Estabelecimento"}
            placeholder="Segmento do Estabelecimento"
            onChange={handleChangeEstado()}
            value={estado}
          >
            {suggestionsEstado}
          </DataSelect>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit" color="primary">
            <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
            Salvar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
