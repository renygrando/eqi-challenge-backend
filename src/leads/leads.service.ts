import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Lead } from './entities/lead.entity';

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  source: string;
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

  async findAll(): Promise<Lead[]> {
    return this.leadRepo.findAll({ orderBy: { createdAt: 'DESC' } });
  }
}
