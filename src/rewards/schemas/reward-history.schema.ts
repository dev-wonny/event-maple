import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RewardDeliveryType, RewardStatus } from '../../../../libs/common';
import { Reward, RewardSchema } from './reward.schema';

@Schema({ timestamps: true })
export class RewardHistory extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  eventId: string;

  @Prop({ type: [RewardSchema], required: true })
  reward: Reward[];

  @Prop({ type: Date, required: true })
  claimedAt: Date;

  @Prop({
    type: String,
    enum: Object.values(RewardDeliveryType),
    required: true,
  })
  deliveryType: RewardDeliveryType;

  @Prop({
    type: String,
    enum: Object.values(RewardStatus),
    required: true,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @Prop({ type: String, required: false })
  reason?: string;

  @Prop({
    type: Date,
    default: () =>
      new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () =>
      new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
  })
  updatedAt: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);

// 인덱스 추가
RewardHistorySchema.index({ userId: 1, eventId: 1 });
RewardHistorySchema.index({ status: 1 });
RewardHistorySchema.index({ claimedAt: 1 });
