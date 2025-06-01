import { db } from '../src/services/firebase';
import { logger } from '../src/services/logger';

describe('OT Schedule Tests', () => {
  test('should create a new procedure', async () => {
    const procedure = {
      date_time: new Date(),
      ot_id: 'OT-1',
      anesthesia_type: 'General',
      anesthesiologist: 'Dr. Smith',
      main_surgeon: 'Dr. Jones',
      status: 'Scheduled'
    };
    try {
      const docRef = await db.collection('OT_Schedules').add(procedure);
      const doc = await docRef.get();
      expect(doc.exists).toBe(true);
      expect(doc.data().ot_id).toBe('OT-1');
      logger.info('Test: Successfully created procedure');
    } catch (error) {
      logger.error(`Test: Error creating procedure: ${error.message}`);
      throw error;
    }
  });
});