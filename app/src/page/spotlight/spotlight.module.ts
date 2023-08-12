import { Module } from '@nestjs/common';
import { RegexFindModule } from 'src/lib/regexFind/regexFind.module';
import { SpotlightResolver } from './spotlight.resovler';
import { SpotlightService } from './spotlight.service';

@Module({
  imports: [RegexFindModule],
  providers: [SpotlightResolver, SpotlightService],
})
// eslint-disable-next-line
export class SpotlightModule {}
