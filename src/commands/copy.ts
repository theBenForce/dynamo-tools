/* eslint-disable object-curly-spacing */
import { Command, flags } from "@oclif/command";
import * as AWS from "aws-sdk";
import Listr from "listr";
import { Observable } from "rxjs";

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

    const sourceDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.sourceRegion,
      apiVersion: "2012-08-10",
    });
    const destDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.destinationRegion,
      apiVersion: "2012-08-10",
    });

    const scanArgs = {
      TableName: flags.source,
      Limit: flags.batchSize,
    } as AWS.DynamoDB.DocumentClient.ScanInput;
    let results: AWS.DynamoDB.DocumentClient.ScanOutput;

    const batchWrite = {
      RequestItems: {},
    } as AWS.DynamoDB.DocumentClient.BatchWriteItemInput;

    const tasks = new Listr([
      {
        title: `Copying data`,
        // @ts-ignore
        task: () =>
          new Observable(async (observer) => {
            do {
              observer.next(`Getting items from source`);
              results = await sourceDynamo.scan(scanArgs).promise();

              scanArgs.ExclusiveStartKey = results.LastEvaluatedKey;

              observer.next(`Writing ${results.Count} items...`);
              batchWrite.RequestItems[flags.destination] =
                results?.Items?.map((Item) => ({
                  PutRequest: {
                    Item,
                  },
                })) ?? [];

              await destDynamo.batchWrite(batchWrite).promise();
            } while (results?.LastEvaluatedKey);

            observer.complete();
          }),
      },
    ]);

    await tasks.run().catch((err: Error) => this.error(err.message));
  }
}
