# Nuvem Lanches

Nuvem lanches é um sistema de pedidos que simula uma aplicação de delivery de uma lanchonete.


## Tecnologia utilizadas

* ReactJS(Vite)
* NodeJS(Express)
* Docker
* Supabase

## Acesse a aplicação

[Nuvem lanches](https://exquisite-kleicha-c17f69.netlify.app/) 

[Nuvem Lanches api](https://nuvem-lanches.onrender.com/itens)


## Instalação e utilização local

pre-requisito para instalação:

- NodeJS 24.14.0(ou versão mais atual) 

clonar este repositório para sua própria máquina: 

``` ```

abrir uma janela no terminal(ou linha de comando) e navegar para o diretório server e instalar os pacotes(módulos do NodeJS):

``` 
cd server/ 
npm install

```

criar um arquivo .env na pasta server e preencher as chaves do supabase

```
SUPABASE_URL="url do seu projeto supabase aqui"
SUPABASE_ANON_KEY="chave anônima disponibilizada no projeto do supabase aqui"
ALLOWED_ORIGIN="local de origem do seu projeto frontend aqui(ex: http://localhost:5178)"

```
executar o backend da aplicação(para desenvolvimento):

``` 
npm run dev

```

abrir um nova janela no terminal(ou linha de comando) e navegar para o diretório client e instalar os pacotes:

``` 
cd client/ 
npm install

```
criar um arquivo .env na pasta client e preencher as chaves do supabase e da url da base da API:


```
VITE_SUPABASE_URL="url do projeto do supabase"
VITE_SUPABASE_ANON_KEY="chave anônima do projeto do supabase"
VITE_API_URL="url base da api aqui"

```

executar o frontend da aplicação(para o desenvolvimento):

``` 
npm run dev

```