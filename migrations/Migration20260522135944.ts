import { Migration } from '@mikro-orm/migrations';

export class Migration20260522135944 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`leads\` (\`id\` text not null primary key, \`name\` text not null, \`email\` text not null, \`phone\` text null, \`source\` text not null, \`created_at\` datetime not null);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`leads\`;`);
  }

}
