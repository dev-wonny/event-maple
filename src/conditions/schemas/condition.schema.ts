import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { ConditionSubType } from '../../../../libs/common/enums/condition-subtype.enum';

@Schema({ timestamps: true })
export class Condition extends Document {
  @Prop({ required: true, enum: EventCategory, type: String })
  @ApiProperty({
    description: '조건 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  category: string;

  @Prop({ required: true, enum: ConditionSubType, type: String })
  @ApiProperty({
    description: '조건 하위 타입',
    enum: ConditionSubType,
    example: ConditionSubType.TOTAL_DAYS,
  })
  subType: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  @ApiProperty({
    description: '조건 기준값 (예: 3일, 아이템 ID 등)',
    example: 3,
  })
  target: number | string;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
