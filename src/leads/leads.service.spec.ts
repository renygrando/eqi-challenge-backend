import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Lead } from './entities/lead.entity';
import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let leadRepo: jest.Mocked<Pick<EntityRepository<Lead>, 'create' | 'findAll'>>;
  let em: jest.Mocked<Pick<EntityManager, 'flush'>>;

  beforeEach(() => {
    leadRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    em = {
      flush: jest.fn(),
    };

    service = new LeadsService(
      leadRepo as unknown as EntityRepository<Lead>,
      em as unknown as EntityManager,
    );
  });

  it('creates a lead and flushes changes', async () => {
    const input = {
      name: 'Jane Doe',
      email: 'jane@doe.com',
      phone: '9999-9999',
      source: 'landing-page',
    };

    const createdLead = {
      id: 'lead-id',
      ...input,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    } as Lead;

    leadRepo.create.mockReturnValue(createdLead);
    em.flush.mockResolvedValue(undefined);

    await expect(service.create(input)).resolves.toBe(createdLead);
    expect(leadRepo.create).toHaveBeenCalledTimes(1);
    expect(leadRepo.create).toHaveBeenCalledWith(input);
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it('returns all leads ordered by createdAt DESC', async () => {
    const leads = [
      {
        id: '1',
        name: 'Newest',
        email: 'new@lead.com',
        source: 'ad',
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
      },
      {
        id: '2',
        name: 'Oldest',
        email: 'old@lead.com',
        source: 'site',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ] as Lead[];

    leadRepo.findAll.mockResolvedValue(leads);

    await expect(service.findAll()).resolves.toEqual(leads);
    expect(leadRepo.findAll).toHaveBeenCalledTimes(1);
    expect(leadRepo.findAll).toHaveBeenCalledWith({
      orderBy: { createdAt: 'DESC' },
    });
  });
});
