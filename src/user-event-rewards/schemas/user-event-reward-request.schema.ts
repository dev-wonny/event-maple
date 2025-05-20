import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';
import { RewardStatus } from '../../../../libs/common/enums/reward-status.enum';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardType } from '../../../../libs/common/enums/reward-type.enum';

@Schema({ timestamps: true })
export class UserEventRewardRequest extends Document {
  @ApiProperty({
    description: '유저 ID',
    example: 'user-123',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  @Prop({ required: true })
  eventId: string;

  @ApiProperty({
    description: '보상 ID',
    example: '60d21b4667d0d8992e610c87',
  })
  @Prop({ required: true })
  rewardId: string;

  @ApiProperty({
    description: '트리거 타입',
    enum: TriggerType,
    example: TriggerType.MANUAL,
  })
  @Prop({ required: true, enum: TriggerType })
  trigger: TriggerType;

  @ApiProperty({
    description: '보상 전달 타입',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  @Prop({ required: true, enum: RewardDeliveryType })
  deliveryType: RewardDeliveryType;

  // 당시의 reward 정보 snapshot
  @ApiProperty({
    description: '보상 스냅샷 정보',
    example: {
      type: RewardType.ITEM,
      quantity: 1,
      itemId: 'item-001',
      description: '레어 아이템',
    },
  })
  @Prop({
    type: {
      type: { type: String, enum: Object.values(RewardType) },
      quantity: { type: Number },
      itemId: { type: String },
      description: { type: String },
    },
  })
  rewardSnapshot: {
    type: RewardType;
    quantity: number;
    itemId?: string;
    description?: string;
  };

  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.PENDING,
  })
  @Prop({
    type: String,
    enum: Object.values(RewardStatus),
    required: true,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @ApiProperty({
    description: '유저가 보상을 요청한 시간',
    example: '2025-01-01T12:00:00Z',
  })
  @Prop({ type: Date }) // 유저가 요청 클릭한 시점 (optional)
  requestedAt?: Date;

  @ApiProperty({
    description: '보상 처리 결과에 대한 이유 (실패 시 오류 메시지 등)',
    example: '이미 보상을 받았습니다.',
  })
  @Prop({ type: String })
  reason?: string;
}

export const UserEventRewardRequestSchema = SchemaFactory.createForClass(
  UserEventRewardRequest,
);

// 인덱스 추가
UserEventRewardRequestSchema.index(
  { userId: 1, eventId: 1, rewardId: 1 },
  { unique: true },
);
UserEventRewardRequestSchema.index({ status: 1 });
UserEventRewardRequestSchema.index({ createdAt: 1 });
