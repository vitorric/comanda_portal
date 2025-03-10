import Dashboard from "@material-ui/icons/Dashboard";
import Shop from "@material-ui/icons/Shop";
import ListAlt from "@material-ui/icons/ListAlt";
import CardGiftcard from "@material-ui/icons/CardGiftcard";
import FreeBreakfast from "@material-ui/icons/FreeBreakfast";
import Grade from "@material-ui/icons/Grade";
import Settings from "@material-ui/icons/Settings";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";

import ListarProduto from "views/Produto/Listar/ListarProduto.jsx";
import CadastrarProduto from "views/Produto/Cadastrar/CadastrarProduto.jsx";

import ListarItensLoja from "views/ItensLoja/Listar/ListarItensLoja.jsx";
import CadastrarItensLoja from "views/ItensLoja/Cadastrar/CadastrarItensLoja.jsx";

import ListarDesafios from "views/Desafio/Listar/ListarDesafios.jsx";
import CadastrarDesafios from "views/Desafio/Cadastrar/CadastrarDesafios.jsx";

import ListarComanda from "views/Comanda/Listar/ListarComanda.jsx";
import CadastrarComanda from "views/Comanda/Cadastrar/CadastrarComanda.jsx";

import PremioCompras from "views/PremioCompras/Listar/PremioCompras.jsx";

import Configuracao from "views/Configuracao/Configuracao.jsx";

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
    path: "/listar/comanda",
    name: "Comanda",
    icon: ListAlt,
    component: ListarComanda,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/cadastrar/comanda/:comandaId?",
    name: "Comanda",
    icon: ListAlt,
    component: CadastrarComanda,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/listar/premios/compras",
    name: "Prêmios e Compras",
    icon: CardGiftcard,
    component: PremioCompras,
    layout: "/admin"
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
    path: "/configuracao",
    name: "Configuração",
    icon: Settings,
    component: Configuracao,
    layout: "/admin",
    hidden: false
  }
];

export default dashboardRoutes;
