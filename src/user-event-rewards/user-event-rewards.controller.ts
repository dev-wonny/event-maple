import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEventRewardsService } from './user-event-rewards.service';
import { CreateUserEventRewardRequestDto } from './dto/create-user-event-reward-request.dto';
import { UserEventRewardRequestResponseDto } from './dto/user-event-reward-request-response.dto';
import { RewardStatus } from '../../../libs/common/enums/reward-status.enum';

@ApiTags('user-event-rewards')
@Controller('user-event-rewards')
export class UserEventRewardsController {
  constructor(
    private readonly userEventRewardsService: UserEventRewardsService,
  ) {}

  @Post()
  @ApiOperation({ summary: '유저 이벤트 보상 요청 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상 요청이 성공적으로 생성되었습니다.',
    type: UserEventRewardRequestResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 해당 이벤트의 보상을 요청했습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트 또는 보상을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '이벤트에 해당 보상이 포함되어 있지 않거나 이벤트 기간이 아닙니다.',
  })
  async create(
    @Body() createUserEventRewardRequestDto: CreateUserEventRewardRequestDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.create(createUserEventRewardRequestDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '유저의 모든 이벤트 보상 요청 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저의 모든 이벤트 보상 요청 목록을 반환합니다.',
    type: [UserEventRewardRequestResponseDto],
  })
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    return this.userEventRewardsService.findAllByUserId(userId);
  }

  @Get('user/:userId/event/:eventId')
  @ApiOperation({ summary: '특정 이벤트에 대한 유저의 보상 요청 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiParam({ name: 'eventId', description: '이벤트 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 이벤트에 대한 유저의 보상 요청 목록을 반환합니다.',
    type: [UserEventRewardRequestResponseDto],
  })
  async findAllByUserIdAndEventId(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    return this.userEventRewardsService.findAllByUserIdAndEventId(
      userId,
      eventId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 보상 요청 조회' })
  @ApiParam({ name: 'id', description: '보상 요청 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 보상 요청 정보를 반환합니다.',
    type: UserEventRewardRequestResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없습니다.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '보상 요청 상태 업데이트' })
  @ApiParam({ name: 'id', description: '보상 요청 ID' })
  @ApiQuery({ name: 'status', enum: RewardStatus, description: '새로운 상태' })
  @ApiQuery({ name: 'reason', required: false, description: '상태 변경 이유' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 상태가 성공적으로 업데이트되었습니다.',
    type: UserEventRewardRequestResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없습니다.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: RewardStatus,
    @Query('reason') reason?: string,
  ): Promise<UserEventRewardRequestResponseDto> {
    return this.userEventRewardsService.updateStatus(id, status, reason);
  }
}
