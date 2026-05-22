import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { WebhooksV1Controller } from './v1/webhooks-v1.controller';

@Module({
  imports: [LeadsModule],
  controllers: [WebhooksV1Controller],
})
export class WebhooksModule {}
