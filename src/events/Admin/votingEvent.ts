import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, TextChannel } from "discord.js";
import { client } from "../..";
import { Voting } from "../../database/models/Voting";

const votingAdd = new Set();
const votingCount = new Map([
  ['yes', 0],
  ['no', 0]
])

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    const splitedArray = interaction.customId.split('-')
    const votingDb = await Voting.findOne({ where: { voting_id: `${splitedArray[2]}` } });
    if (splitedArray[0] !== 'Voting') return;

    await interaction.deferUpdate();

    if (!votingDb) {
      interaction.followUp({
        content: `Произошла ошибка. \nОбратитесь к разработчику. \nВремя ${Date.now()}`,
        ephemeral: true
      })
    } else {

      switch (splitedArray[1]) {
        case 'Yes': {

          if (votingAdd.has(`${interaction.user.id}-${interaction.message.id}-yes`)) {

            interaction.followUp({
              content: `Вы уже проголосовали за -за-`,
              ephemeral: true
            })
            return;
          } else {

            votingAdd.add(`${interaction.user.id}-${interaction.message.id}-yes`);
            votingDb.voting_yes += 1;

            if (votingAdd.has(`${interaction.user.id}-${interaction.message.id}-no`)) {
              votingAdd.delete(`${interaction.user.id}-${interaction.message.id}-no`);
              votingCount.set('no', (votingCount.get('no')! - 1));
              votingDb.voting_no -= 1;
            }
            votingDb.save();

            votingCount.set('yes', (votingCount.get('yes')! + 1));

            const buttonLable = await interaction.channel?.messages.fetch(`${splitedArray[2]}`);

            buttonLable?.edit({
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`Voting-Yes-${splitedArray[2]}`)
                    .setLabel(`За ${votingCount.get('yes')}`)
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId(`Voting-No-${splitedArray[2]}`)
                    .setLabel(`Против ${votingCount.get('no')}`)
                    .setStyle(ButtonStyle.Danger)
                )
              ]
            })
          }
        }
          break;
        case 'No': {

          if (votingAdd.has(`${interaction.user.id}-${interaction.message.id}-no`)) {

            interaction.followUp({
              content: `Вы уже проголосовали за -против-`,
              ephemeral: true
            })
            return;
          } else {

            votingAdd.add(`${interaction.user.id}-${interaction.message.id}-no`);
            votingDb.voting_no += 1;

            if (votingAdd.has(`${interaction.user.id}-${interaction.message.id}-no`)) {
              votingAdd.delete(`${interaction.user.id}-${interaction.message.id}-yes`);
              votingCount.set('yes', (votingCount.get('yes')! - 1));
              votingDb.voting_yes -= 1;
            }
            votingDb.save();

            votingCount.set('no', (votingCount.get('no')! + 1));

            const buttonLable = await interaction.channel?.messages.fetch(`${splitedArray[2]}`);

            buttonLable?.edit({
              components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`Voting-Yes-${splitedArray[2]}`)
                    .setLabel(`За ${votingCount.get('yes')}`)
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId(`Voting-No-${splitedArray[2]}`)
                    .setLabel(`Против ${votingCount.get('no')}`)
                    .setStyle(ButtonStyle.Danger)
                )
              ]
            })
          }
        }
          break;
      }
    }
  }
});