# 🎨 Frontend Examples - Job History API

## 📋 ตัวอย่างการใช้งานใน Frontend

---

## 1. JavaScript (Vanilla JS / Fetch API)

### 1.1 ดึงตำแหน่งปัจจุบันพร้อมระยะเวลา

```javascript
// ฟังก์ชันดึงตำแหน่งปัจจุบัน
async function getCurrentJob(employeeId) {
  try {
    const token = localStorage.getItem('token'); // หรือ sessionStorage
    
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}/current-job`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current job');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// การใช้งาน
getCurrentJob('1234567890123')
  .then(data => {
    console.log('Current Job:', data);
    
    if (data.current_job) {
      // แสดงข้อมูลตำแหน่งปัจจุบัน
      document.getElementById('job-group').textContent = data.current_job.job_group.job_group_name;
      document.getElementById('position-type').textContent = data.current_job.position_type?.position_type_name || '-';
      document.getElementById('position-level').textContent = data.current_job.position_level?.position_level_name || '-';
      document.getElementById('start-date').textContent = data.start_date;
      document.getElementById('duration').textContent = data.duration.display;
    } else {
      document.getElementById('job-info').textContent = data.message;
    }
  })
  .catch(error => {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  });
```

### 1.2 ดึงประวัติการทำงานทั้งหมด

```javascript
// ฟังก์ชันดึงประวัติทั้งหมด
async function getJobHistory(employeeId) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}/job-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job history');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// การใช้งาน - แสดงเป็นตาราง
getJobHistory('1234567890123')
  .then(data => {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = ''; // ล้างข้อมูลเก่า

    data.data.forEach(record => {
      const row = document.createElement('tr');
      
      // เพิ่ม class สำหรับตำแหน่งปัจจุบัน
      if (record.is_current) {
        row.classList.add('current-job');
      }

      row.innerHTML = `
        <td>${record.job_group.job_group_name}</td>
        <td>${record.position_type?.position_type_name || '-'}</td>
        <td>${record.position_level?.position_level_name || '-'}</td>
        <td>${record.start_date || 'ไม่ระบุ'}</td>
        <td>${record.end_date || 'ปัจจุบัน'}</td>
        <td>${record.duration ? `${record.duration.years} ปี ${record.duration.months} เดือน ${record.duration.days} วัน` : '-'}</td>
        <td>${record.is_current ? '<span class="badge badge-success">ปัจจุบัน</span>' : ''}</td>
      `;
      
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  });
```

### 1.3 เปลี่ยนตำแหน่งงาน (Admin)

```javascript
// ฟังก์ชันเปลี่ยนตำแหน่ง
async function changeJobGroup(employeeId, newJobGroupId, startDate) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}/job-history/change`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        new_job_group_id: newJobGroupId,
        start_date: startDate
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// การใช้งาน - จาก Form
document.getElementById('change-job-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const employeeId = document.getElementById('employee-id').value;
  const newJobGroupId = document.getElementById('new-job-group').value;
  const startDate = document.getElementById('start-date').value;

  try {
    const result = await changeJobGroup(employeeId, newJobGroupId, startDate);
    alert(result.message);
    
    // Reload ข้อมูล
    getJobHistory(employeeId);
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  }
});
```

---

## 2. React.js

### 2.1 Custom Hook สำหรับ Job History

```jsx
// hooks/useJobHistory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const useJobHistory = (employeeId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${API_URL}/employees/${employeeId}/job-history`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setHistory(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchHistory();
    }
  }, [employeeId]);

  return { history, loading, error };
};

