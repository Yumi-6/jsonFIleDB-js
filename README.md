# Banco de dados simples node baseado em arquivis json em formato de lib  

## banco simples para armazenamento , consulta e persistencia de dados

## Comandos :

Inicialização 
``` js
let users = new storege();

```
informar a tabela (arquivo):
``` js
users.collection("users");

```
consulta simples
``` js
let result = users.get();
```
consulta com filtro

``` js
let result = users.where("id" , "=" , 1).get();
```

remover registro
``` js
let result = users.where("id" , "=" , 1).delete();
```

inserir registro
``` js
let result = users.insert({
    id:1,
    nome:"yumi"
});
```
Actualizar registro
``` js
users.where("id" , "=" , 1).update({
    nome:"jony",
    idade:18
});
```

exemplo completo

``` js
import storege from "./src/core/storege.js";

let users = new storege();

users.collection("users");

let result = users.insert({
    id:1,
    nome:"yumi"
});

let result = users.where("id" , "=" , 1).get();
console.log(result);
```
exemplo de atualização completo

``` js
import storege from "./src/core/storege.js";

let users = new storege();
users.collection("users");

users.where("id" , "=" , 1).update({
    nome:"jony",
    idade:18
});
```
