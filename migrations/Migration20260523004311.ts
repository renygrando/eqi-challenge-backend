import { Migration } from '@mikro-orm/migrations';

export class Migration20260523004311 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`leads\` add column \`leadflow_id\` text null;`);
    this.addSql(`alter table \`leads\` add column \`channel\` text null;`);
    this.addSql(`alter table \`leads\` add column \`campaign_id\` text null;`);
    this.addSql(`alter table \`leads\` add column \`landing_page\` text null;`);
    this.addSql(`alter table \`leads\` add column \`score\` integer null;`);
    this.addSql(`alter table \`leads\` add column \`temperature\` text null;`);
    this.addSql(`alter table \`leads\` add column \`received_at\` datetime null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`leads\` drop column \`leadflow_id\`;`);
    this.addSql(`alter table \`leads\` drop column \`channel\`;`);
    this.addSql(`alter table \`leads\` drop column \`campaign_id\`;`);
    this.addSql(`alter table \`leads\` drop column \`landing_page\`;`);
    this.addSql(`alter table \`leads\` drop column \`score\`;`);
    this.addSql(`alter table \`leads\` drop column \`temperature\`;`);
    this.addSql(`alter table \`leads\` drop column \`received_at\`;`);
  }

}
