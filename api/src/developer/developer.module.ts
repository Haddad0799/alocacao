import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import {
  DeveloperProfileModel,
  DeveloperProfileSchema,
} from './infrastructure/schema/developer-profile.schema';
import { MongooseDeveloperProfileRepository } from './infrastructure/adapter/mongoose-developer-profile.repository';                                   
import { DEVELOPER_PROFILE_REPOSITORY } from './domain/port/developer-profile.repository.port';
import { CreateDeveloperProfileUseCase } from './application/usecase/create-developer-profile.usecase';
import { DeveloperProfileController } from './presentation/rest/developer-profile.controller';
import { DeveloperExceptionFilter } from './presentation/filter/developer-exception.filter';
import { GetDeveloperProfileUseCase } from './application/usecase/get-developer-profile.usecase';
import { UpdateDeveloperProfileUseCase } from './application/usecase/update-developer-profile.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeveloperProfileModel.name, schema: DeveloperProfileSchema },
    ]),
  ],
  controllers: [DeveloperProfileController],
  providers: [
    CreateDeveloperProfileUseCase,
    GetDeveloperProfileUseCase,
    UpdateDeveloperProfileUseCase,
    {
      provide: DEVELOPER_PROFILE_REPOSITORY,
      useClass: MongooseDeveloperProfileRepository,
    },
    {
      provide: APP_FILTER,
      useClass: DeveloperExceptionFilter,
    },
  ],
})
export class DeveloperModule {}