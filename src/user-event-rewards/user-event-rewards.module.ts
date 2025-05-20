import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventRewardsController } from './user-event-rewards.controller';
import { UserEventRewardsService } from './user-event-rewards.service';
import {
  UserEventRewardRequest,
  UserEventRewardRequestSchema,
} from './schemas/user-event-reward-request.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Reward, RewardSchema } from '../rewards/schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEventRewardRequest.name,
        schema: UserEventRewardRequestSchema,
      },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [UserEventRewardsController],
  providers: [UserEventRewardsService],
  exports: [UserEventRewardsService],
})
export class UserEventRewardsModule {}
