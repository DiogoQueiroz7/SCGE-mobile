# SCGE Mobile

App mobile do SCGE em Expo + Expo Router.

## Como Rodar

```powershell
cd mobile
npm install
npm run start
```

Depois, abra no Expo Go ou use:

```powershell
npm run android
npm run web
```

## URL Da API

A URL atual fica em `app.json`:

```json
"extra": {
  "apiUrl": "http://127.0.0.1:8000"
}
```

Para testar em celular físico, trocar `127.0.0.1` pelo IP da máquina na rede.

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

O app ja tem navegacao, telas visuais base, modo demo de login e estrutura para integrar a API.
As proximas etapas sao substituir mocks por chamadas reais e completar os CRUDs.
