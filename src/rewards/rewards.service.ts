import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { RewardHistory } from './schemas/reward-history.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { CreateRewardHistoryDto } from './dto/create-reward-history.dto';
import { UpdateRewardHistoryDto } from './dto/update-reward-history.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { RewardHistoryResponseDto } from './dto/reward-history-response.dto';
import { RewardType } from '../../../libs/common';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(RewardHistory.name)
    private rewardHistoryModel: Model<RewardHistory>,
  ) {}

  // 헬퍼 메서드: Reward 객체를 RewardResponseDto로 변환
  private mapToRewardResponseDto(reward: any): RewardResponseDto {
    return new RewardResponseDto({
      id: reward._id ? reward._id.toString() : reward.id,
      type: reward.type,
      quantity: reward.quantity,
      rewardDeliveryType: reward.rewardDeliveryType,
      itemId: reward.itemId,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    });
  }

  // 헬퍼 메서드: RewardHistory 객체를 RewardHistoryResponseDto로 변환
  private mapToRewardHistoryResponseDto(history: any): RewardHistoryResponseDto {
    const rewards = Array.isArray(history.reward)
      ? history.reward.map(reward => this.mapToRewardResponseDto(reward))
      : [];

    return new RewardHistoryResponseDto({
      id: history._id ? history._id.toString() : history.id,
      userId: history.userId,
      eventId: history.eventId,
      reward: rewards,
      claimedAt: history.claimedAt,
      deliveryType: history.deliveryType,
      status: history.status,
      reason: history.reason,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    });
  }

  // Reward 관련 메서드
  async createReward(
    createRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    // 아이템 타입인 경우 itemId 필수 체크
    if (createRewardDto.type === RewardType.ITEM && !createRewardDto.itemId) {
      throw new BadRequestException('아이템 타입의 보상은 itemId가 필수입니다');
    }

    const createdReward = new this.rewardModel(createRewardDto);
    const savedReward = await createdReward.save();
    return this.mapToRewardResponseDto(savedReward.toObject());
  }

  async findAllRewards(): Promise<RewardResponseDto[]> {
    const rewards = await this.rewardModel.find().lean().exec();
    return rewards.map((reward) => this.mapToRewardResponseDto(reward));
  }

  async findOneReward(id: string): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const reward = await this.rewardModel.findById(id).lean().exec();

    if (!reward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(reward);
  }

  async updateReward(
    id: string,
    updateRewardDto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    // 아이템 타입인 경우 itemId 필수 체크
    if (updateRewardDto.type === RewardType.ITEM && !updateRewardDto.itemId) {
      throw new BadRequestException('아이템 타입의 보상은 itemId가 필수입니다');
    }

    const updatedReward = await this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .lean()
      .exec();

    if (!updatedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(updatedReward);
  }

  async removeReward(id: string): Promise<RewardResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const deletedReward = await this.rewardModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedReward) {
      throw new NotFoundException(`ID가 ${id}인 보상을 찾을 수 없습니다`);
    }

    return this.mapToRewardResponseDto(deletedReward);
  }

  // RewardHistory 관련 메서드
  async createRewardHistory(
    createRewardHistoryDto: CreateRewardHistoryDto,
  ): Promise<RewardHistoryResponseDto> {
    // eventId가 유효한 ObjectId인지 검증
    if (!isValidObjectId(createRewardHistoryDto.eventId)) {
      throw new BadRequestException(
        `${createRewardHistoryDto.eventId}는 유효한 이벤트 ID 형식이 아닙니다`,
      );
    }

    // 보상 배열 검증
    if (
      !createRewardHistoryDto.reward ||
      createRewardHistoryDto.reward.length === 0
    ) {
      throw new BadRequestException('최소 하나 이상의 보상이 필요합니다');
    }

    // 아이템 타입인 경우 itemId 필수 체크
    for (const reward of createRewardHistoryDto.reward) {
      if (reward.type === RewardType.ITEM && !reward.itemId) {
        throw new BadRequestException(
          '아이템 타입의 보상은 itemId가 필수입니다',
        );
      }
    }

    const createdRewardHistory = new this.rewardHistoryModel(
      createRewardHistoryDto,
    );
    const savedRewardHistory = await createdRewardHistory.save();
    return this.mapToRewardHistoryResponseDto(savedRewardHistory.toObject());
  }

  async findAllRewardHistories(): Promise<RewardHistoryResponseDto[]> {
    const rewardHistories = await this.rewardHistoryModel.find().lean().exec();
    return rewardHistories.map(
      (history) => this.mapToRewardHistoryResponseDto(history),
    );
  }

  async findOneRewardHistory(id: string): Promise<RewardHistoryResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const rewardHistory = await this.rewardHistoryModel
      .findById(id)
      .lean()
      .exec();

    if (!rewardHistory) {
      throw new NotFoundException(`ID가 ${id}인 보상 이력을 찾을 수 없습니다`);
    }

    return this.mapToRewardHistoryResponseDto(rewardHistory);
  }

  async findRewardHistoriesByUserId(
    userId: string,
  ): Promise<RewardHistoryResponseDto[]> {
    const rewardHistories = await this.rewardHistoryModel
      .find({ userId })
      .lean()
      .exec();

    return rewardHistories.map(
      (history) => this.mapToRewardHistoryResponseDto(history),
    );
  }

  async updateRewardHistory(
    id: string,
    updateRewardHistoryDto: UpdateRewardHistoryDto,
  ): Promise<RewardHistoryResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    // eventId가 있고 유효한 ObjectId인지 검증
    if (
      updateRewardHistoryDto.eventId &&
      !isValidObjectId(updateRewardHistoryDto.eventId)
    ) {
      throw new BadRequestException(
        `${updateRewardHistoryDto.eventId}는 유효한 이벤트 ID 형식이 아닙니다`,
      );
    }

    // 보상 배열이 있는 경우 검증
    if (
      updateRewardHistoryDto.reward &&
      updateRewardHistoryDto.reward.length > 0
    ) {
      for (const reward of updateRewardHistoryDto.reward) {
        if (reward.type === RewardType.ITEM && !reward.itemId) {
          throw new BadRequestException(
            '아이템 타입의 보상은 itemId가 필수입니다',
          );
        }
      }
    }

    const updatedRewardHistory = await this.rewardHistoryModel
      .findByIdAndUpdate(id, updateRewardHistoryDto, { new: true })
      .lean()
      .exec();

    if (!updatedRewardHistory) {
      throw new NotFoundException(`ID가 ${id}인 보상 이력을 찾을 수 없습니다`);
    }

    return this.mapToRewardHistoryResponseDto(updatedRewardHistory);
  }

  async removeRewardHistory(id: string): Promise<RewardHistoryResponseDto> {
    // ObjectId 형식 검증
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id}는 유효한 ID 형식이 아닙니다`);
    }

    const deletedRewardHistory = await this.rewardHistoryModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedRewardHistory) {
      throw new NotFoundException(`ID가 ${id}인 보상 이력을 찾을 수 없습니다`);
    }

    return this.mapToRewardHistoryResponseDto(deletedRewardHistory);
  }
}
