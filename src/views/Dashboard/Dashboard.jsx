import React, { useEffect } from "react";
// nodejs library to set properties for components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import PeopleIcon from "@material-ui/icons/People";
import CardGiftIcon from "@material-ui/icons/CardGiftcard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import CardFooter from "components/Card/CardFooter";
import GridItem from "components/Grid/GridItem";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle";
import { ObterEstabelecimentoDashboard } from "../../services/api/estabelecimento";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    totalClientes: 0,
    totalDesafiosConcluidos: 0,
    totalProdutosFisicos: 0,
    totalProdutosLoja: 0
  });

  useEffect(() => {
    const obterEstabelecimentoDashboard = async () => {
      const response = await ObterEstabelecimentoDashboard();
      console.log(response.data);
      response.data.retorno.tipo = {
        label: response.data.retorno.tipo,
        value: response.data.retorno.tipo
      };

      setValues(response.data.retorno);
    };

    obterEstabelecimentoDashboard();
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <PeopleIcon />
              </CardIcon>
              <p className={classes.cardTitle}>Quantidade</p>
              <h3 className={classes.cardTitle}>{values.totalClientes}</h3>
            </CardHeader>
            <CardFooter stats>
              <div>
                <p>Total de Clientes Únicos</p>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <CardGiftIcon />
              </CardIcon>
              <p className={classes.cardTitle}>Quantidade</p>
              <h3 className={classes.cardTitle}>
                {values.totalDesafiosConcluidos}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div>
                <p>Total de Desafios Concluídos</p>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <LocalCafeIcon />
              </CardIcon>
              <p className={classes.cardTitle}>Quantidade</p>
              <h3 className={classes.cardTitle}>
                {values.totalProdutosFisicos}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div>
                <p>Total de Produtos Físicos Vendidos</p>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <ShoppingCartIcon />
              </CardIcon>
              <p className={classes.cardTitle}>Quantidade</p>
              <h3 className={classes.cardTitle}>{values.totalProdutosLoja}</h3>
            </CardHeader>
            <CardFooter stats>
              <div>
                <p>Total de Produtos da Loja Virtual Vendidos</p>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
