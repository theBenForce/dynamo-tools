import { Command, flags } from "@oclif/command";
import * as AWS from "aws-sdk";
import Listr from "listr";
import { Observable } from "rxjs";
import CliProgress from "cli-progress";
import * as fs from "fs";
import * as path from "path";

const JSON_INDENT = 2;

export default class Backup extends Command {
  static description = "Backup all entries in a dynamodb table to a file";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    source: flags.string({
      description: "Name of the DynamoDB to copy entries from",
      required: true,
    }),
    region: flags.string({
      description: "AWS region that the DynamoDB is hosted in",
      required: true,
    }),
    batchSize: flags.integer({
      description: "The number of items to copy at a time",
      default: 100,
    }),
  };

  static args = [{ name: "file", description: "Path to write the backup to." }];

  async run() {
    const { args, flags } = this.parse(Backup);

    const sourceDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.region,
      apiVersion: "2012-08-10",
    });

    const dynamo = new AWS.DynamoDB({
      region: flags.region,
      apiVersion: "2012-08-10",
    });
    const scanArgs = {
      TableName: flags.source,
      Limit: flags.batchSize,
    } as AWS.DynamoDB.DocumentClient.ScanInput;
    let results: AWS.DynamoDB.DocumentClient.ScanOutput;

    const destination = path.resolve(args.file);
    const items: Array<any> = [];
    const downloadBar = new CliProgress.SingleBar({}, CliProgress.Presets.shades_classic);

    const tableInfo = await dynamo.describeTable({ TableName: flags.source }).promise();
    const approxTotal = tableInfo.Table?.ItemCount ?? 0;
    downloadBar.start(approxTotal, 0);
    do {
      results = await sourceDynamo.scan(scanArgs).promise();

      scanArgs.ExclusiveStartKey = results.LastEvaluatedKey;

      results.Items?.forEach((item) => items.push(item));

      downloadBar.update(items.length);
    } while (results?.LastEvaluatedKey);

    downloadBar.stop();

    fs.writeFileSync(
      destination,
      JSON.stringify(
        {
          source: flags.source,
          region: flags.region,
          items,
        },
        null,
        JSON_INDENT
      ),
      { encoding: "utf-8" }
    );
  }
}
