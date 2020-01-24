const Adventure = require('./models/adventure');
const queryString = require('query-string');

const errors = {
  MISSING_HEADERS: 'Gebruikersinformatie incompleet of afwezig',
  INVALID_ID: 'Invalide adventure ID',
  USER_DOES_NOT_EXIST: 'Gebruiker bestaat niet',
  INVALID_TOKEN: 'Ongeldige toegangs token',
  NO_PERMISSIONS: 'Je hebt geen toegang tot deze actie',
  INVALID_ADVENTURE: 'Adventure bestaat niet'
}

exports.init = (wss) => {
  const connections = {
    players: new Map(),
    teams: new Map(),
    adventures: new Map()
  };

  wss.on('connection', async (ws, req) => {
    const {
      query: {
        user,
        adventure,
        token
      }
    } = queryString.parseUrl(req.url);

    if(!(
      user
      && adventure
      && token
    )) {
      ws.close(401, errors.MISSING_HEADERS);
      return;
    }

    if(!/^[a-f\d]{24}$/i.test(adventure)) {
      ws.close(401, errors.INVALID_ID);
      return;
    }
    
    const adventureObject = await Adventure.findOne({ _id, adventure });

    if(!adventureObject) {
      ws.close(401, errors.INVALID_ADVENTURE);
      return;
    }

    let team;
    let player;

    teamLoop:
    for(const team1 of adventureObject.teams) {
      for(const player1 of team.player) {
        if(player.id === user) {
          player = player1;
          team = team1
          break teamLoop;
        }
      }
    }

    if(!player) {
      ws.close(401, errors.USER_DOES_NOT_EXIST);
      return;
    }

    if(player.token !== token) {
      ws.close(401, errors.INVALID_TOKEN);
      return;
    }

    connections.teams.set(team.id, ws);
    connections.players.set(player.id, ws);
    connections.adventures.set(adventureObject.id, ws);

    ws.on('close', () => {
      connections.teams.delete(team.id);
      connections.players.delete(player.id);
      connections.adventures.delete(adventureObject.id);
    });
  });

  exports.broadcast = ({
    team,
    player,
    adventure,
    type,
    data
  }) => {
    const sockets = [
      ...[team].flat().map(team => connections.teams.get(team)),
      ...[player].flat().map(player => connections.players.get(player)),
      ...[adventure].flat().map(adventure => connections.teams.get(adventure))
    ].filter(Boolean);

    for(const socket of sockets) {
      socket.send({
        type,
        data
      });
    }
  }
}