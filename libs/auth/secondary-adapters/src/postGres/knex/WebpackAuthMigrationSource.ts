export class WebpackAuthMigrationSource {
  constructor(
    private migrationContext = require.context("./migrations", false, /.ts$/),
  ) {}

  getMigrations() {
    return Promise.resolve(this.migrationContext.keys().sort());
  }

  getMigrationName(migration: string) {
    return migration;
  }

  getMigration(migration: string) {
    return this.migrationContext(migration);
  }
}
