import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DeveloperProfile } from '../../domain/entity/developer-profile.entity';
import type { DeveloperProfileRepositoryPort } from '../../domain/port/developer-profile.repository.port';
import {
  DeveloperProfileDocument,
  DeveloperProfileModel,
} from '../schema/developer-profile.schema';

@Injectable()
export class MongooseDeveloperProfileRepository
  implements DeveloperProfileRepositoryPort
{
  constructor(
    @InjectModel(DeveloperProfileModel.name)
    private readonly model: Model<DeveloperProfileDocument>,
  ) {}

  async save(profile: DeveloperProfile): Promise<DeveloperProfile> {
  const updated = await this.model
    .findOneAndUpdate(
      { userId: profile.userId },
      {
        $set: {
          userId: profile.userId,
          seniority: profile.seniority,
          stack: profile.stack,
          skills: profile.skills,
          available: profile.available,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    )
    .exec();

  return this.toDomain(updated!);
}

  async findByUserId(userId: string): Promise<DeveloperProfile | null> {
    const doc = await this.model.findOne({ userId }).exec();

    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  private toDomain(doc: DeveloperProfileDocument): DeveloperProfile {
    return DeveloperProfile.restore(
      doc._id.toString(),
      doc.userId,
      doc.seniority as any,
      doc.stack,
      doc.skills,
      doc.available,
    );
  }
}