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

# (=> http://localhost:8000

## Erros

# As tarefas 

Antes a tarefa era só `{ id, nome, check }`. Agora tem os campos necessarios. 

### Guardar a data como objeto Date não funciona

Minha primeira ideia foi salvar as datas como `new Date()`. Só que o
stringify transforma em texto, e quando lê de volta continua texto.
Aí o primeiro `.getTime()` depois do F5 da erro.
O input `date` já devolve um texto, então guardo
desse jeito mesmo. Como receb ano-mês-dia, dá pra comparar direto com `<` e `>`
como texto normal, que é o que uso pra ver se o término é antes do início.



