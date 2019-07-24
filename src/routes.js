import Dashboard from "@material-ui/icons/Dashboard";
import Shop from "@material-ui/icons/Shop";
import ListAlt from "@material-ui/icons/ListAlt";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";
import Grade from "@material-ui/icons/Grade";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";

import ListarProduto from "views/Produto/Listar/ListarProduto.jsx";
import CadastrarProduto from "views/Produto/Cadastrar/CadastrarProduto.jsx";

import ListarItensLoja from "views/ItensLoja/Listar/ListarItensLoja.jsx";
import CadastrarItensLoja from "views/ItensLoja/Cadastrar/CadastrarItensLoja.jsx";

import ListarDesafios from "views/Desafio/Listar/ListarDesafios.jsx";
import CadastrarDesafios from "views/Desafio/Cadastrar/CadastrarDesafios.jsx";

import Teste from "views/Testes/Teste.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/comanda",
    name: "Comanda",
    icon: ListAlt,
    component: DashboardPage,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/listar/produto",
    name: "Produto",
    icon: FreeBreakfast,
    component: ListarProduto,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/cadastrar/produto/:produtoId?",
    name: "Produto",
    icon: FreeBreakfast,
    component: CadastrarProduto,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/listar/itens_loja",
    name: "Itens Loja",
    icon: Shop,
    component: ListarItensLoja,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/cadastrar/item_loja/:itemId?",
    name: "Itens Loja",
    icon: Shop,
    component: CadastrarItensLoja,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/listar/desafios",
    name: "Desafios",
    icon: Grade,
    component: ListarDesafios,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/cadastrar/desafio/:desafioId?",
    name: "Desafios",
    icon: Grade,
    component: CadastrarDesafios,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/testes",
    name: "testes",
    icon: Grade,
    component: Teste,
    layout: "/admin",
    hidden: false
  }
];

export default dashboardRoutes;
