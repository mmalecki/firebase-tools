import { Command } from "../command";
import * as logger from "../logger";
import * as requireInstance from "../requireInstance";
import { requirePermissions } from "../requirePermissions";
import * as metadata from "../database/metadata";
import * as fs from "fs-extra";
import * as path from "path";

export default new Command("database:rules:stage")
  .description("create a new realtime database ruleset")
  .option(
    "--instance <instance>",
    "use the database <instance>.firebaseio.com (if omitted, uses default database instance)"
  )
  .before(requirePermissions, ["firebasedatabase.instances.update"])
  .before(requireInstance)
  .action(async (options: any) => {
    const filepath = options.config.data.database.rules;
    logger.info(`staging ruleset from ${filepath}`);
    const source = fs.readFileSync(path.resolve(filepath), "utf8");
    const rulesetId = await metadata.createRuleset(options.instance, source);
    logger.info(`staged ruleset ${rulesetId}`);
    return rulesetId;
  });
