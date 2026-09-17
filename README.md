# Gerenciador de Tarefas
Cada tarefa tem responsável, data de início, data de término, assunto, descricão e status
(pendente/em andamento/finalizado).

salvo no localstorage, reload não perde nada

Os arquivos estão em `gerenciador-tarefas/frontend/src/`.

só abrir o `index.html` no navegador.

Se quiser rodar num  localhost:

```
cd gerenciador-tarefas/frontend/src
python -m http.server 8000
```

## => http://localhost:8000

## Erros

Botton Excluir nao realiza o pedido 
Adiconar repentimante parou depois da alteração de somente para dia (provavel id errado, f12 retorna : at form.onsubmit (script.js:168:55) OLHAR DEPOIS)

## Soluções
Excluir - estava com uma função que eu apaguei sem querer, tive que pesquisar sobre 
Adicionar tarefa - id como data ao inves de dia
resolvi todos pelo deltools

# As tarefas 

Antes a tarefa era só `{ id, nome, check }`. Agora tem os campos necessarios. 


# Juntando com o modify

juntei o codigo com a pasta `modify`, agora é uma pasta só.
Excluir com id errado apagava a ultima tarefa - agora checa o -1 do findIndex antes

# Etapa 2 - Backend

comecei em `gerenciador-tarefas/backend/`

`npm init -y` - cria o package.json (nome, bibliotecas e comandos do projeto)
`npm install express` - baixa o express na node_modules e cria o package-lock.json

node_modules não vai pro git, se apagar é só rodar `npm install` de novo
proximo passo: server.js
