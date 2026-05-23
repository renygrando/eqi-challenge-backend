import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { LeadsService } from "../../leads/leads.service";
import { LeadflowV2WebhookDto } from "./dto/leadflow-v2-webhook.dto";
import { LeadflowSignatureGuard } from "../guards/leadflow-signature.guard";

@Controller({ path: "webhooks/leadflow", version: "2" })
@UseGuards(LeadflowSignatureGuard)
export class WebhooksV2Controller {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Body() dto: LeadflowV2WebhookDto) {
    await this.leadsService.createFromWebhookV2({
      leadflowId: dto.lead.id,
      fullName: dto.lead.personal.full_name,
      email: dto.lead.personal.email,
      phone: dto.lead.personal.phone,
      channel: dto.lead.acquisition.channel,
      campaignId: dto.lead.acquisition.campaign_id,
      landingPage: dto.lead.acquisition.landing_page,
      score: dto.lead.acquisition.score,
      receivedAt: new Date(dto.lead.metadata.received_at),
    });

    return { received: true };
  }
}
