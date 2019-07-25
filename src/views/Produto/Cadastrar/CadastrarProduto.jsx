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

import { whiteColor } from "assets/jss/material-dashboard-react.jsx";

import {
  CadastrarProduto,
  ObterProduto,
  AlterarProduto
} from "../../../services/api/produto";

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

export default function TextFields({ ...props }) {
  const classes = useStyles();

  const [tituloPagina, setTituloPagina] = React.useState("Cadastrar Produto");
  const [values, setValues] = React.useState({
    codigo: 0,
    nome: "",
    descricao: "",
    custo: "",
    preco: "",
    estoque: "",
    status: true
  });

  useEffect(() => {
    const obterProduto = async () => {
      if (typeof props.match.params.produtoId !== "undefined") {
        //values._id = props.match.params.produtoId;
        const response = await ObterProduto({
          produtoId: props.match.params.produtoId
        });

        response.data.retorno.status =
          response.data.retorno.status === 1 ? true : false;
        setValues(response.data.retorno);

        setTituloPagina("Alterar Produto");
      }
    };

    obterProduto();
  }, []);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeChecked = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const salvarProduto = async e => {
    try {
      e.preventDefault();

      if (typeof values._id === "undefined") {
        const response = await CadastrarProduto(values);
        return;
      }

      const response = await AlterarProduto(values);
    } catch (err) {
      console.log("salvarProduto:", err);
    }
  };

  return (
    <form
      className={classes.container}
      autoComplete="off"
      onSubmit={salvarProduto}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" id="tableTitle">
            {tituloPagina}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={1}>
            <TextField
              required
              id="codigo"
              disabled={values._id ? true : false}
              label="Código"
              style={{ margin: 8 }}
              placeholder="Código do produto"
              helperText="Código do produto"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              value={values.codigo}
              onChange={handleChange("codigo")}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="nome"
            label="Nome"
            style={{ margin: 8 }}
            placeholder="Nome do produto"
            helperText="Nome do produto"
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
            placeholder="Descrição do produto"
            helperText="Descrição do produto"
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
        <Grid item xs={6}>
          <TextField
            id="custo"
            label="Custo"
            style={{ margin: 8 }}
            placeholder="Custo do produto"
            helperText="Custo do produto"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.custo}
            onChange={handleChange("custo")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="preco"
            label="Preço"
            style={{ margin: 8 }}
            placeholder="Preço do produto"
            helperText="Preço do produto"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            value={values.preco}
            onChange={handleChange("preco")}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={4}>
            <TextField
              id="estoque"
              label="Estoque"
              style={{ margin: 8 }}
              placeholder="Estoque do produto"
              helperText="Estoque do produto"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              value={values.estoque}
              onChange={handleChange("estoque")}
            />
          </Grid>
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
