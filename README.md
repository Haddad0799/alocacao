# Alocacao

API fullstack desenvolvida com **NestJS + React** como projeto de portfólio, com foco deliberado em segurança de aplicação (OWASP Top 10).

A motivação foi prática: depois de uma entrevista técnica onde não soube responder bem perguntas sobre OWASP, decidi estudar o tema a fundo e aplicar o que aprendi aqui. Este README documenta o que foi coberto, o raciocínio por trás de cada decisão, e o que ainda falta.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript |
| Banco relacional | MySQL + TypeORM |
| Banco de documentos | MongoDB + Mongoose |
| Frontend | React 19 + Vite + Tailwind |
| Autenticação | JWT (access + refresh token) |
| Containers | Docker + Docker Compose |

---

## Como rodar

```bash
# 1. Suba os bancos
docker compose up -d

# 2. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com seus valores

# 3. Backend
cd api
npm install
npm run start:dev

# 4. Frontend
cd web
npm install
npm run dev
```

---

## Arquitetura

O backend segue **Clean Architecture** com separação por módulos (`allocation`, `auth`, `developer`, `project`, `user`, `security`). Cada módulo tem suas camadas de `application`, `domain`, `infrastructure` e `presentation` independentes.

O módulo `security/` é isolado e expõe apenas uma porta (`PasswordHasherPort`), implementada com Argon2, qualquer outro módulo que precisar de hash depende da abstração, não da implementação.

---

## Segurança — O que foi aplicado e por quê

### A01 — Broken Access Control

**RBAC com guard global:** o `JwtAuthGuard` é aplicado globalmente em `main.ts`. Todas as rotas são protegidas por padrão, rotas públicas precisam ser marcadas explicitamente com `@Public()`. Isso evita o erro mais comum: esquecer de proteger uma rota nova.

**Controle por papel:** `RolesGuard` + enum `Role` (`ADMIN`, `MANAGER`, `DEVELOPER`) protegem endpoints por papel. Managers não podem criar admins, developers não podem criar projetos.

**Ownership — prevenção de IDOR:** um developer só acessa os próprios dados. Em `find-allocations.usecase.ts`, se o usuário logado é `DEVELOPER`, o sistema usa o `id` do JWT para buscar as alocações — a rota não aceita nenhum parâmetro de id externo. O perfil de developer funciona da mesma forma: sempre lê e escreve pelo `id` extraído do token via `@CurrentUser()`, nunca por um id vindo do body ou da URL.

### A02 — Cryptographic Failures

**Argon2id para senhas** (`api/src/security/adapter/argon2.hasher.ts`), não bcrypt. Argon2id venceu o Password Hashing Competition e é resistente a ataques com GPU por ser memory-hard, ou seja são projetados para exigir uma quantidade grande de RAM por cálculo, tornando o paralelismo caro em hardware real. O bcrypt só é custoso em CPU, tornando mais fácil escalar horizontalmente e executar ataques em paralelo.

**Segredos JWT distintos:** `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` são chaves separadas. Vazar um não compromete o outro.

**Access token de vida curta (15 min) + refresh token em cookie HttpOnly:** o access token expira rápido, limitando a janela de dano se vazar. O refresh token fica em cookie `httpOnly: true`, `sameSite: strict`, `secure` em produção, inacessível a JavaScript, impedindo roubo via XSS.

**Access token em memória no frontend** (`web/src/api/client.ts`): o token fica numa variável JS, nunca em `localStorage` ou `sessionStorage`. O custo é perder o token num reload de página, por isso existe o interceptor de refresh automático: qualquer requisição que retorna 401 busca um novo token via cookie e repete a chamada original de forma transparente.

### A03 — Injection

**DTOs + ValidationPipe global:** todo input passa por `class-validator`. O pipe global usa `whitelist: true` + `forbidNonWhitelisted: true`, campos não declarados no DTO são rejeitados, não apenas ignorados. Isso previne mass assignment (injetar campos extras para alterar dados que não deveriam ser alteráveis).

**Sem queries dinâmicas:** TypeORM e Mongoose são usados sempre com objetos tipados vindos de DTOs validados. Não há `$where`, `eval` ou concatenação de string em nenhuma query.

### A05 — Security Misconfiguration

- `helmet()` ativo com headers de segurança padrão.
- CORS restrito a uma origin fixa via variável de ambiente, sem wildcard `*`.
- `synchronize` do TypeORM desabilitado em produção (evita alteração automática de schema).
- Segredos apenas em `.env`, que está no `.gitignore` e nunca foi commitado. Só `.env.example` (sem valores reais) é versionado.

### A08 / A10 — Integridade e SSRF

Não há upload de arquivo, `eval`, deserialização de dados externos, nem chamada HTTP de saída que use URL vinda do usuário. Essas categorias não se aplicam ao formato atual.

---

## Lacunas identificadas — próximos passos

Reconhecer o que falta faz parte de entender segurança de verdade.

**A04/A07 — Sem rate limiting no login e no refresh**
Hoje não há nada impedindo força bruta de senha. A correção seria `@nestjs/throttler` nesses endpoints com limite de tentativas por IP.

**A04/A07 — Logout não revoga o refresh token no servidor**
O logout atual limpa o cookie no cliente. Um refresh token vazado antes do logout continua válido até expirar (7 dias). A solução seria versionamento por usuário: uma coluna `tokenVersion` na entidade, incrementada no logout — tokens com versão antiga seriam automaticamente rejeitados.

**A09 — Sem logging de eventos de segurança**
Login falho, acesso negado por role, tentativa de acessar recurso de outro usuário — nada disso deixa rastro hoje. Sem visibilidade para detectar um ataque em andamento. A correção seria logging estruturado (Winston/Pino) nos guards e casos de uso críticos.

**A06 — Dependências não utilizadas**
`passport`, `passport-jwt` e `pg` estão instalados mas não são usados (a autenticação é feita manualmente via `JwtService`). Aumentam a superfície de ataque sem necessidade.

---

## Referência de arquivos

| Tema | Arquivo |
|---|---|
| Hash de senha | `api/src/security/adapter/argon2.hasher.ts` |
| Emissão de JWT | `api/src/auth/infrastructure/adapter/jwt-token.signer.ts` |
| Guard de autenticação | `api/src/auth/infrastructure/guard/jwt-auth.guard.ts` |
| Guard de papéis | `api/src/auth/infrastructure/guard/roles.guard.ts` |
| Cookies / login / logout | `api/src/auth/presentation/auth.controller.ts` |
| Ownership em alocações | `api/src/allocation/application/usecase/find-allocations.usecase.ts` |
| Validação global | `api/src/main.ts` |
| Filtro de exceções | `api/src/common/filter/http-exception.filter.ts` |
| Token em memória | `web/src/api/client.ts` |
