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

## Mesclagem com a versão `modify`

A pasta `modify` (layout com template string, pesquisa com botões Pesquisar/Limpar) foi juntada
nesta pasta e apagada. Erros encontrados na junção e o que foi feito:

- `<body>` com um `>` sobrando antes (`><body>`) - removido
- Excluir com id que não existe apagava a ÚLTIMA tarefa (`findIndex` retorna -1 e `splice(-1, 1)` tira a última) - agora checa `-1` antes
- Mudar status com id inexistente quebrava (`tarefas[-1]`) - mesma checagem
- Pesquisar "pendente" mostrava todas as tarefas, porque a busca usava o texto do `<li>` inteiro, que inclui as opções do select - agora pesquisa só em assunto, responsável, descrição e status
- Tarefa nova aparecia mesmo com pesquisa ativa - agora a lista é redesenhada aplicando o filtro depois de adicionar, excluir ou mudar status
- Texto digitado com HTML (ex: `<b>oi</b>`) era renderizado pelo `innerHTML` - agora passa por `escapeHtml`
- Tarefas antigas `{ id, nome, check }` quebravam o `formatarData` (data `undefined`) - voltou a função `migrarTarefa` e data vazia mostra `--/--/----`
- Dava pra salvar término antes do início - agora mostra erro
- `label for="status"` da pesquisa apontava pro select do formulário - trocado para `filterInput`

# As tarefas 

Antes a tarefa era só `{ id, nome, check }`. Agora tem os campos necessarios. 


