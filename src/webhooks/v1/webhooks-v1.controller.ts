import { Body, Controller, Post } from '@nestjs/common';
import { LeadsService } from '../../leads/leads.service';
import { LeadflowV1WebhookDto } from './dto/leadflow-v1-webhook.dto';

@Controller({ path: 'webhooks/leadflow', version: '1' })
export class WebhooksV1Controller {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async receive(@Body() dto: LeadflowV1WebhookDto) {
    await this.leadsService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
    });
    return { received: true };
  }
}
