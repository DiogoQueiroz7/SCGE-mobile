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
permitir a demonstracao e o desenvolvimento visual.

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
│   ├── services/
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

## Status

O app ja tem navegacao, telas visuais base e modo demo de login.
As proximas etapas sao completar os fluxos locais, CRUDs mockados e acabamento visual.
