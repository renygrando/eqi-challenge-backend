import { LeadsService } from '../../leads/leads.service';
import { WebhooksV1Controller } from './webhooks-v1.controller';

describe('WebhooksV1Controller', () => {
  let controller: WebhooksV1Controller;
  let leadsService: jest.Mocked<Pick<LeadsService, 'create'>>;

  beforeEach(() => {
    leadsService = {
      create: jest.fn(),
    };

    controller = new WebhooksV1Controller(
      leadsService as unknown as LeadsService,
    );
  });

  it('creates lead from webhook payload and returns confirmation', async () => {
    const dto = {
      name: 'Maria Silva',
      email: 'maria@silva.com',
      phone: '99999-0000',
      source: 'facebook',
    };

    leadsService.create.mockResolvedValue({} as any);

    await expect(controller.receive(dto)).resolves.toEqual({ received: true });
    expect(leadsService.create).toHaveBeenCalledTimes(1);
    expect(leadsService.create).toHaveBeenCalledWith({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
    });
  });
});
