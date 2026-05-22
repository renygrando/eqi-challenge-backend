import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let leadsService: jest.Mocked<Pick<LeadsService, 'findAll'>>;

  beforeEach(() => {
    leadsService = {
      findAll: jest.fn(),
    };

    controller = new LeadsController(leadsService as unknown as LeadsService);
  });

  it('returns all leads from service', async () => {
    const leads = [
      { id: '1', name: 'John Doe', email: 'john@doe.com', source: 'site' },
    ];
    leadsService.findAll.mockResolvedValue(leads as any);

    await expect(controller.findAll()).resolves.toEqual(leads);
    expect(leadsService.findAll).toHaveBeenCalledTimes(1);
  });
});
