import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // 이벤트 ID 중복 확인
    const existingEvent = await this.eventModel
      .findOne({
        eventId: createEventDto.eventId,
      })
      .lean();

    if (existingEvent) {
      throw new ConflictException(
        `Event with ID ${createEventDto.eventId} already exists`,
      );
    }

    // 새 이벤트 생성
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().lean();
  }

  async findOne(eventId: string): Promise<Event> {
    const event = await this.eventModel.findOne({ eventId }).lean();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }

  async update(
    eventId: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, updateEventDto, { new: true })
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return updatedEvent;
  }

  async remove(eventId: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ eventId });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  }

  async activateEvent(eventId: string): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, { isActive: true }, { new: true })
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return updatedEvent;
  }

  async deactivateEvent(eventId: string): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ eventId }, { isActive: false }, { new: true })
      .lean();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return updatedEvent;
  }
}
