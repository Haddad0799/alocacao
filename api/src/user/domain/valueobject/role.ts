// user/domain/valueobject/role.ts
export enum Role {
  ADMIN = 'ADMIN',       // gerencia usuários e projetos; acesso total
  MANAGER = 'MANAGER',   // cria projetos e aloca devs
  DEVELOPER = 'DEVELOPER' // vê apenas as próprias alocações
}