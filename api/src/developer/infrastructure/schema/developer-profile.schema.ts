import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeveloperProfileDocument = HydratedDocument<DeveloperProfileModel>;

@Schema({ collection: 'developer_profiles', timestamps: true })
export class DeveloperProfileModel {
  @Prop({ required: true, unique: true, index: true })
  userId!: string;

  @Prop({ required: true, enum: ['JUNIOR', 'PLENO', 'SENIOR'] })
  seniority!: string;

  @Prop({ type: [String], default: [] })
  stack!: string[];

  @Prop({
    type: [{ name: String, level: Number }],
    default: [],
  })
  skills!: { name: string; level: number }[];

  @Prop({ default: true })
  available!: boolean;
}

export const DeveloperProfileSchema = SchemaFactory.createForClass(DeveloperProfileModel);