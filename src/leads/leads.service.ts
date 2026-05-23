import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { Lead } from "./entities/lead.entity";

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  source: string;
}

export interface CreateLeadV2Input {
  leadflowId: string;
  fullName: string;
  email: string;
  phone?: string;
  channel: string;
  campaignId?: string;
  landingPage?: string;
  score: number;
  receivedAt: Date;
}

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: EntityRepository<Lead>,
    private readonly em: EntityManager,
  ) {}

  async create(input: CreateLeadInput): Promise<Lead> {
    const lead = this.leadRepo.create(input);
    await this.em.flush();
    return lead;
  }

  async createFromWebhookV2(input: CreateLeadV2Input): Promise<Lead> {
    const temperature = this.deriveTemperature(input.score);

    const lead = this.leadRepo.create({
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      source: input.channel,
      leadflowId: input.leadflowId,
      channel: input.channel,
      campaignId: input.campaignId,
      landingPage: input.landingPage,
      score: input.score,
      temperature,
      receivedAt: input.receivedAt,
    });

    await this.em.flush();
    return lead;
  }

  private deriveTemperature(score: number): string {
    if (score < 40) return "frio";
    if (score < 70) return "morno";
    return "quente";
  }

  async findAll(): Promise<Lead[]> {
    return this.leadRepo.findAll({ orderBy: { createdAt: "DESC" } });
  }
}
