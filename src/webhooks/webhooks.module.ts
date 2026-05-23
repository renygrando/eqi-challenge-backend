import { Module } from "@nestjs/common";
import { LeadsModule } from "../leads/leads.module";
import { WebhooksV1Controller } from "./v1/webhooks-v1.controller";
import { WebhooksV2Controller } from "./v2/webhooks-v2.controller";
import { LeadflowSignatureGuard } from "./guards/leadflow-signature.guard";

@Module({
  imports: [LeadsModule],
  controllers: [WebhooksV1Controller, WebhooksV2Controller],
  providers: [LeadflowSignatureGuard],
})
export class WebhooksModule {}
