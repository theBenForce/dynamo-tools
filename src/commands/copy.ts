import { Command, flags } from "@oclif/command";
import * as AWS from "aws-sdk";
import CliProgress from "cli-progress";
import { DYNAMO_CLIENT_VERSION } from "../constants";

export default class Copy extends Command {
  static description = "Copy the contents of one dynamodb table to another";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    batchSize: flags.integer({ description: "The number of items to copy at a time", default: 25 }),
    region: flags.string({ description: "Region for both source and destination tables" }),
    sourceRegion: flags.string({ description: "Region of source table" }),
    destinationRegion: flags.string({ description: "Region of destination table" }),
    source: flags.string({ description: "Source table name", required: true }),
    destination: flags.string({ description: "Destination table name", required: true }),
  };

  async run() {
    const { flags } = this.parse(Copy);

    if (!flags.destinationRegion) {
      flags.destinationRegion = flags.region;
    }

    if (!flags.sourceRegion) {
      flags.sourceRegion = flags.region;
    }

    if (!flags.sourceRegion || !flags.destinationRegion) {
      this.error(`You must specific both a source and destination region`, { exit: 1 });
    }

    const dynamo = new AWS.DynamoDB({
      region: flags.sourceRegion,
      apiVersion: DYNAMO_CLIENT_VERSION,
    });

    const sourceDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.sourceRegion,
      apiVersion: DYNAMO_CLIENT_VERSION,
    });
    const destDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.destinationRegion,
      apiVersion: DYNAMO_CLIENT_VERSION,
    });

    const scanArgs = {
      TableName: flags.source,
      Limit: flags.batchSize,
    } as AWS.DynamoDB.DocumentClient.ScanInput;
    let results: AWS.DynamoDB.DocumentClient.ScanOutput;

    const batchWrite = {
      RequestItems: {},
    } as AWS.DynamoDB.DocumentClient.BatchWriteItemInput;

    const downloadBar = new CliProgress.SingleBar(
      { clearOnComplete: true },
      CliProgress.Presets.shades_classic
    );

    const tableInfo = await dynamo.describeTable({ TableName: flags.source }).promise();
    const approxTotal = tableInfo.Table?.ItemCount ?? 0;
    downloadBar.start(approxTotal, 0);
    let current = 0;

    do {
      results = await sourceDynamo.scan(scanArgs).promise();

      current += results.Count ?? 0;
      downloadBar.update(current);

      scanArgs.ExclusiveStartKey = results.LastEvaluatedKey;

      batchWrite.RequestItems[flags.destination] =
        results?.Items?.map((Item) => ({
          PutRequest: {
            Item,
          },
        })) ?? [];

      await destDynamo.batchWrite(batchWrite).promise();
    } while (results?.LastEvaluatedKey);

    downloadBar.stop();
    console.info(`Copied ${current} items from ${flags.source} to ${flags.destination}`);
  }
}
