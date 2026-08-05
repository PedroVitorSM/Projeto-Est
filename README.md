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


