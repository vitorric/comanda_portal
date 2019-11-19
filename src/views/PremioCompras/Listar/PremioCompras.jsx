import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../../components/CustomAlert/CustomAlert.jsx";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  ListarPremiosCompras,
  AlterarStatusEntrega
} from "../../../services/api/premioCompras";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  {
    id: "codigoAmigel",
    numeric: false,
    disablePadding: false,
    label: "Código Amigável"
  },
  {
    id: "nomeCliente",
    numeric: false,
    disablePadding: false,
    label: "Cliente"
  },
  {
    id: "nomeProduto",
    numeric: false,
    disablePadding: false,
    label: "Produto"
  },
  {
    id: "dataAdquirida",
    numeric: false,
    disablePadding: false,
    label: "Data Adquirida"
  },
  {
    id: "dataRetirada",
    numeric: false,
    disablePadding: false,
    label: "Data Retirada"
  },
  {
    id: "modoObtido",
    numeric: false,
    disablePadding: false,
    label: "Modo Obtido"
  },
  { id: "entregue", numeric: false, disablePadding: false, label: "Entregue" },
  { id: "acao", numeric: false, disablePadding: false, label: "Ação" }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? "right" : "left"}
            padding={row.disablePadding ? "none" : "default"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          PRÊMIOS E COMPRAS
        </Typography>
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  margin: {
    margin: theme.spacing(1)
  },
  addButton: {
    margin: theme.spacing(1),
    right: theme.spacing(3)
  }
}));

export default function ListarPremioCompraView() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nome");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [dataBackup, setDataBackup] = React.useState([]);
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  useEffect(() => {
    const getAllData = async () => {
      const response = await ListarPremiosCompras();
      setData(response.data.retorno);
      setDataBackup(response.data.retorno);
      setEmptyRows(response.data.retorno.length);
    };

    getAllData();
  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const searchGrid = () => event => {
    const filter = event.target.value;

    setData(
      dataBackup.filter(item => {
        return (
          item.chaveUnica.toLowerCase().includes(filter.toLowerCase()) ||
          item.produto.nome.toLowerCase().includes(filter.toLowerCase()) ||
          item.produto.codigo
            .toString()
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          item.cliente.codigo
            .toString()
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          item.cliente.nome.toLowerCase().includes(filter.toLowerCase())
        );
      })
    );
  };

  function handleCloseAlert() {
    setOptionsAlert({ ...optionsAlert, open: false });
  }

  const confirmarEntrega = (historicoCompraId, index) => async e => {
    try {
      e.preventDefault();

      index = index + page * rowsPerPage;

      const response = await AlterarStatusEntrega({
        historicoCompraId: historicoCompraId
      });

      if (response.data.sucesso) {
        dataBackup[index].infoEntrega.jaEntregue = true;
        dataBackup[index].infoEntrega.dataEntrega =
          response.data.retorno.infoEntrega.dataEntrega;

        setData(
          dataBackup.filter(item => {
            return item;
          })
        );

        console.log(response.data);
        openAlert("success", "Registro alterado com sucesso!");
      } else {
        openAlert("warning", response.data.mensagem);
      }
    } catch (err) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log("confirmarEntrega:", err);
    }
  };

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function openAlert(variant, message) {
    setOptionsAlert({
      variant: variant,
      message: message,
      open: true
    });
  }

  return (
    <div className={classes.root}>
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
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              id="busca"
              label="Buscar prêmio ou compra"
              style={{ margin: 8 }}
              placeholder="Buscar prêmio ou compra"
              helperText="Digite o código amigável da compra, nome ou código do produto/cliente"
              margin="normal"
              fullWidth
              onChange={searchGrid()}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        </Grid>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={data._id}>
                      <TableCell align="left">{data.chaveUnica}</TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {data.cliente.chaveAmigavel + " - " + data.cliente.nome}
                      </TableCell>
                      <TableCell align="left">
                        {data.produto.codigo +
                          " - " +
                          data.quantidade +
                          "x " +
                          data.produto.nome}
                      </TableCell>
                      <TableCell align="left">{data.createdAt}</TableCell>
                      <TableCell align="left">
                        {data.infoEntrega.dataEntrega}
                      </TableCell>
                      <TableCell align="left">{data.modoObtido}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            data.infoEntrega.jaEntregue
                              ? "primary"
                              : "secondary"
                          }
                          label={data.infoEntrega.jaEntregue ? "Sim" : "Não"}
                        />
                      </TableCell>
                      <TableCell>
                        {data.infoEntrega.jaEntregue ? (
                          ""
                        ) : (
                          <Tooltip
                            title="Confirmar Entrega"
                            onClick={confirmarEntrega(data._id, index)}
                            className={classes.margin}
                          >
                            <Fab color="primary" size="small">
                              <CheckCircleIcon />
                            </Fab>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows === 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Anterior"
          }}
          nextIconButtonProps={{
            "aria-label": "Próximo"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirma exclusão?</DialogTitle>
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
            onClick={handleDialogClose}
            color="primary"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
