import { Server } from 'http';
import { Server as Socket } from 'socket.io';
import { getTeam, Team, Teams } from '../team/team';
import {
  cartRate,
  totalDuration,
  wrongAnswerFactor,
  noAnswerFactor,
  winStreakThreshold,
  countTeamWithHighStreakThreshold,
} from '../conf';
import DifficultyHandler from '../difficulty/DifficultyHandler';
import CartHandler from '../cart/CartHandler';
import gameEvents from '../events/gameEvents';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const difficultyHandler = new DifficultyHandler(totalDuration);
const cartHandler = new CartHandler(totalDuration, difficultyHandler);

export const initSocket = (server: Server) => {
  const io = new Socket(server, { cors: { origin: '*' } });

  setupScoreSocket(io);

  setupAttendeesSocket(io);

  gameEvents.on('newCart', (cart) => {
    io.of('/team').emit('cart', cart);
  });
};

const setupScoreSocket = (
  io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.of('/scores').on('connection', (socket) => {
    console.log('Scores connected');

    const teamSender = setInterval(
      () =>
        socket.emit('current', {
          isStarted: cartHandler.isStarted && difficultyHandler.isStarted,
          teams: Teams,
          difficulty: difficultyHandler.currentDifficulty,
          remainingTime: cartHandler.getRemainingTime(),
          remainingDifficultyTime: difficultyHandler.getRemainingTime(),
        }),
      1000
    );

    socket.on('start', () => gameEvents.emit('start'));

    socket.on('disconnect', () => {
      clearInterval(teamSender);
      console.log('Scores disconnected');
    });
  });
};

const setupAttendeesSocket = (
  io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.of('/team').on('connection', (socket) => {
    let team: Team;

    socket.on('auth', (teamName) => {
      team = getTeam(teamName);
      if (team.connected) {
        console.log(`${teamName} tried to connect twice`);
        socket.disconnect(true);
        // Team must stay connected
        team.connect();
      } else {
        team.connect();
        console.log(`${teamName} connected`);
      }
    });

    socket.on('invoice', (invoice) => {
      if (team) {
        socket.emit(
          'invoice',
          team.validateInvoice(
            invoice,
            cartHandler.expectedInvoice,
            cartHandler.expectedPrice
          )
        );
      }
    });

    socket.on('disconnect', (): void => {
      console.log(`${team?.name || 'Unknown'} disconnected`);
      team?.disconnect();
    });
  });
};

gameEvents.on('start', () => {
  console.log(`
    ----------------------
    Start sending cart for ${totalDuration / 60000} minutes with 1 cart per ${
    cartRate / 1000
  } seconds
    Invalid answer losing points rate: -${wrongAnswerFactor * 100} %
    No answer losing points rate: -${noAnswerFactor * 100} %
    Difficulty: ${difficultyHandler.currentDifficulty}
    Difficulty auto update: ${totalDuration / (4 * 60000)} minutes
    Difficulty winstreak update: ${countTeamWithHighStreakThreshold} attendee(s) with ${winStreakThreshold} valid answers in a row
    ----------------------
    `);
});

gameEvents.on('end', () => {
  console.log(`
    ----------------------
    Stop sending cart !
    Reset difficulty to ${difficultyHandler.currentDifficulty}
    ----------------------
      `);
});
