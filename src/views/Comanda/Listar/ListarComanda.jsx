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
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import { Link } from "react-router-dom";
import { ListarComandas } from "../../../services/api/comanda";
import { FormatarDinheiro } from "../../../utils";

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
    id: "lider",
    numeric: false,
    disablePadding: false,
    label: "Responsável/Lider"
  },
  { id: "valorTotal", numeric: false, disablePadding: false, label: "Valor" },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Data de Abertura"
  },
  {
    id: "dataSaida",
    numeric: false,
    disablePadding: false,
    label: "Data de Fechamento"
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
          Comandas
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

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("lider.nome");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [dataBackup, setDataBackup] = React.useState([]);
  const [emptyRows, setEmptyRows] = React.useState(0);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  useEffect(() => {
    const getData = async () => {
      const response = await ListarComandas();
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
        return (
          item.lider.nome.toLowerCase().includes(filter.toLowerCase()) ||
          item.createdAt.toLowerCase().includes(filter.toLowerCase()) ||
          (item.dataSaida !== null &&
            item.dataSaida.toLowerCase().includes(filter.toLowerCase()))
        );
      })
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              id="busca"
              label="Buscar comanda"
              style={{ margin: 8 }}
              placeholder="Buscar comanda"
              helperText="Digite o nome do responsável ou alguma data"
              margin="normal"
              fullWidth
              onChange={searchGrid()}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Link to={`/admin/cadastrar/comanda`}>
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
                        {dataItem.lider.nome}
                      </TableCell>
                      <TableCell>
                        {FormatarDinheiro(dataItem.valorTotal)}
                      </TableCell>
                      <TableCell>{dataItem.createdAt}</TableCell>
                      <TableCell>{dataItem.dataSaida}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            dataItem.status === 1 ? "primary" : "secondary"
                          }
                          label={dataItem.status === 1 ? "Aberta" : "Fechada"}
                        />
                      </TableCell>
                      <TableCell className={classes.margin}>
                        <Link to={`/admin/cadastrar/comanda/${dataItem._id}`}>
                          <Tooltip title="Editar">
                            <Fab color="primary" size="small">
                              <Icon>edit_icon</Icon>
                            </Fab>
                          </Tooltip>
                        </Link>
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
    </div>
  );
}
