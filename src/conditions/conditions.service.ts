import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Condition } from './schemas/condition.schema';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { ConditionResponseDto } from './dto/condition-response.dto';

@Injectable()
export class ConditionsService {
  constructor(
    @InjectModel(Condition.name) private conditionModel: Model<Condition>,
  ) {}

  async create(
    createConditionDto: CreateConditionDto,
  ): Promise<ConditionResponseDto> {
    try {
      const createdCondition = new this.conditionModel(createConditionDto);
      const savedCondition = await createdCondition.save();
      return savedCondition as unknown as ConditionResponseDto;
    } catch (error) {
      throw new BadRequestException(
        '조건 생성에 실패했습니다: ' + error.message,
      );
    }
  }

  async findAll(): Promise<ConditionResponseDto[]> {
    try {
      const conditions = await this.conditionModel.find().lean().exec();
      return conditions as unknown as ConditionResponseDto[];
    } catch (error) {
      throw new BadRequestException(
        '조건 목록 조회에 실패했습니다: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    const condition = await this.conditionModel.findById(id).lean().exec();
    if (!condition) {
      throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
    }
    return condition as unknown as ConditionResponseDto;
  }

  async update(
    id: string,
    updateConditionDto: UpdateConditionDto,
  ): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    try {
      const updatedCondition = await this.conditionModel
        .findByIdAndUpdate(id, updateConditionDto, { new: true })
        .lean()
        .exec();

      if (!updatedCondition) {
        throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
      }

      return updatedCondition as unknown as ConditionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        '조건 업데이트에 실패했습니다: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<ConditionResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('유효하지 않은 조건 ID 형식입니다');
    }

    const deletedCondition = await this.conditionModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedCondition) {
      throw new NotFoundException(`ID가 ${id}인 조건을 찾을 수 없습니다`);
    }

    return deletedCondition as unknown as ConditionResponseDto;
  }
}
