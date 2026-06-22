# SCGE Mobile

App mobile do SCGE em Expo + Expo Router.

## Como Rodar

```powershell
cd SCGE-mobile
npm install
npm run start
```

Depois, abra no Expo Go ou use:

```powershell
npm run android
npm run web
```

## Login Demo

Para acessar a demo local, use:

```text
E-mail: demo@scge.com
Senha: 12345678
```

Tambem existe o botao `Entrar em modo demo` na tela de login.

## Backend

Este app mobile nao depende de backend. As telas usam dados locais/mockados para
permitir a demonstracao e o desenvolvimento visual. O CRUD local fica centralizado
em `src/providers/DataProvider.tsx`.

## Estrutura

```text
SCGE-mobile/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   └── (app)/
│   │       ├── (tabs)/
│   │       │   ├── dashboard.tsx
│   │       │   ├── inventario.tsx
│   │       │   ├── movimentacoes.tsx
│   │       │   └── relatorios.tsx
│   │       └── admin/
│   │           ├── usuarios.tsx
│   │           └── perfis-acesso.tsx
│   ├── components/
│   ├── constants/
│   ├── providers/
│   └── types/
```

## Divisao Inicial

- Diogo: `src/app/(auth)/` e `src/app/(app)/(tabs)/inventario.tsx`
- Fernando: `src/app/(app)/(tabs)/dashboard.tsx`, `src/app/(app)/(tabs)/_layout.tsx` e estrutura Expo
- Gabriel: `src/app/(app)/(tabs)/movimentacoes.tsx` e `src/app/(app)/(tabs)/relatorios.tsx`
- Joao: `src/app/(app)/admin/usuarios.tsx` e `src/app/(app)/admin/perfis-acesso.tsx`

## Componentes Base

- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/TextField.tsx`
- `components/ui/Feedback.tsx`
- `components/layout/Screen.tsx`
- `providers/DataProvider.tsx`

## Status

O app ja tem navegacao, modo demo de login e CRUDs locais para a apresentacao.

- Auth: login demo, recuperar senha, redefinir senha, feedbacks e redirect de usuario autenticado.
- Inventario: listar, buscar, filtrar, criar, editar, ativar e inativar produtos.
- Movimentacoes: entrada, saida e ajuste atualizando o saldo do produto.
- Relatorios: gerar relatorio local, filtrar e preparar compartilhamento/exportacao.
- Dashboard: indicadores derivados dos dados locais, alertas, atividades recentes e atalhos administrativos.
- Usuarios: buscar, criar, editar, ativar e inativar usuarios.
- Perfis: criar, editar, ativar/inativar e selecionar permissoes.

## Checklist Das Tasks

- [x] `SCGE-01` Desenvolver tela de Login
- [x] `SCGE-02` Desenvolver tela de Esqueci Senha
- [x] `SCGE-03` Desenvolver tela de Redefinir Senha
- [x] `SCGE-04` Criar feedbacks de erro/sucesso nas telas de acesso
- [x] `SCGE-05` Desenvolver tela principal de Inventario
- [x] `SCGE-06` Exibir produtos em lista/cards no mobile
- [x] `SCGE-07` Criar busca por nome/codigo
- [x] `SCGE-08` Preparar explicacao da UX de entrada do app e inventario
- [x] `SCGE-09` Criar projeto Expo
- [x] `SCGE-10` Configurar Expo Router
- [x] `SCGE-11` Criar navegacao principal
- [x] `SCGE-12` Criar layout autenticado
- [x] `SCGE-13` Desenvolver tela de Dashboard
- [x] `SCGE-14` Criar cards de indicadores
- [x] `SCGE-15` Criar secao de alertas e atividades recentes
- [x] `SCGE-16` Explicar navegacao, estrutura de pastas e Expo Router na apresentacao
- [x] `SCGE-17` Criar formulario de Novo Produto
- [x] `SCGE-18` Criar formulario de Editar Produto
- [x] `SCGE-19` Criar filtros de categoria e status do produto
- [x] `SCGE-20` Implementar acoes de cadastrar, editar e inativar produto
- [x] `SCGE-21` Desenvolver tela de Movimentacoes
- [x] `SCGE-22` Criar formulario de entrada/saida/ajuste
- [x] `SCGE-23` Desenvolver tela de Relatorios
- [x] `SCGE-24` Explicar produtos, movimentacoes e relatorios na apresentacao
- [x] `SCGE-25` Desenvolver tela de Gestao de Usuarios
- [x] `SCGE-26` Criar acoes de criar, editar e inativar usuario
- [x] `SCGE-27` Desenvolver tela de Perfis de Acesso
- [x] `SCGE-28` Criar acoes de criar, editar e inativar perfil
- [x] `SCGE-29` Ajustar area administrativa
- [x] `SCGE-30` Explicar permissoes e administracao na apresentacao
- [x] `SCGE-31` Ajustar backend para Expo: sem backend, app preparado com dados locais
- [x] `SCGE-32` Corrigir autenticacao real: fluxo demo local documentado
- [x] `SCGE-33` Validar CRUD principal
- [ ] `SCGE-34` Testar app no celular/emulador
- [x] `SCGE-35` Revisar visual geral
- [x] `SCGE-36` Preparar demo final
- [ ] `SCGE-37` Ensaiar apresentacao

Validacao local feita em web; o teste em celular/emulador e o ensaio ficam como etapa final do grupo.
