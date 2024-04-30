const { TeamsActivityHandler, TurnContext } = require("botbuilder");
const dotenv = require("dotenv");

class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
    dotenv.config();

    const myFlavor = process.env.BOT_FLAVOUR || process.env.COMPUTERNAME || "vanilla";

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      const removedMentionText = TurnContext.removeRecipientMention(context.activity);
      const txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      await context.sendActivity(`**${myFlavor}**: ${txt}`);
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    // Listen to MembersAdded event, view https://docs.microsoft.com/en-us/microsoftteams/platform/resources/bot-v3/bots-notifications for more events
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          await context.sendActivity(
            `Hi there! I'm a **${myFlavor}** bot that will echo what you said to me.`
          );
          break;
        }
      }
      await next();
    });
  }
}

module.exports.TeamsBot = TeamsBot;
