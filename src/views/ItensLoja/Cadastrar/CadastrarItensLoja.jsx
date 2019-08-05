import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import ptbrLocale from "date-fns/locale/pt-BR";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../../components/CustomAlert/CustomAlert.jsx";

import DataSelect from "../../../components/DataSelect/DataSelect.jsx";

import {
  CadastrarItemLoja,
  ObterItemLoja,
  AlterarItemLoja
} from "../../../services/api/itensLoja";

import { ListarProdutos } from "../../../services/api/produto";

import {
  whiteColor,
  blackColor
} from "assets/jss/material-dashboard-react.jsx";

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
  },
  colorBlack: {
    color: blackColor
  }
}));

export default function TextFields({ ...props }) {
  const classes = useStyles();

  const [tituloPagina, setTituloPagina] = React.useState("Cadastrar Item Loja");
  const [values, setValues] = React.useState({
    produto: null,
    tempoEntrarNoAr: new Date(),
    tempoDisponivel: null,
    icon: "",
    quantidadeVendida: 0,
    preco: 0,
    quantidadeDisponivel: 0,
    status: true,
    nome: "",
    descricao: "",
    hotSale: false
  });
  const [suggestions, setSuggestions] = React.useState([]);
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  useEffect(() => {
    const obterItemLoja = async () => {
      if (typeof props.match.params.itemId !== "undefined") {
        //values._id = props.match.params.produtoId;
        const response = await ObterItemLoja({
          itemId: props.match.params.itemId
        });

        response.data.retorno.status =
          response.data.retorno.status === 1 ? true : false;

        response.data.retorno.produto = {
          label:
            response.data.retorno.produto.codigo +
            " - " +
            response.data.retorno.produto.nome,
          value: response.data.retorno.produto._id
        };
        setValues(response.data.retorno);

        setTituloPagina("Alterar Item Loja");
        return;
      }

      listarProdutos();
    };

    const listarProdutos = async () => {
      const response = await ListarProdutos();
      let produtos = [];
      response.data.retorno.map(item => {
        return produtos.push({
          label: item.codigo + " - " + item.nome,
          value: item._id
        });
      });
      setSuggestions(produtos);
    };

    obterItemLoja();
  }, [props.match.params.itemId]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeComum = name => event => {
    setValues({ ...values, [name]: event });
  };

  const handleChangeChecked = name => event => {
    setValues({ ...values, [name]: event.target.checked });
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

  const salvarProduto = async e => {
    try {
      e.preventDefault();

      if (typeof values._id === "undefined") {
        const response = await CadastrarItemLoja({
          produto: values.produto.value,
          tempoDisponivel: values.tempoDisponivel,
          tempoEntrarNoAr: values.tempoEntrarNoAr,
          icon: values.icon,
          quantidadeVendida: values.quantidadeVendida,
          preco: values.preco,
          quantidadeDisponivel: values.quantidadeDisponivel,
          status: values.status,
          nome: values.nome,
          descricao: values.descricao,
          hotSale: values.hotSale
        });

        if (response.data.sucesso) {
          props.history.push(
            "/admin/cadastrar/item_loja/" + response.data.retorno._id
          );
          window.location.reload();
        } else {
          openAlert("warning", response.data.mensagem);
        }
        return;
      }

      const response = await AlterarItemLoja({
        _id: values._id,
        produto: values.produto.value,
        tempoDisponivel: values.tempoDisponivel,
        tempoEntrarNoAr: values.tempoEntrarNoAr,
        icon: values.icon,
        quantidadeVendida: values.quantidadeVendida,
        preco: values.preco,
        quantidadeDisponivel: values.quantidadeDisponivel,
        status: values.status,
        nome: values.nome,
        descricao: values.descricao,
        hotSale: values.hotSale
      });

      if (response.data.sucesso) {
        openAlert("success", "Registro alterado com sucesso!");
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("salvarProduto:", err);
    }
  };

  return (
    <form
      className={classes.container}
      autoComplete="off"
      onSubmit={salvarProduto}
    >
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" id="tableTitle">
            {tituloPagina}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={4}>
            <DataSelect
              label="Produto"
              placeholder="Selecione um produto de referência"
              onChange={handleChangeComum("produto")}
              disabled={values._id ? true : false}
              value={values.produto}
            >
              {suggestions}
            </DataSelect>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ margin: 8 }}
                  checked={values.hotSale}
                  onChange={handleChangeChecked("hotSale")}
                  value="hotSale"
                  color="primary"
                />
              }
              label="Tornar destaque na loja"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="nome"
            label="Nome"
            style={{ margin: 8 }}
            placeholder="Nome do item na loja"
            helperText="Nome do item na loja"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.nome}
            onChange={handleChange("nome")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="descricao"
            label="Descrição"
            style={{ margin: 8 }}
            placeholder="Descrição do item na loja"
            helperText="Descrição do item na loja"
            fullWidth
            multiline
            rows="4"
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.descricao}
            onChange={handleChange("descricao")}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={2}>
            <TextField
              id="preco"
              label="CPGold"
              style={{ margin: 8 }}
              placeholder="Preço em CPGold do item"
              helperText="Preço em CPGold do item"
              fullWidth
              type="number"
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              value={values.preco}
              onChange={handleChange("preco")}
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="quantidadeDisponivel"
            label="Quantidade disponível"
            style={{ margin: 8 }}
            placeholder="Quantidade disponível na loja"
            helperText="Quantidade disponível na loja"
            fullWidth
            type="number"
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.quantidadeDisponivel}
            onChange={handleChange("quantidadeDisponivel")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="quantidadeVendida"
            label="Quantidade Resgatada"
            style={{ margin: 8 }}
            className={classes.colorBlack}
            placeholder="Quantidade comprada pelos clientes"
            helperText="Quantidade comprada pelos clientes"
            fullWidth
            disabled
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.quantidadeVendida}
            onChange={handleChange("quantidadeVendida")}
          />
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbrLocale}>
            <DateTimePicker
              variant="inline"
              label="Data para entrar no ar"
              style={{ margin: 8 }}
              value={values.tempoEntrarNoAr}
              onChange={handleChangeComum("tempoEntrarNoAr")}
              format="dd/MM/yyyy HH:mm"
            />
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbrLocale}>
            <DateTimePicker
              variant="inline"
              label="Disponível Até"
              style={{ margin: 8 }}
              value={values.tempoDisponivel}
              onChange={handleChangeComum("tempoDisponivel")}
              format="dd/MM/yyyy HH:mm"
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ margin: 8 }}
                  checked={values.status}
                  onChange={handleChangeChecked("status")}
                  value="status"
                  color="primary"
                />
              }
              label="Ativo"
            />
          </FormGroup>
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
