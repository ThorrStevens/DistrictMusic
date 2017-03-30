require("rootpath")();
var platforms = require("./platforms");

module.exports = {
    production: true,
    logs: false,
    server: {
      port: 3020,
      domain: "http://districtmusic.herokuapp.com/",
      frontend: "http://districtmusic.herokuapp.com/",
      frontendPath: "public/"
    },
    mongo: {
      admin: 'DistrictMusicAdmin',
      password: '$mus1c@dm1n',
      cluster: 'district-music',
      db: 'district-music'
    },
    session: {
      domain: "districtmusic"
    },
    auto: {
      resetVetos: 1, // amount of 'vetos left' to reset to every week
      resetSuperVotes: 2, // amount of 'super votes left' to reset to every week
      minVoteScore: -10, // auto delete on downvote
      minLegacyScore: 10, // available for random additions by cronbot
      minSongsInQueue: 3, // minimum number of songs in queue before auto re adding old ones
      cronPatternCheckSpeakerQueueUpdate: '00 * * * * 1-60/10', // every 10 seconds
      cronPatternCheckQueueEmpty: '00 * * * * 1-60', // every minute
      cronPatternAddRandomSong: '00 00 09 * * 1-5', // every weekday in the morning
      cronPatternResetVotes: '00 00 07 * * 1', // every monday morning at 7:00
      cronPatternScheduleFilesToBeRemoved: '00 00 23 * * 7', // every sunday night at 23:00
      cronPatternRemoveScheduledFiles: '00 00 08 * * 1' // every monday morning at 8:00
    }
};