import React, { useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import GroupIcon from "@material-ui/icons/Group";
import InfoIcon from "@material-ui/icons/Info";
import ExposurePlus1Icon from "@material-ui/icons/ExposurePlus1";
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../../components/CustomAlert/CustomAlert.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import DataSelect from "../../../components/DataSelect/DataSelect.jsx";
import { FormatarDinheiro } from "../../../utils";

import {
  ObterComanda,
  CadastrarComanda,
  AdicionarProdutoComanda,
  ClientePagarComanda
} from "../../../services/api/comanda";

import { ObterClienteChaveUnica } from "../../../services/api/cliente";
import { ListarProdutos } from "../../../services/api/produto";

import {
  whiteColor,
  blackColor
} from "assets/jss/material-dashboard-react.jsx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    background: whiteColor,
    padding: theme.spacing(2),
    width: "98%"
  },
  tabPanel: {
    width: "98%"
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  iconSmall: {
    fontSize: 20
  },
  margin: {
    margin: theme.spacing(1)
  },
  colorBlack: {
    color: blackColor
  }
}));

export default function CadastrarComandaView({ ...props }) {
  const classes = useStyles();

  const [tituloPagina, setTituloPagina] = React.useState("Cadastrar Comanda");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    grupo: [],
    produtos: [],
    valorTotal: 0,
    createdAt: "",
    status: true,
    dataSaida: "",
    aberta: false
  });
  const [chaveUnicaBusca, setChaveUnicaBusca] = React.useState("");
  const [clienteComanda, setClienteComanda] = React.useState({
    apelido: "",
    chaveAmigavel: "",
    nome: "",
    _id: null
  });
  const [indexTab, setIndexTab] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState([]);
  const [novoProdutoComanda, setNovoProdutoComanda] = React.useState({
    produto: null,
    quantidade: 0,
    comanda: ""
  });
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });
  const [clientePagar, setClientePagar] = React.useState({
    clienteId: null,
    valorPagar: 0
  });

  function subtotal() {
    return values.valorTotal - valorPago();
  }

  function valorPago() {
    const valorPago = values.grupo
      .map(grupo => grupo.valorPago)
      .reduce((sum, i) => sum + i, 0);
    return valorPago;
  }

  useEffect(() => {
    const obterComanda = async () => {
      if (typeof props.match.params.comandaId !== "undefined") {
        novoProdutoComanda.comanda = props.match.params.comandaId;

        const response = await ObterComanda({
          comandaId: props.match.params.comandaId
        });

        response.data.retorno.status =
          response.data.retorno.status === 1 ? true : false;

        setValues(response.data.retorno);
        setTituloPagina("Alterar Comanda");
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

    obterComanda();
  }, [props.match.params.comandaId, novoProdutoComanda.comanda]);

  const handleChangeNovoProduto = name => event => {
    setNovoProdutoComanda({
      ...novoProdutoComanda,
      [name]: event.target.value
    });
  };

  const handleChangeClientePagar = name => event => {
    setClientePagar({
      ...clientePagar,
      [name]: event.target.value
    });
  };

  const hangleClientePagar = async e => {
    e.preventDefault();
    console.log(clientePagar.clienteId)
    try {
      const response = await ClientePagarComanda({
        clienteId: clientePagar.clienteId,
        comandaId: values._id,
        valorPago: clientePagar.valorPagar
      });

      if (response.data.sucesso) {
        window.location.reload();
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      console.log("hangleClientePagar: ", err);
    }
  };

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleChangetab(event, newValue) {
    setIndexTab(newValue);
  }

  const handleChangeComum = (name, nomeObjeto) => event => {
    if (nomeObjeto === "novoProduto")
      setNovoProdutoComanda({ ...novoProdutoComanda, [name]: event });
  };

  const obterClienteChaveUnica = async e => {
    e.preventDefault();

    try {
      const response = await ObterClienteChaveUnica({
        chaveAmigavel: chaveUnicaBusca
      });

      if (response.data.sucesso) {
        setClienteComanda(response.data.retorno);
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      console.log("obterClienteChaveUnica: ", err);
    }
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

  const confirmarCriacaoComanda = async e => {
    e.preventDefault();

    try {
      const response = await CadastrarComanda({
        clienteId: clienteComanda._id
      });

      if (response.data.sucesso) {
        props.history.push(
          "/admin/cadastrar/comanda/" + response.data.retorno._id
        );
        window.location.reload();
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("confirmarCriacaoComanda: ", err);
    }
  };

  const negarCriacaoComanda = async e => {
    e.preventDefault();

    try {
      setClienteComanda({
        apelido: "",
        chaveAmigavel: "",
        nome: "",
        _id: null
      });
      setChaveUnicaBusca("");
    } catch (err) {
      console.log("negarCriacaoComanda: ", err);
    }
  };

  const adicionarItemComanda = async e => {
    e.preventDefault();

    try {
      if (
        novoProdutoComanda.produto === null ||
        novoProdutoComanda.quantidade === 0
      ) {
        openAlert("warning", "Preencha todos os campos!");
        return;
      }

      const response = await AdicionarProdutoComanda({
        comandaId: novoProdutoComanda.comanda,
        quantidade: novoProdutoComanda.quantidade,
        produto: novoProdutoComanda.produto.value
      });

      if (response.data.sucesso) {
        openAlert("success", "Produto adicionado com sucesso!");
        AdicionarProdutoNaGrid(
          response.data.retorno.produtosComanda.produtos,
          response.data.retorno.valorTotal
        );
        //AtualizarGridGrupo(response.data.retorno.valorTotal);
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("adicionarItemComanda: ", err);
    }
  };

  function AdicionarProdutoNaGrid(novosProdutos, valorTotal) {
    setValues(prevState => {
      return { ...prevState, produtos: novosProdutos };
    });
    setValues(prevState => {
      return { ...prevState, valorTotal: valorTotal };
    });
  }

  async function adicionarProdutoExistente(produtoId) {
    try {
      const response = await AdicionarProdutoComanda({
        comandaId: novoProdutoComanda.comanda,
        quantidade: 1,
        produto: produtoId
      });

      if (response.data.sucesso) {
        openAlert("success", "Produto adicionado com sucesso!");
        AdicionarProdutoNaGrid(
          response.data.retorno.produtosComanda.produtos,
          response.data.retorno.valorTotal
        );
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("adicionarItemComanda: ", err);
    }
  }

  async function retirarProdutoExistente(produto) {
    console.log(produto);
  }

  async function fecharCliente(clienteId) {
    setDialogOpen(true);

    setClientePagar(prevState => {
      return { ...prevState, clienteId: clienteId };
    });
  }

  return (
    <form className={classes.container} autoComplete="off">
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
        {(typeof values._id === "undefined" && (
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Grid item xs={4}>
                <TextField
                  id="chaveAmigavel"
                  label="Chave amigável do cliente"
                  style={{ margin: 8 }}
                  className={classes.colorBlack}
                  placeholder="Chave amigável do cliente"
                  helperText="Insira a chave amigável do cliente"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={chaveUnicaBusca}
                  onChange={e => {
                    setChaveUnicaBusca(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={obterClienteChaveUnica}
                >
                  <SearchIcon
                    className={clsx(classes.leftIcon, classes.iconSmall)}
                  />
                  Buscar
                </Button>
              </Grid>
            </Grid>
            {clienteComanda._id !== null && (
              <Grid item xs={12} style={{ margin: "20px" }}>
                <Grid item xs={12}>
                  <Typography id="tableTitle"> RESULTADO</Typography>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Nome</TableCell>
                      <TableCell align="right">Apelido</TableCell>
                      <TableCell align="right">CPF</TableCell>
                      <TableCell align="right">Chave Amigável</TableCell>
                      <TableCell align="right">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="right">{clienteComanda.nome}</TableCell>
                      <TableCell align="right">
                        {clienteComanda.apelido}
                      </TableCell>
                      <TableCell align="right">{clienteComanda.cpf}</TableCell>
                      <TableCell align="right">
                        {clienteComanda.chaveAmigavel}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Confirmar" className={classes.margin}>
                          <Fab
                            color="primary"
                            size="small"
                            onClick={confirmarCriacaoComanda}
                          >
                            <ThumbUpAltIcon
                              className={clsx(
                                classes.leftIcon,
                                classes.iconSmall
                              )}
                            />
                          </Fab>
                        </Tooltip>
                        <Tooltip
                          title="Negar"
                          className={classes.margin}
                          onClick={negarCriacaoComanda}
                        >
                          <Fab color="secondary" size="small">
                            <ThumbDownAltIcon
                              className={clsx(
                                classes.leftIcon,
                                classes.iconSmall
                              )}
                            />
                          </Fab>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            )}
          </Grid>
        )) ||
          (values._id !== null && (
            <Grid item xs={12}>
              <AppBar position="static" color="default">
                <Tabs
                  value={indexTab}
                  onChange={handleChangetab}
                  variant="scrollable"
                  scrollButtons="on"
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="scrollable force tabs example"
                >
                  <Tab
                    label="INFORMAÇÕES"
                    icon={<InfoIcon />}
                    {...a11yProps(0)}
                  />
                  <Tab label="Grupo" icon={<GroupIcon />} {...a11yProps(1)} />
                  <Tab
                    label="Produtos"
                    icon={<FreeBreakfastIcon />}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </AppBar>
              <TabPanel value={indexTab} index={0} className={classes.tabPanel}>
                <TextField
                  id="valorTotal"
                  label="Valor da Comanda"
                  style={{ margin: 8 }}
                  className={classes.colorBlack}
                  placeholder="Valor da Comanda"
                  helperText="Valor da total da comanda"
                  fullWidth
                  disabled
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={FormatarDinheiro(values.valorTotal)}
                />
                <TextField
                  id="createdAt"
                  label="Data de Entrada"
                  style={{ margin: 8 }}
                  className={classes.colorBlack}
                  placeholder="Data de Entrada"
                  helperText="Data de criação da comanda"
                  fullWidth
                  disabled
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={values.createdAt}
                />
                <TextField
                  id="dataSaida"
                  label="Data de Fechamento"
                  style={{ margin: 8 }}
                  className={classes.colorBlack}
                  placeholder="Ainda não foi fechada!"
                  helperText="Data em que a comanda foi fechada"
                  fullWidth
                  disabled
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={values.dataSaida === null ? "" : values.dataSaida}
                />
              </TabPanel>
              <TabPanel value={indexTab} index={1} className={classes.tabPanel}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell align="left">É o lider/responsável?</TableCell>
                      <TableCell align="left">Já pagou?</TableCell>
                      <TableCell align="right">Valor Pago</TableCell>
                      <TableCell align="right">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.grupo.map(row => (
                      <TableRow key={row.cliente.nome}>
                        <TableCell>{row.cliente.nome}</TableCell>
                        <TableCell align="left">
                          <Chip
                            color={row.lider ? "primary" : "secondary"}
                            label={row.lider ? "Sim" : "Não"}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <Chip
                            color={row.jaPagou ? "primary" : "secondary"}
                            label={row.jaPagou ? "Sim" : "Não"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {FormatarDinheiro(row.valorPago)}
                        </TableCell>
                        <TableCell align="right">
                          {row.jaPagou ? (
                            ""
                          ) : (
                            <Tooltip
                              title="Fechar Cliente"
                              onClick={() => fecharCliente(row.cliente._id)}
                              className={classes.margin}
                            >
                              <Fab color="primary" size="small">
                                <MonetizationOnIcon />
                              </Fab>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={3}>Valor Total</TableCell>
                      <TableCell align="left">
                        {FormatarDinheiro(values.valorTotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>Valor Pago</TableCell>
                      <TableCell align="left">
                        {FormatarDinheiro(valorPago())}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}>Total Restante</TableCell>
                      <TableCell align="left">
                        {FormatarDinheiro(subtotal())}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabPanel>
              <TabPanel value={indexTab} index={2} className={classes.tabPanel}>
                {values.aberta ? (
                  <div>
                    <Grid item xs={12}>
                      <Grid item xs={4}>
                        <DataSelect
                          label="Adicionar novo Produto"
                          placeholder="Selecione um produto para adicionar na comanda"
                          onChange={handleChangeComum("produto", "novoProduto")}
                          value={novoProdutoComanda.produto}
                        >
                          {suggestions}
                        </DataSelect>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item xs={2}>
                        <TextField
                          id="quantidade"
                          label="Quantidade"
                          style={{ margin: 8 }}
                          className={classes.colorBlack}
                          placeholder="Quantidade"
                          helperText="Quantidade a ser adicionada"
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true
                          }}
                          value={novoProdutoComanda.quantidade}
                          onChange={handleChangeNovoProduto("quantidade")}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        onClick={adicionarItemComanda}
                      >
                        <AddIcon
                          className={clsx(classes.leftIcon, classes.iconSmall)}
                        />
                        Adicionar
                      </Button>
                    </Grid>
                  </div>
                ) : (
                  ""
                )}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell align="left">Preço</TableCell>
                      <TableCell align="left">Quantidade</TableCell>
                      <TableCell align="left">Preço total</TableCell>
                      <TableCell align="right">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.produtos.map(row => (
                      <TableRow key={row.produto.nome}>
                        <TableCell>{row.produto.nome}</TableCell>
                        <TableCell align="left">
                          {FormatarDinheiro(row.preco)}
                        </TableCell>
                        <TableCell align="left">{row.quantidade}</TableCell>
                        <TableCell align="left">
                          {FormatarDinheiro(row.precoTotal)}
                        </TableCell>
                        <TableCell align="right">
                          {values.aberta ? (
                            <Tooltip
                              title="Adicionar 1"
                              onClick={() =>
                                adicionarProdutoExistente(row.produto._id)
                              }
                              className={classes.margin}
                            >
                              <Fab color="primary" size="small">
                                <ExposurePlus1Icon />
                              </Fab>
                            </Tooltip>
                          ) : (
                            ""
                          )}{" "}
                          {values.aberta ? (
                            <Tooltip
                              title="Remover 1"
                              onClick={() => retirarProdutoExistente(row)}
                              className={classes.margin}
                            >
                              <Fab color="secondary" size="small">
                                <ExposureNeg1Icon />
                              </Fab>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabPanel>
            </Grid>
          ))}
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Pagamento do cliente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Valor a Pagar"
            helperText="Valor que o cliente ira pagar"
            type="number"
            fullWidth
            value={clientePagar.valorPagar}
            onChange={handleChangeClientePagar("valorPagar")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleDialogClose}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={hangleClientePagar}
            color="primary"
          >
            Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
