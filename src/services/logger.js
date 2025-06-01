import winston from 'https://cdn.jsdelivr.net/npm/winston@3.8.2/dist/winston.min.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // Optionally, log to Firestore
    {
      log: (info) => {
        db.collection('Logs').add({
          level: info.level,
          message: info.message,
          timestamp: info.timestamp
        }).catch(error => console.error('Error logging to Firestore:', error));
      }
    }
  ]
});

export { logger };