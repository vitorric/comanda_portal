import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import ImgUpload from "../../assets/img/iconUpload.png";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import CustomAlert from "../CustomAlert/CustomAlert.jsx";
import {
  UploadDesafioIcon,
  UploadItemLojaIcon,
  UploadProdutoIcon,
  UploadEstabelecimentoIcon
} from "../../services/api/upload";
import { APIUrl } from "../../utils";

const useStyles = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
}));

export default function UploadFiles({ ...props }) {
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [imgAtual, setImgAtual] = React.useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/png",
    maxSize: 1048576,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    onDropRejected: () => {
      openAlert("warning", "O tamanho da imagem deve ser menor que 1MB!");
    }
  });
  const [optionsAlert, setOptionsAlert] = React.useState({
    open: false,
    message: "",
    variant: "success"
  });

  useEffect(() => {
    const obterIcone = () => {
      if (
        typeof props.id !== "undefined" &&
        typeof props.imgAtual !== "undefined" &&
        props.imgAtual !== null
      ) {
        setImgAtual(
          APIUrl() + "files/" + props.type + "/icon/" + props.imgAtual
        );
      }
    };
    obterIcone();
  }, [props.id, props.type, props.imgAtual]);

  const enviarIcone = async e => {
    try {
      e.preventDefault();
      let response = null;

      if (props.type === "desafio") {
        if (acceptedFiles.length === 0) {
          openAlert("warning", "Selecione uma imagem!");
        }
        response = await UploadDesafioIcon(props.id, acceptedFiles[0]);
      }
      if (props.type === "item_loja") {
        if (acceptedFiles.length === 0) {
          openAlert("warning", "Selecione uma imagem!");
        }
        response = await UploadItemLojaIcon(props.id, acceptedFiles[0]);
      }
      if (props.type === "produto") {
        if (acceptedFiles.length === 0) {
          openAlert("warning", "Selecione uma imagem!");
        }
        response = await UploadProdutoIcon(props.id, acceptedFiles[0]);
      }
      if (props.type === "estabelecimento") {
        if (acceptedFiles.length === 0) {
          openAlert("warning", "Selecione uma imagem!");
        }
        response = await UploadEstabelecimentoIcon(acceptedFiles[0]);
      }

      if (response === null || !response.data.sucesso) {
        openAlert("warning", response.data.mensagem);
      } else {
        openAlert("success", "Registro alterado com sucesso!");
      }
    } catch (error) {
      openAlert("error", "Solicitação inválida, tente novamente!");
      console.log(enviarIcone, error);
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

  return (
    <section className="container">
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
      <Grid container>
        <Grid item xs={3}>
          <div
            {...getRootProps({ className: "dropzone" })}
            onChange={props.onChange}
          >
            <input {...getInputProps()} />
            {(files.length > 0 && (
              <img
                src={files[0].preview}
                alt="180x180"
                height="180"
                width="180"
              />
            )) ||
              (imgAtual !== null && (
                <img src={imgAtual} alt="180x180" height="180" width="180" />
              )) ||
              (imgAtual === null && files.length === 0 && (
                <img src={ImgUpload} alt="180x180" height="180" width="180" />
              ))}
            <p>Icone que sera visualizado no aplicativo</p>
          </div>
        </Grid>
        <Grid item xs={9}>
          <Button
            variant="contained"
            color="primary"
            style={{ top: "50%" }}
            onClick={enviarIcone}
          >
            <CloudUploadIcon
              className={clsx(classes.leftIcon, classes.iconSmall)}
            />
            Enviar Arquivo
          </Button>
        </Grid>
      </Grid>
    </section>
  );
}
