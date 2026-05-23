import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v4 as uuidv4 } from "uuid";

@Entity({ tableName: "leads" })
export class Lead {
  @PrimaryKey({ type: "uuid" })
  id: string = uuidv4();

  @Property({ type: "string" })
  name!: string;

  @Property({ type: "string" })
  email!: string;

  @Property({ nullable: true, type: "string" })
  phone?: string;

  @Property({ type: "string" })
  source!: string;

  @Property()
  createdAt: Date = new Date();
  // Campos novos a adicionar em src/leads/entities/lead.entity.ts:
  @Property({ nullable: true, type: "string" })
  leadflowId?: string; // lead.id da v2

  @Property({ nullable: true, type: "string" })
  channel?: string; // lead.acquisition.channel

  @Property({ nullable: true, type: "string" })
  campaignId?: string; // lead.acquisition.campaign_id

  @Property({ nullable: true, type: "string" })
  landingPage?: string; // lead.acquisition.landing_page

  @Property({ nullable: true, type: "integer" })
  score?: number; // lead.acquisition.score (0-100)

  @Property({ nullable: true, type: "string" })
  temperature?: string; // 'frio' | 'morno' | 'quente' (derivado do score)

  @Property({ nullable: true, type: "Date" })
  receivedAt?: Date; // lead.metadata.received_at
}
