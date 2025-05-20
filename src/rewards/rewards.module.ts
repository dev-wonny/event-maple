import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import {
  RewardHistory,
  RewardHistorySchema,
} from './schemas/reward-history.schema';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { RewardHistoryController } from './reward-history.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardHistory.name, schema: RewardHistorySchema },
    ]),
  ],
  controllers: [RewardsController, RewardHistoryController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
