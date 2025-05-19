import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '새 이벤트 생성' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이벤트가 성공적으로 생성되었습니다.',
    type: Event,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 이벤트 ID입니다.',
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 이벤트 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 이벤트 목록을 반환합니다.',
    type: [Event],
  })
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':eventId')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '특정 이벤트 정보를 반환합니다.',
    type: Event,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async findOne(@Param('eventId') eventId: string): Promise<Event> {
    return this.eventsService.findOne(eventId);
  }

  @Put(':eventId')
  @ApiOperation({ summary: '이벤트 전체 업데이트' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 업데이트되었습니다.',
    type: Event,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async update(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: '이벤트 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async remove(@Param('eventId') eventId: string): Promise<void> {
    return this.eventsService.remove(eventId);
  }

  @Patch(':eventId/activate')
  @ApiOperation({ summary: '이벤트 활성화' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 활성화되었습니다.',
    type: Event,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async activateEvent(@Param('eventId') eventId: string): Promise<Event> {
    return this.eventsService.activateEvent(eventId);
  }

  @Patch(':eventId/deactivate')
  @ApiOperation({ summary: '이벤트 비활성화' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트가 성공적으로 비활성화되었습니다.',
    type: Event,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없습니다.',
  })
  async deactivateEvent(@Param('eventId') eventId: string): Promise<Event> {
    return this.eventsService.deactivateEvent(eventId);
  }
}
