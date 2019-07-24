import React, { useEffect } from "react";
import clsx from "clsx";
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
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import { Link } from "react-router-dom";
import { ListarDesafios } from "../../../services/api/desafios";

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
    disablePadding: true,
    label: "Nome"
  },
  { id: "emGrupo", numeric: false, disablePadding: false, label: "Em Grupo" },
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
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "Select all desserts" }}
          />
        </TableCell>
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
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

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            itens loja - {numSelected} selecionados
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            itens loja
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
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
  const [orderBy, setOrderBy] = React.useState("nome");
  const [selected, setSelected] = React.useState([]);
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
      const response = await ListarDesafios();
      setData(response.data.retorno);
      setDataBackup(response.data.retorno);
      setEmptyRows(response.data.retorno.length);
    };

    getData();
  }, []);

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = data.map(n => n.nome);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const searchGrid = () => event => {
    const filter = event.target.value;

    setData(
      dataBackup.filter(item => {
        return item.nome.toLowerCase().includes(filter.toLowerCase());
      })
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((dataItem, index) => {
                  const isItemSelected = isSelected(dataItem.nome);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, dataItem.nome)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={dataItem.nome}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {dataItem.nome}
                      </TableCell>
                      <TableCell>{dataItem.emGrupo}</TableCell>
                      <TableCell>
                        {dataItem.objetivo.produto
                          ? `${dataItem.premio}x - ${dataItem.objetivo.produto.nome}`
                          : `${dataItem.premio} CPGold`}
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
                      <TableCell className={classes.margin}>
                        <Link to={`/admin/cadastrar/desafio/${dataItem._id}`}>
                          <Tooltip title="Editar">
                            <Fab color="primary" size="small">
                              <Icon>edit_icon</Icon>
                            </Fab>
                          </Tooltip>
                        </Link>
                        <Link to="/admin" className={classes.margin}>
                          <Tooltip title="Excluir">
                            <Fab color="secondary" size="small">
                              <DeleteIcon />
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
