import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { logger } from '../services/logger';
import OTScheduleForm from './OTScheduleForm';
import OTAnalytics from './OTAnalytics';
import UserScheduleViewer from './UserScheduleViewer';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('schedule');

  useEffect(() => {
    logger.info('AdminDashboard component mounted');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        logger.info(`Admin logged in: ${user.email}`);
      } else {
        setUser(null);
        logger.info('No admin logged in');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logger.info('Admin logged out');
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>Admin Login</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          auth.signInWithEmailAndPassword(email, password)
            .then(() => logger.info(`Login attempt for ${email}`))
            .catch((error) => logger.error(`Login error: ${error.message}`));
        }}>
          <div className="mb-3">
            <input type="email" name="email" className="form-control" placeholder="Email" required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" required />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Operation Scheduler - Admin</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <nav>
        <button className="btn btn-link" onClick={() => setView('schedule')}>Manage Schedules</button>
        <button className="btn btn-link" onClick={() => setView('analytics')}>Analytics</button>
        <button className="btn btn-link" onClick={() => setView('viewer')}>View Schedules</button>
      </nav>
      {view === 'schedule' && <OTScheduleForm />}
      {view === 'analytics' && <OTAnalytics />}
      {view === 'viewer' && <UserScheduleViewer />}
    </div>
  );
}

export default AdminDashboard;