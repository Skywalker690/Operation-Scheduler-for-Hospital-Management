import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { logger } from '../services/logger';

function UserScheduleViewer() {
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    logger.info('UserScheduleViewer component mounted');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        logger.info(`User logged in: ${user.email}`);
      } else {
        setUser(null);
        logger.info('No user logged in');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const start = new Date(dateFilter);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateFilter);
        end.setHours(23, 59, 59, 999);
        const snapshot = await db.collection('OT_Schedules')
          .where('date_time', '>=', start)
          .where('date_time', '<=', end)
          .get();
        const schedulesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(schedulesData);
        logger.info(`Fetched ${schedulesData.length} schedules for ${dateFilter}`);
      } catch (error) {
        logger.error(`Error fetching schedules: ${error.message}`);
      }
    };
    fetchSchedules();
  }, [dateFilter]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      logger.info(`User registered: ${email}`);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      alert('Error registering user');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      logger.info(`User logged in: ${email}`);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      alert('Error logging in');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logger.info('User logged out');
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>User Access</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Register</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <input type="email" name="email" className="form-control" placeholder="Email" required />
              </div>
              <div className="mb-3">
                <input type="password" name="password" className="form-control" placeholder="Password" required />
              </div>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
          <div className="col-md-6">
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input type="email" name="email" className="form-control" placeholder="Email" required />
              </div>
              <div className="mb-3">
                <input type="password" name="password" className="form-control" placeholder="Password" required />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>OT Schedules</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <div className="mb-3">
        <label>Date Filter</label>
        <input
          type="date"
          className="form-control"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>OT ID</th>
            <th>Anesthesia</th>
            <th>Surgeon</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule.id}>
              <td>{schedule.date_time.toDate().toLocaleString()}</td>
              <td>{schedule.ot_id}</td>
              <td>{schedule.anesthesia_type} ({schedule.anesthesiologist})</td>
              <td>{schedule.main_surgeon}</td>
              <td>{schedule.status}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    logger.info(`Viewing details for procedure ${schedule.id}`);
                    alert(JSON.stringify(schedule, null, 2));
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserScheduleViewer;