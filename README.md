
# Portal - Comanda Gameficada

## Introdução
Este é um portal administativo desenvolvido em ReactJS.

## Preparação
Antes de iniciar, é necessário iniciar a API, pois sem ela, o portal não irá funcionar. Acesse  [aqui](https://github.com/vitorric/comanda_api) e siga os passos.

## Estrutura de pasta

```bash
├───public
└───src
    ├───assets
    │   ├───css
    │   ├───github
    │   ├───img
    │   │   └───faces
    │   └───jss
    │       └───material-dashboard-react
    │           ├───components
    │           ├───layouts
    │           └───views
    ├───components
    │   ├───...
    ├───layouts
    ├───services
    │   ├───api
    │   │   ├───cliente
    │   │   ├───comanda
    │   │   ├───desafios
    │   │   ├───estabelecimento
    │   │   ├───itensLoja
    │   │   ├───login
    │   │   ├───produto
    │   │   └───upload
    │   └───auth
    ├───utils
    └───views
        ├───...
```

## Executando o Portal

* Faça o clone deste projeto (será criado uma pasta chamada comanda_portal)
* Inicie a API
* Acesse a pasta do projeto, abra o terminal e instale as dependências:
```bash
npm install
```
 * Após isso, basta iniciar o portal.
```bash
npm start
```

Caso tudo tenha sido executado corretamente, será apresentado no terminal as seguintes mensagens:

```
Local:            http://localhost:8080/       
On Your Network:  http://SEUIPLOCAL:8080/   
```

O portal estará rondando na portal 8080, então basta acessar [htpp://localhost:8080/](htpp://localhost:8080/).

 ## Conexões
 
Dentro da pasta **utils**, existe um arquivo **index.js** e dentro dele há a conexão para a API.
```javascript
export const APIUrl = () => "http://localhost:3000/";
```
