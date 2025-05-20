import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { TriggerType } from '../../../../libs/common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../../../libs/common/enums/reward-delivery-type.enum';

export class Condition {
  @ApiProperty({ description: '조건 타입' })
  type: string;

  @ApiProperty({ description: '조건 하위 타입' })
  subType: string;

  @ApiProperty({ description: '조건 값' })
  value: number;

  @ApiProperty({ description: '조건 설명' })
  description: string;
}

export class Reward {
  @ApiProperty({ description: '보상 타입' })
  type: string;

  @ApiProperty({ description: '보상 아이템 ID' })
  itemId?: string;

  @ApiProperty({ description: '보상 수량' })
  quantity: number;

  @ApiProperty({ description: '보상 설명' })
  description: string;
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true, unique: true })
  @ApiProperty({ description: '이벤트 ID' })
  eventId: string;

  @Prop({ required: true })
  @ApiProperty({ description: '이벤트 제목' })
  title: string;

  @Prop({ required: true, enum: EventCategory, type: String })
  @ApiProperty({ description: '이벤트 카테고리', enum: EventCategory })
  category: string;

  @Prop({ type: [Object], required: true })
  @ApiProperty({ description: '이벤트 조건', type: [Condition] })
  conditions: Condition[];

  @Prop({ type: [Object], required: true })
  @ApiProperty({ description: '이벤트 보상', type: [Reward] })
  rewards: Reward[];

  @Prop({ required: true, enum: TriggerType, type: String })
  @ApiProperty({ description: '트리거 타입', enum: TriggerType })
  trigger: string;

  @Prop({ required: true, enum: RewardDeliveryType, type: String })
  @ApiProperty({ description: '보상 전달 타입', enum: RewardDeliveryType })
  deliveryType: string;

  @Prop({ required: true, type: Date })
  @ApiProperty({ description: '이벤트 시작 시간' })
  startAt: Date;

  @Prop({ required: true, type: Date })
  @ApiProperty({ description: '이벤트 종료 시간' })
  endAt: Date;

  @Prop({ default: false })
  @ApiProperty({ description: '이벤트 활성화 여부' })
  isActive: boolean;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
