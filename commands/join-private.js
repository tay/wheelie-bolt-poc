const { sendInviteRequest } = require('../actions/join-private');

const Group = require('../models/group');

const joinPrivate = async ({
  command, client, ack, respond,
}) => {
  await ack();

  if (!command.text) {
    respond('A channel is required. Use `/list-private` to see a list of available private channels');
    return;
  }

  const chans = await Group.get(client);
  const channelName = command.text.replace(/^#/, '');
  const channel = chans.find((g) => g.name === channelName);
  if (!channel) {
    respond(`#${channelName} not found. Heelie must be a member of #${channelName}.`);
  }

  await sendInviteRequest(client, channelName, command.user_id);

  const cocTxt = process.env.COC_URL ? `<${process.env.COC_URL}|Code of Conduct>` : 'Code of Conduct';
  respond(`Join request sent. Please wait while the request is processed.\n\nRemember that private channels are not for allies unless otherwise specified and that there is a strong expectation of privacy in these channels -- what is said in there stays there.\n\nThe ${cocTxt} still fully applies in these spaces, with some channel-specific caveats (discussion of sexuality in lgbtq channels, for example).`);
};

module.exports = { joinPrivate };
