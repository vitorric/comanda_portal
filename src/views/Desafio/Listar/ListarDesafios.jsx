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
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Snackbar from "@material-ui/core/Snackbar";
import CustomAlert from "../../../components/CustomAlert/CustomAlert.jsx";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

import { Link } from "react-router-dom";
import {
  ListarDesafios,
  AlterarDesafioStatus
} from "../../../services/api/desafios";

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
    id: "nome",
    numeric: false,
    disablePadding: false,
    label: "Nome"
  },
  {
    id: "emGrupo",
    numeric: false,
    disablePadding: false,
    label: "É em grupo?"
  },
  { id: "premio", numeric: false, disablePadding: false, label: "Prêmio" },
  {
    id: "tempoDuracao",
    numeric: false,
    disablePadding: false,
    label: "Disponível até"
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
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
          Desafios
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

export default function ListarDesafiosView() {
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
    const getData = async () => {
      const response = await ListarDesafios();
      setData(response.data.retorno);
      setDataBackup(response.data.retorno);
      setEmptyRows(response.data.retorno.length);
    };

    getData();
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
        return item.nome.toLowerCase().includes(filter.toLowerCase());
      })
    );
    openAlert("warning", "test");
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

  async function excluirItem(dataId, index) {
    console.log(dataId, index);
    setDialogOpen(true);
  }

  async function inativarItem(dataId) {
    const index = dataBackup.findIndex(
      x => x._id.toString() === dataId.toString()
    );

    dataBackup[index].status = dataBackup[index].status === 1 ? 0 : 1;

    const response = await AlterarDesafioStatus({
      desafioId: dataId,
      status: dataBackup[index].status
    });

    if (response.data.sucesso) {
      openAlert("success", "Registro alterado com sucesso!");

      setData(
        dataBackup.filter(item => {
          return item;
        })
      );
    } else {
      openAlert("warning", response.data.mensagem);
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
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
              label="Buscar desafio"
              style={{ margin: 8 }}
              placeholder="Buscar desafio"
              helperText="Digite o nome do desafio"
              margin="normal"
              fullWidth
              onChange={searchGrid()}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Link to={`/admin/cadastrar/desafio`}>
              <Tooltip title="Adicionar" className={classes.addButton}>
                <Fab color="primary" size="medium">
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Link>
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
                .map((dataItem, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={dataItem._id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {dataItem.nome}
                      </TableCell>
                      <TableCell>{dataItem.emGrupo ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        {dataItem.premio.produto
                          ? `${dataItem.premio.quantidade}x - ${dataItem.premio.produto.nome}`
                          : `${dataItem.premio.quantidade} CPGold`}
                      </TableCell>
                      <TableCell>{dataItem.tempoDuracao}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            dataItem.status === 1 ? "primary" : "secondary"
                          }
                          label={dataItem.status === 1 ? "Ativo" : "Inativo"}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/cadastrar/desafio/${dataItem._id}`}
                          className={classes.margin}
                        >
                          <Tooltip title="Editar">
                            <Fab color="primary" size="small">
                              <Icon>edit_icon</Icon>
                            </Fab>
                          </Tooltip>
                        </Link>
                        <Tooltip
                          title={
                            dataItem.status === true ? "Inativar" : "Ativar"
                          }
                          onClick={() => inativarItem(dataItem._id)}
                          className={classes.margin}
                        >
                          <Fab color="default" size="small">
                            {dataItem.status ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </Fab>
                        </Tooltip>
                        <Tooltip
                          title="Excluir"
                          onClick={() => excluirItem(dataItem._id, index)}
                          className={classes.margin}
                        >
                          <Fab color="secondary" size="small">
                            <DeleteIcon />
                          </Fab>
                        </Tooltip>
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
