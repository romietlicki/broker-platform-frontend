# Broker Platform — Frontend (Angular 17)

## Pré-requisitos
- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`

## Setup

```bash
cd broker-platform-frontend
npm install
ng serve --open
```

Acesse em: `http://localhost:4200`

O proxy reverso redireciona `/api` para `http://localhost:8080` automaticamente.

## Estrutura de páginas

| Rota | Descrição | Autenticação |
|------|-----------|--------------|
| `/login` | Tela de login | Pública |
| `/register` | Cadastro de corretor | Pública |
| `/forgot-password` | Solicitar reset de senha | Pública |
| `/reset-password?token=...` | Redefinir senha | Pública |
| `/dashboard` | Painel principal (Clientes + Inadimplências) | Protegida |
| `/policies` | Lista completa de apólices | Protegida |
| `/delinquencies` | Controle de inadimplências | Protegida |
| `/commissions` | Comissionamento por período | Protegida |

## Build para produção

```bash
ng build --configuration production
```

Os arquivos gerados estarão em `dist/broker-platform-frontend`.
