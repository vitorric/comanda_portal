import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import ListAltIcon from "@material-ui/icons/ListAlt";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function SubTitulo() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"CPG - Consume Playing Game 2019"}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function TermoUso() {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ListAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Termos de Uso e Condições
        </Typography>
        <div className={classes.root}>
          <ExpansionPanel
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                <b>1. Informações Gerais</b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                O presente Termo de Uso tem como objetivo esclarecer ao usuário
                o modo como são tratados seus dados pessoais. E apresentar os
                deveres do aplicativo e direitos do usuário.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                <b>2. Concentimento de Aceitação</b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Este é um contrato firmado com o APLICATIVO, de modo que se você
                utiliza-lo estará aceitando as condições citadas no presente
                termo. Caso não concorde com as condições, apenas não utilize o
                APLICATIVO.
                <br />
                Você reconhece que leu e analisou as condições de uso do
                presente termo e aceitou todas as condições a serem cumpridas.
                Em caso de usuário menor de idade, o mesmo deverá solicitar a
                permissão dos pais ou responsáveis, que também deverão concordar
                com as condições citadas no termo.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                <b>
                  3. Consentimento para coleta e uso das informações do usuário
                </b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Você concorda que o APLICATIVO pode coletar e usar suas
                informações de dados técnicos do seu dispositivo como: versões
                do sistema operacional, configurações, tipo de conexão à
                internet e dados pessoais do usuário.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography className={classes.heading}>
                <b>4. Deveres do Aplicativo Perante aos Dados do Usuário</b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <b>4.1</b> O APLICATIVO tem o dever de processar os dados
                pessoais do usuário de forma segura, integra e lícita.
                <br />
                <b>4.2</b> O APLICATIVO tem o dever de somente coletar os dados
                do usuário para finalidades determinadas pelo APLICATIVO.
                <br />
                <b>4.3</b> O APLICATIVO tem o dever de resguardar e proteger os
                dados do usuário de modo que não forneça a terceiros.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Typography className={classes.heading}>
                <b>5. Direitos do Usuário</b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <b>5.1</b> O usuário tem o direito de alterar ou excluir seus
                dados se necessário.
                <br />
                <b>5.2</b> O usuário tem o direito de não ser submetido a
                decições automatizadas. Caso hajam mudanças que necessitem de
                aceitações e decisões, as mesmas devem sempre ser tomadas pelo
                próprio usuário.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6bh-content"
              id="panel6bh-header"
            >
              <Typography className={classes.heading}>
                <b>6. Limitações de Responsabilidade do Aplicativo</b>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                O presente APLICATIVO estará em contínuo desenvolvimento e pode
                conter erros e, dessa forma, o forcecimento do mesmo é realizado
                "no estado em que se encontra". O APLICATIVO se isentam de
                quaisquer garantias e condições expressas ou implícitas
                incluindo, sem limitação, garantias de comercialização,
                adequação a um propósito específico, titularidade e não violação
                no que diz respeito ao aplicativo e qualquer um de seus
                componentes ou ainda à prestação ou não de serviços de suporte.
                O APLICATIVO não garante que a operação deste aplicativo seja
                contínua e sem defeitos.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
      <Box mt={5}>
        <SubTitulo />
      </Box>
    </Container>
  );
}
