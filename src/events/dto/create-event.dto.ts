import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TriggerType } from '../../common/enums/trigger-type.enum';
import { RewardDeliveryType } from '../../common/enums/reward-delivery-type.enum';
import { EventCategory } from '../../common/enums/event-category.enum';
import { RewardType } from '../../common/enums/reward-type.enum';
import { ConditionSubType } from '../../common/enums/condition-subtype.enum';

export class ConditionDto {
  @ApiProperty({
    description: '조건 유형',
    enum: ConditionSubType,
    example: ConditionSubType.TOTAL_DAYS,
  })
  @IsEnum(ConditionSubType)
  @IsNotEmpty()
  type: ConditionSubType;

  @ApiProperty({
    description: '조건 값',
    example: 7,
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({
    description: '조건 설명',
    example: '7일 연속 출석',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class RewardDto {
  @ApiProperty({
    description: '보상 유형',
    enum: RewardType,
    example: RewardType.MESO,
  })
  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType;

  @ApiProperty({
    description: '보상 값',
    example: 10000,
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({
    description: '보상 설명',
    example: '10,000 메소',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 ID',
    example: 'event-001',
  })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: '이벤트 제목',
    example: '7일 출석 이벤트',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '이벤트 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  @IsEnum(EventCategory)
  @IsNotEmpty()
  category: EventCategory;

  @ApiProperty({
    description: '이벤트 조건 목록',
    type: [ConditionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  @IsNotEmpty()
  conditions: ConditionDto[];

  @ApiProperty({
    description: '이벤트 보상 목록',
    type: [RewardDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardDto)
  @IsNotEmpty()
  rewards: RewardDto[];

  @ApiProperty({
    description: '이벤트 트리거 유형',
    enum: TriggerType,
    default: TriggerType.MANUAL,
  })
  @IsEnum(TriggerType)
  @IsOptional()
  trigger?: TriggerType;

  @ApiProperty({
    description: '보상 전달 유형',
    enum: RewardDeliveryType,
    default: RewardDeliveryType.MANUAL_CLAIM,
  })
  @IsEnum(RewardDeliveryType)
  @IsOptional()
  deliveryType?: RewardDeliveryType;

  @ApiProperty({
    description: '이벤트 시작 시간',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startAt: Date;

  @ApiProperty({
    description: '이벤트 종료 시간',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endAt: Date;

  @ApiProperty({
    description: '이벤트 활성화 여부',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
