import { Command, flags } from "@oclif/command";
import { DYNAMO_CLIENT_VERSION } from "../constants";
import * as AWS from "aws-sdk";
import CliProgress from "cli-progress";

export default class Delete extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    target: flags.string({
      description: "Name of the DynamoDB table to delete records from",
      required: true,
    }),
    region: flags.string({
      description: "AWS region that the DynamoDB is hosted in",
      required: true,
    }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Delete);

    const sourceDynamo = new AWS.DynamoDB.DocumentClient({
      region: flags.region,
      apiVersion: DYNAMO_CLIENT_VERSION,
    });

    const tableInfo = await new AWS.DynamoDB({
      region: flags.region,
      apiVersion: DYNAMO_CLIENT_VERSION,
    })
      .describeTable({ TableName: flags.target })
      .promise();
    const approxTotal = tableInfo.Table?.ItemCount ?? 0;

    const progress = new CliProgress.SingleBar(
      { clearOnComplete: true },
      CliProgress.Presets.shades_classic
    );
    progress.start(approxTotal, 0);

    const scanArgs = {
      TableName: flags.target,
      Limit: 10,
    } as AWS.DynamoDB.DocumentClient.ScanInput;

    do {
      const scanResults = await sourceDynamo.scan(scanArgs).promise();
      progress.increment(scanResults.Count);

      scanArgs.ExclusiveStartKey = scanResults.LastEvaluatedKey;

      const deleteParams = {
        RequestItems: {} as Record<string, any>,
      };

      deleteParams.RequestItems[flags.target] = scanResults?.Items?.map((item) => {
        const Key = {} as Record<string, any>;

        tableInfo.Table?.KeySchema?.forEach((attr) => {
          Key[attr.AttributeName] = item[attr.AttributeName];
        });
        return { DeleteRequest: { Key } };
      });

      await sourceDynamo.batchWrite(deleteParams).promise();
    } while (scanArgs.ExclusiveStartKey);

    progress.stop();
  }
}
