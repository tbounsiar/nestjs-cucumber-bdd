import {
  AfterAll,
  Before,
  BeforeAll,
  DataTable,
  Given,
  Then,
  When,
} from '@cucumber/cucumber';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule, typeOrmModule, entities } from '../../../src/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CallbackHandler } from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fsReadFile } from 'ts-loader/dist/utils';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

let container: StartedTestContainer;
let app: INestApplication;
let req: request.Test;
let dataSource: DataSource;
BeforeAll({ timeout: 10 * 5000 }, async () => {
  // Launch Test DB using Docker Container
  container = await new GenericContainer('mysql:8.0-debian')
    .withName('test-db')
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: 'root',
      MYSQL_DATABASE: 'test-db',
      MYSQL_USER: 'user',
      MYSQL_PASSWORD: 'password',
    })
    .withExposedPorts({ container: 3306, host: 3306 })
    .start();
});

AfterAll(async () => {
  await container.stop();
});

Before(async () => {
  const builder = Test.createTestingModule({
    imports: [AppModule],
  });

  // builder.overrideModule(typeOrmModule).useModule(testTypeOrmModule);
  builder.overrideModule(typeOrmModule).useModule(
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'test-db',
      dropSchema: true,
      entities,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      // logging: true
    }),
  );

  const moduleFixture = await builder.compile();

  dataSource = await moduleFixture.resolve(DataSource);

  app = moduleFixture.createNestApplication();
  await app.init();
});

Given(/^The following data:$/, async (tables: DataTable) => {
  const runner = dataSource.createQueryRunner();
  await runner.connect();
  await runner.startTransaction();
  try {
    for (const table of tables.hashes()) {
      const sql = fsReadFile(__dirname + '/../sql/' + table.sqlFile, 'utf8');
      await runner.query(sql);
      const csv = fsReadFile(
        __dirname + '/../csv/' + table.csvFile,
        'utf8',
      );
      const insert = buildInsertQuery(csv, table.tableName);
      await runner.query(insert);
    }
    await runner.commitTransaction();
  } catch (err) {
    // since we have errors let's rollback changes we made
    await runner.rollbackTransaction();
    throw err;
  } finally {
    // you need to release query runner which is manually created:
    await runner.release();
  }
});
When(/^GET "([^"]*)" path$/, (url: string) => {
  req = request(app.getHttpServer()).get(url);
  req.send();
});
Then('The http response status to be {int}', (status: number) => {
  req.expect(status);
});
Then(
  'The http response body to be like content of {string} file',
  (jsonFile: string, done: CallbackHandler) => {
      // Read the JSON File
      const json = fsReadFile(__dirname + '/../json/' + jsonFile, 'utf8');
      // Compare to http response body
      req.expect(JSON.parse(json), done);
  },
);

function buildInsertQuery(csvData: string, tableName: string): string {
  // Split CSV into rows
  const rows = csvData.trim().split('\n');
  if (rows.length < 2) {
    throw new Error(
      'CSV data must contain at least header row and one data row.',
    );
  }

  // Extract column names from header row
  const columns = rows[0].trim().split('|');

  // Initialize array to store values for each row
  const valuesArray: string[] = [];

  // Iterate over data rows to generate values
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i]
      .trim()
      .split('|')
      .map((value) => `'${value}'`);
    valuesArray.push(`(${values.join(', ')})`);
  }

  // Generate bulk insert query
  const bulkInsertQuery =
    `INSERT INTO ${tableName} (${columns.join(', ')})  ` +
    `\tVALUES\n${valuesArray.join(',\n')};`;

  return bulkInsertQuery;
}
