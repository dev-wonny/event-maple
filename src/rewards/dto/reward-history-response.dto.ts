import { ApiProperty } from '@nestjs/swagger';
import { RewardDeliveryType, RewardStatus } from '../../../../libs/common';
import { RewardResponseDto } from './reward-response.dto';

export class RewardHistoryResponseDto {
  @ApiProperty({
    description: '보상 이력 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: '이벤트 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  eventId: string;

  @ApiProperty({
    description: '보상 목록',
    type: [RewardResponseDto],
  })
  reward: RewardResponseDto[];

  @ApiProperty({
    description: '수령 일시',
    example: '2025-05-20T00:37:58.000Z',
  })
  claimedAt: Date;

  @ApiProperty({
    description: '지급 방식',
    enum: RewardDeliveryType,
    example: RewardDeliveryType.MANUAL_CLAIM,
  })
  deliveryType: RewardDeliveryType;

  @ApiProperty({
    description: '보상 상태',
    enum: RewardStatus,
    example: RewardStatus.SUCCESS,
  })
  status: RewardStatus;

  @ApiProperty({
    description: '실패 이유 (실패 시에만 존재)',
    example: '이미 수령한 보상입니다',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: '생성 일시',
    example: '2025-05-20T00:37:58.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2025-05-20T00:37:58.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<RewardHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
