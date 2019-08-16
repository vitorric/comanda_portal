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
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import DateFnsUtils from "@date-io/date-fns";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import ptbrLocale from "date-fns/locale/pt-BR";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Paper from "@material-ui/core/Paper";
import { blackColor, whiteColor } from "assets/jss/material-dashboard-react";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../../components/CustomAlert/CustomAlert.jsx";

import DataSelect from "../../../components/DataSelect/DataSelect.jsx";
import CustomUpload from "../../../components/CustomUpload/CustomUpload.jsx";

import {
  CadastrarDesafio,
  ObterDesafio,
  AlterarDesafio
} from "../../../services/api/desafios";

import { ListarProdutos } from "../../../services/api/produto";

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
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
  colorBlack: {
    color: blackColor
  }
}));

function getSteps() {
  return ["Informações", "Objetivo", "Premio", "Finalizar"];
}

export default function CadastrarDesafioView({ ...props }) {
  const classes = useStyles();

  const [tituloPagina, setTituloPagina] = React.useState("Cadastrar Desafio");
  const [tipoPremio, setTipoPremio] = React.useState("CPGold");
  const [tipoObjetivo, setTipoObjetivo] = React.useState("Dinheiro");

  const [premio, setPremio] = React.useState({
    tipo: "CPGold",
    quantidade: 0,
    produto: null
  });

  const [objetivo, setObjetivo] = React.useState({
    tipo: "Dinheiro",
    quantidade: 0,
    produto: null
  });

  const [values, setValues] = React.useState({
    icon: null,
    nome: "",
    descricao: "",
    status: true,
    emGrupo: false,
    tempoEntrarNoAr: new Date(),
    tempoDuracao: null
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [suggestions, setSuggestions] = React.useState([]);
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  useEffect(() => {
    const obterDesafio = async () => {
      if (typeof props.match.params.desafioId !== "undefined") {
        //values._id = props.match.params.produtoId;
        const response = await ObterDesafio({
          desafioId: props.match.params.desafioId
        });

        response.data.retorno.status =
          response.data.retorno.status === 1 ? true : false;

        setObjetivo({
          quantidade: response.data.retorno.objetivo.quantidade,
          produto: null
        });

        if (typeof response.data.retorno.objetivo.produto !== "undefined") {
          setObjetivo({
            quantidade: response.data.retorno.objetivo.quantidade,
            produto: {
              label:
                response.data.retorno.objetivo.produto.codigo +
                " - " +
                response.data.retorno.objetivo.produto.nome,
              value: response.data.retorno.objetivo.produto._id
            }
          });
        } else {
          setObjetivo({
            quantidade: response.data.retorno.objetivo.quantidade,
            produto: null
          });
        }

        if (typeof response.data.retorno.premio.produto !== "undefined") {
          setPremio({
            quantidade: response.data.retorno.premio.quantidade,
            produto: {
              label:
                response.data.retorno.premio.produto.codigo +
                " - " +
                response.data.retorno.premio.produto.nome,
              value: response.data.retorno.premio.produto._id
            }
          });
        } else {
          setPremio({
            quantidade: response.data.retorno.premio.quantidade,
            produto: null
          });
        }

        setTipoPremio(response.data.retorno.premio.tipo);
        setTipoObjetivo(response.data.retorno.objetivo.tipo);

        setValues(response.data.retorno);

        setTituloPagina("Alterar Desafio");
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

    obterDesafio();
  }, [props.match.params.desafioId]);

  function handleChangeRadioPremio(event) {
    setTipoPremio(event.target.value);
  }

  const handleChangePremio = name => event => {
    setPremio({ ...premio, [name]: event.target.value });
  };

  const handleChangeObjetivo = name => event => {
    setObjetivo({ ...objetivo, [name]: event.target.value });
  };

  function handleChangeRadioObjetivo(event) {
    setTipoObjetivo(event.target.value);
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeComum = (name, nomeObjeto) => event => {
    if (nomeObjeto === "Objetivo") {
      setObjetivo({ ...objetivo, [name]: event });
      return;
    }

    if (nomeObjeto === "Premio") {
      setPremio({ ...premio, [name]: event });
      return;
    }

    setValues({ ...values, [name]: event });
  };

  const handleChangeChecked = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

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

  const salvarDesafio = async e => {
    try {
      e.preventDefault();

      if (typeof values._id === "undefined") {
        let objPremio = {
          tipo: tipoPremio,
          quantidade: premio.quantidade
        };

        let objObjetivo = {
          tipo: tipoObjetivo,
          quantidade: objetivo.quantidade
        };

        if (tipoPremio === "Produto" && premio.produto !== null)
          objPremio.produto = premio.produto.value;

        if (tipoObjetivo === "Produto" && objetivo.produto !== null)
          objObjetivo.produto = objetivo.produto.value;

        const response = await CadastrarDesafio({
          nome: values.nome,
          descricao: values.descricao,
          status: values.status ? 1 : 0,
          emGrupo: values.emGrupo,
          tempoDuracao: values.tempoDuracao,
          tempoEntrarNoAr: values.tempoEntrarNoAr,
          premio: objPremio,
          objetivo: objObjetivo
        });

        if (response.data.sucesso) {
          props.history.push(
            "/admin/cadastrar/desafio/" + response.data.retorno._id
          );
          window.location.reload();
        } else {
          openAlert("warning", response.data.mensagem);
        }

        return;
      }

      const response = await AlterarDesafio({
        _id: values._id,
        nome: values.nome,
        descricao: values.descricao,
        status: values.status ? 1 : 0,
        tempoEntrarNoAr: values.tempoEntrarNoAr,
        tempoDuracao: values.tempoDuracao
      });

      if (response.data.sucesso) {
        openAlert("success", "Registro alterado com sucesso!");
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("salvarDesafio:", err);
    }
  };

  return (
    <form
      className={classes.container}
      autoComplete="off"
      onSubmit={salvarDesafio}
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
          <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {(index === 0 && (
                      <Paper
                        square
                        elevation={0}
                        className={classes.resetContainer}
                      >
                        {typeof values._id !== "undefined" && (
                          <CustomUpload
                            type="desafio"
                            id={values._id}
                            imgAtual={values.icon}
                          />
                        )}
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="nome"
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
                            onChange={handleChange("nome")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="descricao"
                            label="Descrição"
                            style={{ margin: 8 }}
                            placeholder="Descrição"
                            helperText="Descrição"
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
                          <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            locale={ptbrLocale}
                          >
                            <DateTimePicker
                              variant="inline"
                              label="Data para entrar no ar"
                              style={{ margin: 8 }}
                              value={values.tempoEntrarNoAr}
                              required
                              onChange={handleChangeComum(
                                "tempoEntrarNoAr",
                                "values"
                              )}
                              format="dd/MM/yyyy HH:mm"
                            />
                          </MuiPickersUtilsProvider>
                          <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            locale={ptbrLocale}
                          >
                            <DateTimePicker
                              variant="inline"
                              label="Disponível Até"
                              style={{ margin: 8 }}
                              value={values.tempoDuracao}
                              required
                              onChange={handleChangeComum(
                                "tempoDuracao",
                                "values"
                              )}
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
                      </Paper>
                    )) ||
                      (index === 1 && (
                        <Paper
                          square
                          elevation={0}
                          className={classes.resetContainer}
                        >
                          <Grid item xs={12}>
                            <FormGroup row>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    style={{ margin: 8 }}
                                    checked={values.emGrupo}
                                    onChange={handleChangeChecked("emGrupo")}
                                    value="emGrupo"
                                    color="primary"
                                    disabled={values._id ? true : false}
                                  />
                                }
                                label="Em Grupo"
                              />
                            </FormGroup>
                          </Grid>
                          <Grid item xs={12}>
                            <RadioGroup
                              aria-label="position"
                              name="position"
                              value={tipoObjetivo}
                              onChange={handleChangeRadioObjetivo}
                              row
                              style={{ margin: 8 }}
                            >
                              <FormControlLabel
                                value="Dinheiro"
                                control={
                                  <Radio
                                    disabled={values._id ? true : false}
                                    color="primary"
                                  />
                                }
                                label="Dinheiro"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value="Produto"
                                control={
                                  <Radio
                                    disabled={values._id ? true : false}
                                    color="primary"
                                  />
                                }
                                label="Produto"
                                labelPlacement="end"
                              />
                            </RadioGroup>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid item xs={4}>
                              <TextField
                                id="objetivoDinheiro"
                                label={
                                  tipoObjetivo === "Produto"
                                    ? "Quantidade de produtos"
                                    : "Quantidade em dinheiro"
                                }
                                style={{ margin: 8 }}
                                placeholder={
                                  tipoObjetivo === "Produto"
                                    ? "Quantidade de produtos"
                                    : "Quantidade em dinheiro"
                                }
                                helperText={
                                  tipoObjetivo === "Produto"
                                    ? "Quantidade de produtos a serem comprados"
                                    : "Quantidade de dinheiro a ser gasto"
                                }
                                fullWidth
                                type="number"
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true
                                }}
                                required
                                disabled={values._id ? true : false}
                                value={objetivo.quantidade}
                                onChange={handleChangeObjetivo("quantidade")}
                              />
                            </Grid>
                          </Grid>

                          {tipoObjetivo === "Produto" && (
                            <Grid item xs={12}>
                              <Grid item xs={4}>
                                <DataSelect
                                  label="Produto"
                                  placeholder="Selecione um produto de referência"
                                  onChange={handleChangeComum(
                                    "produto",
                                    "Objetivo"
                                  )}
                                  disabled={values._id ? true : false}
                                  value={objetivo.produto}
                                >
                                  {suggestions}
                                </DataSelect>
                              </Grid>
                            </Grid>
                          )}
                        </Paper>
                      )) ||
                      (index === 2 && (
                        <Paper
                          square
                          elevation={0}
                          className={classes.resetContainer}
                        >
                          <Grid item xs={12}>
                            <RadioGroup
                              aria-label="position"
                              name="position"
                              value={tipoPremio}
                              onChange={handleChangeRadioPremio}
                              row
                              style={{ margin: 8 }}
                            >
                              <FormControlLabel
                                value="CPGold"
                                control={
                                  <Radio
                                    disabled={values._id ? true : false}
                                    color="primary"
                                  />
                                }
                                label="CPGold"
                                labelPlacement="end"
                              />
                              <FormControlLabel
                                value="Produto"
                                control={
                                  <Radio
                                    disabled={values._id ? true : false}
                                    color="primary"
                                  />
                                }
                                label="Produto"
                                labelPlacement="end"
                              />
                            </RadioGroup>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid item xs={4}>
                              <TextField
                                id="premioGold"
                                label={
                                  tipoPremio === "Produto"
                                    ? "Quantidade"
                                    : "CPGold"
                                }
                                style={{ margin: 8 }}
                                placeholder={
                                  tipoPremio === "Produto"
                                    ? "Quantidade"
                                    : "Prêmio em CPGold"
                                }
                                helperText={
                                  tipoPremio === "Produto"
                                    ? "Quantidade de produtos"
                                    : "Prêmio em CPGold"
                                }
                                fullWidth
                                type="number"
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true
                                }}
                                required
                                disabled={values._id ? true : false}
                                value={premio.quantidade}
                                onChange={handleChangePremio("quantidade")}
                              />
                            </Grid>
                          </Grid>

                          {tipoPremio === "Produto" && (
                            <Grid item xs={12}>
                              <Grid item xs={4}>
                                <DataSelect
                                  label="Produto"
                                  placeholder="Selecione um produto de referência"
                                  onChange={handleChangeComum(
                                    "produto",
                                    "Premio"
                                  )}
                                  disabled={values._id ? true : false}
                                  value={premio.produto}
                                >
                                  {suggestions}
                                </DataSelect>
                              </Grid>
                            </Grid>
                          )}
                        </Paper>
                      )) ||
                      (index === 3 && (
                        <Paper
                          square
                          elevation={0}
                          className={classes.resetContainer}
                        >
                          <Typography variant="h6" id="tableTitle">
                            {!values._id
                              ? `Atenção: Ao cadastrar um desafio, o objetivo e o
                            prêmio não poderão ser alterados!`
                              : `Alterar Informações`}
                          </Typography>
                        </Paper>
                      ))}
                    <div className={classes.actionsContainer}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                      >
                        <ArrowBack
                          className={clsx(classes.leftIcon, classes.iconSmall)}
                        />
                        Voltar
                      </Button>

                      {index < 3 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}
                        >
                          <ArrowForward
                            className={clsx(
                              classes.leftIcon,
                              classes.iconSmall
                            )}
                          />
                          Próximo
                        </Button>
                      )}

                      {index === 3 && (
                        <Button
                          variant="contained"
                          type="submit"
                          color="primary"
                          className={classes.button}
                        >
                          <SaveIcon
                            className={clsx(
                              classes.leftIcon,
                              classes.iconSmall
                            )}
                          />
                          Salvar
                        </Button>
                      )}
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </div>
        </Grid>
      </Grid>
    </form>
  );
}
