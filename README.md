# Gerenciador de Tarefas

## Descrição

Projeto de uma lista de tarefas feita em HTML, CSS e JavaScript puro, sem
framework nenhum. As tarefas ficam salvas no localStorage do navegador, então
não some nada quando recarrega a página.

Os arquivos estão em `gerenciador-tarefas/frontend/src/`.

## Como rodar

Não precisa instalar nada. É só abrir o arquivo
`gerenciador-tarefas/frontend/src/index.html` no navegador.

Se quiser rodar servindo por http (dá pra usar o python que já vem instalado):

```
cd gerenciador-tarefas/frontend/src
python -m http.server 8000
```

E abrir http://localhost:8000

## Erros encontrados e soluções

### Espaço no nome da pasta

A pasta se chamava "parte 1", com espaço no meio. Isso dá problema pra usar no
terminal (tem que ficar colocando aspas em tudo), vira %20 quando é uma URL e
costuma quebrar script de deploy.

Renomeei tudo pra `gerenciador-tarefas/frontend/src/`. Usei `git mv` no lugar de
mover na mão pro git entender que foi renomeação e não arquivo novo.

### A página travava se o localStorage tivesse lixo

O código fazia `JSON.parse(localStorage.getItem('tarefas'))` direto na linha 7.
Se o que estivesse salvo não fosse um JSON válido o parse lançava erro, e como
isso acontece logo no começo do arquivo, nada depois disso rodava — a página
abria totalmente em branco e sem responder a nada.

Dá pra reproduzir abrindo o DevTools e rodando:

```
localStorage.setItem('tarefas', 'abc')
```

Coloquei um try/catch em volta. Se der erro, começa com a lista vazia em vez de
morrer. Também botei um `Array.isArray` porque tem coisa que passa no parse sem
ser lista (`null`, `42`, `"abc"` com aspas) e ia quebrar na hora de percorrer o
array depois.
