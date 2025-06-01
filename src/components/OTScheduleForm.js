import React, { useState } from 'react';
import { db, storage } from '../services/firebase';
import { logger } from '../services/logger';
import { OT_IDS, ANESTHESIA_TYPES } from '../utils/constants';

function OTScheduleForm() {
  const [formData, setFormData] = useState({
    date_time: '',
    ot_id: '',
    anesthesia_type: '',
    anesthesiologist: '',
    main_surgeon: '',
    assistant_surgeon: '',
    nurses: '',
    pre_op_events: '',
    post_op_events: '',
    remarks: '',
    resources: '',
    status: 'Scheduled',
  });
  const [reportFile, setReportFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const procedureId = db.collection('OT_Schedules').doc().id;
      let reportUrl = '';
      if (reportFile) {
        const storageRef = storage.ref(`reports/${procedureId}/${reportFile.name}`);
        await storageRef.put(reportFile);
        reportUrl = await storageRef.getDownloadURL();
        logger.info(`Uploaded report for procedure ${procedureId}`);
      }
      await db.collection('OT_Schedules').doc(procedureId).set({
        ...formData,
        date_time: new Date(formData.date_time),
        nurses: formData.nurses.split(',').map(n => n.trim()).filter(n => n),
        resources: formData.resources.split(',').map(r => ({ name: r.trim(), quantity: 1 })),
        surgical_reports: reportUrl ? [reportUrl] : [],
      });
      logger.info(`Created procedure ${procedureId}`);
      alert('Procedure scheduled successfully!');
      setFormData({
        date_time: '',
        ot_id: '',
        anesthesia_type: '',
        anesthesiologist: '',
        main_surgeon: '',
        assistant_surgeon: '',
        nurses: '',
        pre_op_events: '',
        post_op_events: '',
        remarks: '',
        resources: '',
        status: 'Scheduled',
      });
      setReportFile(null);
    } catch (error) {
      logger.error(`Error creating procedure: ${error.message}`);
      alert('Error scheduling procedure');
    }
  };

  return (
    <div className="card p-4">
      <h2>Add/Edit Procedure</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date and Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={formData.date_time}
            onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Operation Theater</label>
          <select
            className="form-control"
            value={formData.ot_id}
            onChange={(e) => setFormData({ ...formData, ot_id: e.target.value })}
            required
          >
            <option value="">Select OT</option>
            {OT_IDS.map((ot) => (
              <option key={ot} value={ot}>{ot}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Anesthesia Type</label>
          <select
            className="form-control"
            value={formData.anesthesia_type}
            onChange={(e) => setFormData({ ...formData, anesthesia_type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            {ANESTHESIA_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Anesthesiologist</label>
          <input
            type="text"
            className="form-control"
            value={formData.anesthesiologist}
            onChange={(e) => setFormData({ ...formData, anesthesiologist: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Main Surgeon</label>
          <input
            type="text"
            className="form-control"
            value={formData.main_surgeon}
            onChange={(e) => setFormData({ ...formData, main_surgeon: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Assistant Surgeon (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={formData.assistant_surgeon}
            onChange={(e) => setFormData({ ...formData, assistant_surgeon: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Nurses (Comma-separated, Optional)</label>
          <input
            type="text"
            className="form-control"
            value={formData.nurses}
            onChange={(e) => setFormData({ ...formData, nurses: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Pre-Operative Events</label>
          <textarea
            className="form-control"
            value={formData.pre_op_events}
            onChange={(e) => setFormData({ ...formData, pre_op_events: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Post-Operative Events</label>
          <textarea
            className="form-control"
            value={formData.post_op_events}
            onChange={(e) => setFormData({ ...formData, post_op_events: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Surgical Report</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.txt"
            onChange={(e) => setReportFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label>Remarks</label>
          <textarea
            className="form-control"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Resources (Comma-separated)</label>
          <input
            type="text"
            className="form-control"
            value={formData.resources}
            onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default OTScheduleForm;