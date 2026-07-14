import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/infrastructure/entities/user.entity';
import { SecurityModule } from '../security/security.module';
import { AuthController } from './presentation/auth.controller';
import { LoginUseCase } from './application/usecase/login.usecase';
import { RefreshTokenUseCase } from './application/usecase/refresh-token.usecase';
import { TOKEN_SIGNER } from './domain/port/token-signer.port';
import { JwtTokenSigner } from './infrastructure/adapter/jwt-token.signer';
import { USER_CREDENTIALS } from './domain/port/user-credentials.port';
import { TypeormUserCredentialsAdapter } from './infrastructure/adapter/typeorm-user-credentials.adapter';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity]),
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    { provide: TOKEN_SIGNER, useClass: JwtTokenSigner },
    { provide: USER_CREDENTIALS, useClass: TypeormUserCredentialsAdapter },
  ],
})
export class AuthModule {}