import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEventRewardRequest } from './schemas/user-event-reward-request.schema';
import { CreateUserEventRewardRequestDto } from './dto/create-user-event-reward-request.dto';
import { UserEventRewardRequestResponseDto } from './dto/user-event-reward-request-response.dto';
import { Event } from '../events/schemas/event.schema';
import { Reward } from '../rewards/schemas/reward.schema';
import { RewardStatus } from '../../../libs/common/enums/reward-status.enum';

@Injectable()
export class UserEventRewardsService {
  constructor(
    @InjectModel(UserEventRewardRequest.name)
    private readonly userEventRewardRequestModel: Model<UserEventRewardRequest>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
  ) {}

  /**
   * 유저의 이벤트 보상 요청을 생성하고 처리합니다.
   * @param createUserEventRewardRequestDto 유저 이벤트 보상 요청 DTO
   */
  async create(
    createUserEventRewardRequestDto: CreateUserEventRewardRequestDto,
  ): Promise<UserEventRewardRequestResponseDto> {
    const { userId, eventId, rewardId } = createUserEventRewardRequestDto;

    // 1. 중복 요청 확인
    const existingRequest = await this.userEventRewardRequestModel
      .findOne({ userId, eventId, rewardId })
      .lean();

    if (existingRequest) {
      throw new ConflictException(
        `이미 해당 이벤트(${eventId})의 보상(${rewardId})을 요청했습니다.`,
      );
    }

    // 2. 이벤트 존재 여부 확인
    const event = await this.eventModel
      .findOne({ eventId, isActive: true })
      .lean();

    if (!event) {
      throw new NotFoundException(
        `이벤트(${eventId})를 찾을 수 없거나 활성화되지 않았습니다.`,
      );
    }

    // 3. 이벤트에 해당 보상이 포함되어 있는지 확인
    if (!event.rewardIds.includes(rewardId)) {
      throw new BadRequestException(
        `이벤트(${eventId})에 해당 보상(${rewardId})이 포함되어 있지 않습니다.`,
      );
    }

    // 4. 이벤트 기간 확인
    const now = new Date();
    if (now < event.startAt || now > event.endAt) {
      throw new BadRequestException(
        `이벤트 기간이 아닙니다. 이벤트 기간: ${event.startAt} ~ ${event.endAt}`,
      );
    }

    // 5. 보상 정보 가져오기
    const reward = await this.rewardModel.findById(rewardId).lean();
    if (!reward) {
      throw new NotFoundException(`보상(${rewardId})을 찾을 수 없습니다.`);
    }

    // 6. 보상 스냅샷 생성
    const rewardSnapshot = {
      type: reward.type,
      quantity: reward.quantity,
      itemId: reward.itemId,
      description: reward.description,
    };

    // 7. 요청 시간 설정 (제공되지 않은 경우 현재 시간으로 설정)
    const requestedAt =
      createUserEventRewardRequestDto.requestedAt || new Date();

    // 8. 보상 요청 생성
    const userEventRewardRequest = new this.userEventRewardRequestModel({
      ...createUserEventRewardRequestDto,
      rewardSnapshot,
      requestedAt,
      status: RewardStatus.PENDING, // 기본 상태는 PENDING
    });

    const savedRequest = await userEventRewardRequest.save();
    return this.mapToResponseDto(savedRequest);
  }

  /**
   * 유저의 모든 이벤트 보상 요청을 조회합니다.
   * @param userId 유저 ID
   */
  async findAllByUserId(
    userId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ userId })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 특정 이벤트에 대한 유저의 보상 요청을 조회합니다.
   * @param userId 유저 ID
   * @param eventId 이벤트 ID
   */
  async findAllByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<UserEventRewardRequestResponseDto[]> {
    const requests = await this.userEventRewardRequestModel
      .find({ userId, eventId })
      .lean();
    return requests.map((request) => this.mapToResponseDto(request));
  }

  /**
   * 특정 보상 요청을 ID로 조회합니다.
   * @param id 보상 요청 ID
   */
  async findById(id: string): Promise<UserEventRewardRequestResponseDto> {
    const request = await this.userEventRewardRequestModel.findById(id).lean();
    if (!request) {
      throw new NotFoundException(`보상 요청(${id})을 찾을 수 없습니다.`);
    }
    return this.mapToResponseDto(request);
  }

  /**
   * 보상 요청 상태를 업데이트합니다.
   * @param id 보상 요청 ID
   * @param status 새로운 상태
   * @param reason 상태 변경 이유 (선택 사항)
   */
  async updateStatus(
    id: string,
    status: RewardStatus,
    reason?: string,
  ): Promise<UserEventRewardRequestResponseDto> {
    const updatedRequest = await this.userEventRewardRequestModel
      .findByIdAndUpdate(id, { status, reason }, { new: true })
      .lean();

    if (!updatedRequest) {
      throw new NotFoundException(`보상 요청(${id})을 찾을 수 없습니다.`);
    }

    return this.mapToResponseDto(updatedRequest);
  }

  /**
   * Mongoose 문서를 응답 DTO로 변환합니다.
   * @param request Mongoose 문서
   */
  private mapToResponseDto(request: any): UserEventRewardRequestResponseDto {
    return {
      id: request._id.toString(),
      userId: request.userId,
      eventId: request.eventId,
      rewardId: request.rewardId,
      trigger: request.trigger,
      deliveryType: request.deliveryType,
      rewardSnapshot: request.rewardSnapshot,
      status: request.status,
      requestedAt: request.requestedAt,
      reason: request.reason,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }
}
