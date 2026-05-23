import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { LeadsService } from "../../leads/leads.service";
import { LeadflowV1WebhookDto } from "./dto/leadflow-v1-webhook.dto";
import { DeprecationInterceptor } from "../interceptors/deprecation.interceptor";

@Controller({ path: "webhooks/leadflow", version: "1" })
@UseInterceptors(DeprecationInterceptor)
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
