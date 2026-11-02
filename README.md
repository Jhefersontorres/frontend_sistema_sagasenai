# Sistema GP de Avaliação - SENAI | Sinop

Frontend estático em HTML, CSS e JavaScript para cadastro de escuderias,
avaliações do Grand Prix SENAI e divulgação dos resultados.
O cadastro de escuderias inclui nome, turma, mentor, curso, etapa, período e
escola.

## Configuração da API

Em desenvolvimento, o frontend usa `http://127.0.0.1:8000` quando servido em
`localhost` ou `127.0.0.1`. Para apontar manualmente para outra API, defina em
`js/config.js`:

```js
window.SISTEMA_GP_API_URL = "http://127.0.0.1:8000";
```

Em produção, a URL da API é inserida no build por meio da variável
`SISTEMA_GP_API_URL`; não coloque credenciais nem a URL do banco neste
repositório.

A resposta JSON da API é validada centralmente em `js/api.js`; respostas HTTP
com erro são lançadas como erros e devem ser apresentadas pela tela que iniciou
a ação. Os textos retornados pela API são escapados antes de serem inseridos
em templates HTML.

## Deploy independente na Vercel

Importe este repositório como um projeto Vercel, com **Root Directory** na
raiz. Defina `SISTEMA_GP_API_URL` nas variáveis do projeto com a URL HTTPS de
produção do backend, por exemplo `https://seu-backend.vercel.app`. A
configuração da Vercel usa `python build_frontend.py` e publica o diretório
`public/`.

Publique o backend antes do frontend para obter sua URL. No projeto Vercel do
backend, configure `CORS_ALLOWED_ORIGINS` com a URL exata de produção deste
frontend. Se houver domínios de Preview que precisem acessar a API, inclua-os
explicitamente no backend.