export const useCurrentJob = (employeeId) => {
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentJob = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${API_URL}/employees/${employeeId}/current-job`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setCurrentJob(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchCurrentJob();
    }
  }, [employeeId]);

  return { currentJob, loading, error };
};
```

### 2.2 Component แสดงตำแหน่งปัจจุบัน

```jsx
// components/CurrentJobCard.jsx
import React from 'react';
import { useCurrentJob } from '../hooks/useJobHistory';

const CurrentJobCard = ({ employeeId }) => {
  const { currentJob, loading, error } = useCurrentJob(employeeId);

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="error">เกิดข้อผิดพลาด: {error}</div>;
  }

  if (!currentJob?.current_job) {
    return <div className="info">{currentJob?.message}</div>;
  }

  const { current_job, start_date, duration } = currentJob;

  return (
    <div className="current-job-card">
      <h3>ตำแหน่งปัจจุบัน</h3>
      
      <div className="job-info">
        <div className="info-row">
          <label>กลุ่มงาน:</label>
          <span>{current_job.job_group.job_group_name}</span>
        </div>

        <div className="info-row">
          <label>ตำแหน่งในสายงาน:</label>
          <span>{current_job.position_type?.position_type_name || '-'}</span>
        </div>

        <div className="info-row">
          <label>ระดับตำแหน่ง:</label>
          <span>{current_job.position_level?.position_level_name || '-'}</span>
        </div>

        <div className="info-row">
          <label>วันที่เริ่มต้น:</label>
          <span>{new Date(start_date).toLocaleDateString('th-TH')}</span>
        </div>

        <div className="info-row">
          <label>ระยะเวลา:</label>
          <span className="duration">{duration.display}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentJobCard;
```

### 2.3 Component แสดงประวัติการทำงาน

```jsx
// components/JobHistoryTable.jsx
import React from 'react';
import { useJobHistory } from '../hooks/useJobHistory';

const JobHistoryTable = ({ employeeId }) => {
  const { history, loading, error } = useJobHistory(employeeId);

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="error">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="job-history-table">
      <h3>ประวัติการทำงาน</h3>
      
      <table>
        <thead>
          <tr>
            <th>กลุ่มงาน</th>
            <th>ตำแหน่งในสายงาน</th>
            <th>ระดับตำแหน่ง</th>
            <th>วันที่เริ่ม</th>
            <th>วันที่สิ้นสุด</th>
            <th>ระยะเวลา</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr 
              key={record.history_id}
              className={record.is_current ? 'current-job' : ''}
            >
              <td>{record.job_group.job_group_name}</td>
              <td>{record.position_type?.position_type_name || '-'}</td>
              <td>{record.position_level?.position_level_name || '-'}</td>
              <td>
                {record.start_date 
                  ? new Date(record.start_date).toLocaleDateString('th-TH')
                  : 'ไม่ระบุ'}
              </td>
              <td>
                {record.end_date 
                  ? new Date(record.end_date).toLocaleDateString('th-TH')
                  : 'ปัจจุบัน'}
              </td>
              <td>
                {record.duration 
                  ? `${record.duration.years} ปี ${record.duration.months} เดือน ${record.duration.days} วัน`
                  : '-'}
              </td>
              <td>
                {record.is_current && (
                  <span className="badge badge-success">ปัจจุบัน</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobHistoryTable;
```

### 2.4 Component เปลี่ยนตำแหน่ง (Admin)

```jsx
// components/ChangeJobForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ChangeJobForm = ({ employeeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    new_job_group_id: '',
    start_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:3000/api/employees/${employeeId}/job-history/change`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert(response.data.message);
      
      // Reset form
      setFormData({ new_job_group_id: '', start_date: '' });
      
      // Callback เมื่อสำเร็จ
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-job-form">
      <h3>เปลี่ยนตำแหน่งงาน</h3>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>กลุ่มงานใหม่:</label>
          <select
            value={formData.new_job_group_id}
            onChange={(e) => setFormData({ ...formData, new_job_group_id: e.target.value })}
            required
          >
            <option value="">-- เลือกกลุ่มงาน --</option>
            <option value="1">กลุ่มงานบริหาร</option>
            <option value="2">กลุ่มงานพัฒนา</option>
            {/* ดึงจาก API */}
          </select>
        </div>

        <div className="form-group">
          <label>วันที่เริ่มต้น:</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังบันทึก...' : 'เปลี่ยนตำแหน่ง'}
        </button>
      </form>
    </div>
  );
};

