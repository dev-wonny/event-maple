import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseFilters,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CreateRewardHistoryDto } from './dto/create-reward-history.dto';
import { UpdateRewardHistoryDto } from './dto/update-reward-history.dto';
import { RewardHistoryResponseDto } from './dto/reward-history-response.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ErrorResponseSwaggerDto } from '../common/dto/error-response-swagger.dto';

@ApiTags('reward-history')
@Controller('reward-history')
@UseFilters(HttpExceptionFilter)
export class RewardHistoryController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: '보상 이력 생성' })
  @ApiResponse({
    status: 201,
    description: '보상 이력이 성공적으로 생성됨',
    type: RewardHistoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async create(
    @Body() createRewardHistoryDto: CreateRewardHistoryDto,
  ): Promise<RewardHistoryResponseDto> {
    return this.rewardsService.createRewardHistory(createRewardHistoryDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 보상 이력 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 보상 이력 목록',
    type: [RewardHistoryResponseDto],
  })
  async findAll(): Promise<RewardHistoryResponseDto[]> {
    return this.rewardsService.findAllRewardHistories();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자별 보상 이력 조회' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자별 보상 이력 목록',
    type: [RewardHistoryResponseDto],
  })
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<RewardHistoryResponseDto[]> {
    return this.rewardsService.findRewardHistoriesByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 보상 이력 조회' })
  @ApiParam({ name: 'id', description: '보상 이력 ID' })
  @ApiResponse({
    status: 200,
    description: '보상 이력 정보',
    type: RewardHistoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상 이력을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async findOne(@Param('id') id: string): Promise<RewardHistoryResponseDto> {
    return this.rewardsService.findOneRewardHistory(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '보상 이력 업데이트' })
  @ApiParam({ name: 'id', description: '보상 이력 ID' })
  @ApiResponse({
    status: 200,
    description: '업데이트된 보상 이력 정보',
    type: RewardHistoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상 이력을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    type: ErrorResponseSwaggerDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRewardHistoryDto: UpdateRewardHistoryDto,
  ): Promise<RewardHistoryResponseDto> {
    return this.rewardsService.updateRewardHistory(id, updateRewardHistoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '보상 이력 삭제' })
  @ApiParam({ name: 'id', description: '보상 이력 ID' })
  @ApiResponse({
    status: 200,
    description: '삭제된 보상 이력 정보',
    type: RewardHistoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '보상 이력을 찾을 수 없음',
    type: ErrorResponseSwaggerDto,
  })
  async remove(@Param('id') id: string): Promise<RewardHistoryResponseDto> {
    return this.rewardsService.removeRewardHistory(id);
  }
}
