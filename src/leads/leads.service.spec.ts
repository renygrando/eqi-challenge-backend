import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { Lead } from "./entities/lead.entity";
import { LeadsService } from "./leads.service";

describe("LeadsService", () => {
  let service: LeadsService;
  let leadRepo: jest.Mocked<Pick<EntityRepository<Lead>, "create" | "findAll">>;
  let em: jest.Mocked<Pick<EntityManager, "flush">>;

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

  it("creates a v1 lead and flushes changes", async () => {
    const input = {
      name: "Jane Doe",
      email: "jane@doe.com",
      phone: "9999-9999",
      source: "landing-page",
    };

    const createdLead = {
      id: "lead-id",
      ...input,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    } as Lead;

    leadRepo.create.mockReturnValue(createdLead);
    em.flush.mockResolvedValue(undefined);

    await expect(service.create(input)).resolves.toBe(createdLead);
    expect(leadRepo.create).toHaveBeenCalledTimes(1);
    expect(leadRepo.create).toHaveBeenCalledWith(input);
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it("creates v2 lead with temperature frio", async () => {
    const input = {
      leadflowId: "lead_abc123",
      fullName: "Maria Silva",
      email: "maria@silva.com",
      phone: "+5511999999999",
      channel: "google-ads",
      campaignId: "camp_123",
      landingPage: "https://empresa.com/lp",
      score: 39,
      receivedAt: new Date("2026-05-19T10:00:00.000Z"),
    };

    const createdLead = { id: "id-1" } as Lead;
    leadRepo.create.mockReturnValue(createdLead);
    em.flush.mockResolvedValue(undefined);

    await expect(service.createFromWebhookV2(input)).resolves.toBe(createdLead);

    expect(leadRepo.create).toHaveBeenCalledWith({
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      source: input.channel,
      leadflowId: input.leadflowId,
      channel: input.channel,
      campaignId: input.campaignId,
      landingPage: input.landingPage,
      score: input.score,
      temperature: "frio",
      receivedAt: input.receivedAt,
    });
    expect(em.flush).toHaveBeenCalledTimes(1);
  });

  it("creates v2 lead with temperature morno", async () => {
    const input = {
      leadflowId: "lead_def456",
      fullName: "Joao Souza",
      email: "joao@souza.com",
      channel: "organic",
      score: 69,
      receivedAt: new Date("2026-05-19T11:00:00.000Z"),
    };

    leadRepo.create.mockReturnValue({ id: "id-2" } as Lead);
    em.flush.mockResolvedValue(undefined);

    await service.createFromWebhookV2(input);

    expect(leadRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: "morno",
      }),
    );
  });

  it("creates v2 lead with temperature quente", async () => {
    const input = {
      leadflowId: "lead_ghi789",
      fullName: "Ana Lima",
      email: "ana@lima.com",
      channel: "referral",
      score: 100,
      receivedAt: new Date("2026-05-19T12:00:00.000Z"),
    };

    leadRepo.create.mockReturnValue({ id: "id-3" } as Lead);
    em.flush.mockResolvedValue(undefined);

    await service.createFromWebhookV2(input);

    expect(leadRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: "quente",
      }),
    );
  });

  it("returns all leads ordered by createdAt DESC", async () => {
    const leads = [
      {
        id: "1",
        name: "Newest",
        email: "new@lead.com",
        source: "ad",
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      },
      {
        id: "2",
        name: "Oldest",
        email: "old@lead.com",
        source: "site",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ] as Lead[];

    leadRepo.findAll.mockResolvedValue(leads);

    await expect(service.findAll()).resolves.toEqual(leads);
    expect(leadRepo.findAll).toHaveBeenCalledTimes(1);
    expect(leadRepo.findAll).toHaveBeenCalledWith({
      orderBy: { createdAt: "DESC" },
    });
  });
});
