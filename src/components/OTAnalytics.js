  import React, { useState, useEffect } from 'react';
  import { db } from '../services/firebase';
  import { logger } from '../services/logger';
  import Chart from 'chart.js/auto';
  import { OT_IDS } from '../utils/constants';

  function OTAnalytics() {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
      logger.info('OTAnalytics component mounted');
      const canvas = document.getElementById('otChart');
      let chartInstance = null;

      const fetchAnalytics = async () => {
        try {
          const snapshot = await db.collection('OT_Schedules')
            .where('date_time', '>=', new Date('2025-06-01'))
            .where('date_time', '<=', new Date('2025-06-07'))
            .get();
          const procedureCounts = OT_IDS.reduce((acc, ot) => ({ ...acc, [ot]: 0 }), {});
          snapshot.forEach(doc => {
            const data = doc.data();
            procedureCounts[data.ot_id]++;
          });
          setAnalyticsData(procedureCounts);
          logger.info('Fetched analytics data');

          if (canvas) {
            chartInstance = new Chart(canvas, {
              type: 'bar',
              data: {
                labels: OT_IDS,
                datasets: [{
                  label: 'Procedures per OT',
                  data: OT_IDS.map(ot => procedureCounts[ot] || 0),
                  backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
                  borderColor: ['#388E3C', '#1976D2', '#F57C00', '#D32F2F'],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Number of Procedures' }
                  },
                  x: {
                    title: { display: true, text: 'Operation Theater' }
                  }
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'OT Utilization for Week of June 1, 2025'
                  }
                }
              }
            });
          }
        } catch (error) {
          logger.error(`Error fetching analytics: ${error.message}`);
        }
      };

      fetchAnalytics();
      return () => {
        if (chartInstance) chartInstance.destroy();
      };
    }, []);

    return (
      <div className="card p-4">
        <h2>OT Analytics</h2>
        <canvas id="otChart"></canvas>
        {analyticsData && (
          <div className="mt-3">
            <h3>Summary</h3>
            <ul>
              {OT_IDS.map(ot => (
                <li key={ot}>{ot}: {analyticsData[ot] || 0} procedures</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  export default OTAnalytics;