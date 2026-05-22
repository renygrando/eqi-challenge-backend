import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'leads' })
export class Lead {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  email!: string;

  @Property({ nullable: true, type: 'string' })
  phone?: string;

  @Property({ type: 'string' })
  source!: string;

  @Property()
  createdAt: Date = new Date();
}