export default ChangeJobForm;
```

---

## 3. Vue.js

### 3.1 Composable สำหรับ Job History

```javascript
// composables/useJobHistory.js
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useJobHistory(employeeId) {
  const history = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const fetchHistory = async () => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/employees/${employeeId.value}/job-history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      history.value = response.data.data;
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (employeeId.value) {
      fetchHistory();
    }
  });

  return { history, loading, error, refetch: fetchHistory };
}

export function useCurrentJob(employeeId) {
  const currentJob = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchCurrentJob = async () => {
    try {
      loading.value = true;
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/employees/${employeeId.value}/current-job`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      currentJob.value = response.data;
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (employeeId.value) {
      fetchCurrentJob();
    }
  });

  return { currentJob, loading, error, refetch: fetchCurrentJob };
}
```

### 3.2 Component แสดงตำแหน่งปัจจุบัน

```vue
<!-- components/CurrentJobCard.vue -->
<template>
  <div class="current-job-card">
    <h3>ตำแหน่งปัจจุบัน</h3>
    
    <div v-if="loading" class="loading">กำลังโหลด...</div>
    
    <div v-else-if="error" class="error">เกิดข้อผิดพลาด: {{ error }}</div>
    
    <div v-else-if="!currentJob?.current_job" class="info">
      {{ currentJob?.message }}
    </div>
    
    <div v-else class="job-info">
      <div class="info-row">
        <label>กลุ่มงาน:</label>
        <span>{{ currentJob.current_job.job_group.job_group_name }}</span>
      </div>

      <div class="info-row">
        <label>ตำแหน่งในสายงาน:</label>
        <span>{{ currentJob.current_job.position_type?.position_type_name || '-' }}</span>
      </div>

      <div class="info-row">
        <label>ระดับตำแหน่ง:</label>
        <span>{{ currentJob.current_job.position_level?.position_level_name || '-' }}</span>
      </div>

      <div class="info-row">
        <label>วันที่เริ่มต้น:</label>
        <span>{{ formatDate(currentJob.start_date) }}</span>
      </div>

      <div class="info-row">
        <label>ระยะเวลา:</label>
        <span class="duration">{{ currentJob.duration.display }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCurrentJob } from '../composables/useJobHistory';

const props = defineProps({
  employeeId: {
    type: String,
    required: true
  }
});

const { currentJob, loading, error } = useCurrentJob(computed(() => props.employeeId));

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH');
};
</script>
```

---

## 4. CSS สำหรับ Styling

```css
/* styles/job-history.css */

.current-job-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.current-job-card h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.job-info .info-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.job-info .info-row label {
  font-weight: bold;
  width: 200px;
  color: #666;
}

.job-info .info-row span {
  flex: 1;
  color: #333;
}

.duration {
  color: #4CAF50;
  font-weight: bold;
}

.job-history-table {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.job-history-table table {
  width: 100%;
  border-collapse: collapse;
}

.job-history-table th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.job-history-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.job-history-table tr.current-job {
  background: #e8f5e9;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.badge-success {
  background: #4CAF50;
  color: white;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.info {
  background: #e3f2fd;
  color: #1976d2;
  padding: 12px;
  border-radius: 4px;
}
```

---

## 📝 สรุป

ตัวอย่างข้างต้นครอบคลุม:
- ✅ Vanilla JavaScript (Fetch API)
- ✅ React.js (Custom Hooks)
- ✅ Vue.js (Composables)
- ✅ การจัดการ Authentication (Bearer Token)
- ✅ Error Handling
- ✅ Loading States
- ✅ การแสดงผลข้อมูล
- ✅ Form สำหรับเปลี่ยนตำแหน่ง

คุณสามารถนำไปปรับใช้ตามความเหมาะสมของโปรเจ็คได้เลยครับ!
