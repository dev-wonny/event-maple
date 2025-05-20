import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../../../../libs/common/enums/event-category.enum';
import { ConditionSubType } from '../../../../libs/common/enums/condition-subtype.enum';

export class ConditionResponseDto {
  @ApiProperty({
    description: '조건 ID',
    example: '60a12d5c8f45e32b4c9cde1f',
  })
  _id: any;

  @ApiProperty({
    description: '조건 카테고리',
    enum: EventCategory,
    example: EventCategory.ATTENDANCE,
  })
  category: string;

  @ApiProperty({
    description: '조건 하위 타입',
    enum: ConditionSubType,
    example: ConditionSubType.TOTAL_DAYS,
  })
  subType: string;

  @ApiProperty({
    description: '조건 기준값 (예: 3일, 아이템 ID 등)',
    example: 3,
  })
  target: number | string;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-05-20T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    example: '2025-05-20T00:00:00.000Z',
  })
  updatedAt: Date;
}
