import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEventRewardHistoryService } from './user-event-reward-history.service';
import { CreateUserEventRewardHistoryDto } from './dto/create-user-event-reward-history.dto';
import { UserEventRewardHistoryResponseDto } from './dto/user-event-reward-history-response.dto';

@ApiTags('user-event-reward-history')
@Controller('user-event-reward-history')
export class UserEventRewardHistoryController {
  constructor(
    private readonly userEventRewardHistoryService: UserEventRewardHistoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: '보상 지급 기록 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상 지급 기록이 성공적으로 생성되었습니다.',
    type: UserEventRewardHistoryResponseDto,
  })
  async create(
    @Body() createUserEventRewardHistoryDto: CreateUserEventRewardHistoryDto,
  ): Promise<UserEventRewardHistoryResponseDto> {
    return this.userEventRewardHistoryService.create(
      createUserEventRewardHistoryDto,
    );
  }

  @Get()
  @ApiOperation({ summary: '모든 보상 지급 기록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 보상 지급 기록 목록',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAll(): Promise<UserEventRewardHistoryResponseDto[]> {
    return this.userEventRewardHistoryService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자별 보상 지급 기록 조회' })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    example: 'user-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자의 모든 보상 지급 기록을 반환합니다.',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    return this.userEventRewardHistoryService.findAllByUserId(userId);
  }

  @Get('user/:userId/event/:eventId')
  @ApiOperation({ summary: '특정 이벤트에 대한 사용자의 보상 지급 기록 조회' })
  @ApiParam({
    name: 'userId',
    description: '사용자 ID',
    example: 'user-123',
  })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    example: 'event-001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 이벤트에 대한 사용자의 보상 지급 기록을 반환합니다.',
    type: [UserEventRewardHistoryResponseDto],
  })
  async findAllByUserIdAndEventId(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<UserEventRewardHistoryResponseDto[]> {
    return this.userEventRewardHistoryService.findAllByUserIdAndEventId(
      userId,
      eventId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 보상 지급 기록 조회' })
  @ApiParam({
    name: 'id',
    description: '보상 지급 기록 ID',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 보상 지급 기록 정보를 반환합니다.',
    type: UserEventRewardHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 지급 기록을 찾을 수 없습니다.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<UserEventRewardHistoryResponseDto> {
    return this.userEventRewardHistoryService.findById(id);
  }
}
