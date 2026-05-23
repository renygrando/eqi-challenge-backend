import { LeadsService } from "../../leads/leads.service";
import { WebhooksV2Controller } from "./webhooks-v2.controller";

describe("WebhooksV2Controller", () => {
  let controller: WebhooksV2Controller;
  let leadsService: jest.Mocked<Pick<LeadsService, "createFromWebhookV2">>;

  beforeEach(() => {
    leadsService = {
      createFromWebhookV2: jest.fn(),
    };

    controller = new WebhooksV2Controller(
      leadsService as unknown as LeadsService,
    );
  });

  it("maps v2 payload and returns confirmation", async () => {
    const dto = {
      lead: {
        id: "lead_abc123",
        personal: {
          full_name: "Joao Silva",
          email: "joao@email.com",
          phone: "+5511999999999",
        },
        acquisition: {
          channel: "google-ads",
          campaign_id: "camp_456",
          landing_page: "https://empresa.com.br/lp/investimentos",
          score: 87,
        },
        metadata: {
          received_at: "2026-05-19T10:00:00Z",
          version: "2.0",
        },
      },
    };

    leadsService.createFromWebhookV2.mockResolvedValue({} as any);

    await expect(controller.receive(dto as any)).resolves.toEqual({
      received: true,
    });

    expect(leadsService.createFromWebhookV2).toHaveBeenCalledTimes(1);
    expect(leadsService.createFromWebhookV2).toHaveBeenCalledWith({
      leadflowId: "lead_abc123",
      fullName: "Joao Silva",
      email: "joao@email.com",
      phone: "+5511999999999",
      channel: "google-ads",
      campaignId: "camp_456",
      landingPage: "https://empresa.com.br/lp/investimentos",
      score: 87,
      receivedAt: new Date("2026-05-19T10:00:00Z"),
    });
  });
});
