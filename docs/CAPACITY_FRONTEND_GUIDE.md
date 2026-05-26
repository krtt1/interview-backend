# 🎨 Capacity API - คู่มือสำหรับ Frontend Developer

## 📌 สิ่งที่ต้องรู้

### 1. โครงสร้างข้อมูล
- **ฟิลด์เดี่ยว**: ส่งเป็น string ธรรมดา
- **ฟิลด์ที่เลือกได้มากกว่า 1 ข้อ**: ส่งเป็น array

### 2. ฟิลด์ที่เป็น Array (เลือกได้มากกว่า 1 ข้อ)
- `trainingCourses` - หลักสูตร/ประสบการณ์ที่ผ่าน
- `vectorCourses` - หลักสูตรโรคติดต่อนำโดยแมลง
- `envoccCourses` - หลักสูตร EnvOcc
- `lawCourses` - หลักสูตรกฎหมาย
- `otherExperiences` - ประสบการณ์อื่นๆ

---

## 🚀 ตัวอย่างการใช้งาน

### 1. Vanilla JavaScript

#### สร้าง/อัปเดตข้อมูล
```javascript
const token = localStorage.getItem('token');
const employeeId = '1234567890123';

const capacityData = {
  prefix_name: "นาย",
  full_name: "สมชาย ใจดี",
  department: "กลุ่มงานระบาดวิทยา",
  age: 35,
  education_level: "ปริญญาตรี",
  work_duration_years: "5 ปี",
  
  // ทักษะพื้นฐาน
  skill_official_writing: "ดี",
  skill_epidemiology_basic: "ดีมาก",
  skill_excel: "ดีมาก",
  
  // หลักสูตรที่ผ่าน (Array)
  trainingCourses: [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP",
    "หลักสูตร CDCU ระบาดวิทยา"
  ],
  
  vectorCourses: [
    "ด้านกีฏวิทยา"
  ]
};

fetch(`http://localhost:3000/api/capacity/${employeeId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(capacityData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  alert('บันทึกข้อมูลสำเร็จ');
})
.catch(error => {
  console.error('Error:', error);
  alert('เกิดข้อผิดพลาด');
});
```

#### ดึงข้อมูล
```javascript
fetch(`http://localhost:3000/api/capacity/${employeeId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  if (data.data) {
    const capacity = data.data;
    
    // แสดงข้อมูลพื้นฐาน
    document.getElementById('fullName').textContent = capacity.full_name;
    document.getElementById('department').textContent = capacity.department;
    
    // แสดงหลักสูตรที่ผ่าน
    const coursesList = document.getElementById('coursesList');
    capacity.trainingCourses.forEach(course => {
      const li = document.createElement('li');
      li.textContent = course.course_name;
      coursesList.appendChild(li);
    });
  }
})
.catch(error => console.error('Error:', error));
```

---

### 2. React.js

#### Custom Hook
```javascript
// hooks/useCapacity.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const useCapacity = (employeeId) => {
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchCapacity = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/capacity/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCapacity(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const saveCapacity = async (capacityData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/capacity/${employeeId}`,
        capacityData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCapacity(response.data.data);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchCapacity();
    }
  }, [employeeId]);

  return { capacity, loading, error, saveCapacity, refetch: fetchCapacity };
};
```

#### Component
```javascript
// components/CapacityForm.jsx
import React, { useState } from 'react';
import { useCapacity } from '../hooks/useCapacity';

const CapacityForm = ({ employeeId }) => {
  const { capacity, loading, error, saveCapacity } = useCapacity(employeeId);
  
  const [formData, setFormData] = useState({
    prefix_name: '',
    full_name: '',
    department: '',
    skill_epidemiology_basic: '',
    trainingCourses: []
  });

  const [selectedCourse, setSelectedCourse] = useState('');

  const courseOptions = [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP",
    "หลักสูตร CDCU ระบาดวิทยา"
  ];

  const handleAddCourse = () => {
    if (selectedCourse && !formData.trainingCourses.includes(selectedCourse)) {
      setFormData({
        ...formData,
        trainingCourses: [...formData.trainingCourses, selectedCourse]
      });
      setSelectedCourse('');
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setFormData({
      ...formData,
      trainingCourses: formData.trainingCourses.filter(c => c !== courseToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await saveCapacity(formData);
    if (result.success) {
      alert('บันทึกข้อมูลสำเร็จ');
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ชื่อ-นามสกุล:</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        />
      </div>

      <div>
        <label>แผนก:</label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
        />
      </div>

      <div>
        <label>ทักษะระบาดวิทยา:</label>
        <select
          value={formData.skill_epidemiology_basic}
          onChange={(e) => setFormData({...formData, skill_epidemiology_basic: e.target.value})}
        >
          <option value="">เลือก</option>
          <option value="พื้นฐาน">พื้นฐาน</option>
          <option value="ปานกลาง">ปานกลาง</option>
          <option value="ดี">ดี</option>
          <option value="ดีมาก">ดีมาก</option>
          <option value="เชี่ยวชาญ">เชี่ยวชาญ</option>
        </select>
      </div>

      <div>
        <label>หลักสูตรที่ผ่าน:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">เลือกหลักสูตร</option>
          {courseOptions.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddCourse}>เพิ่ม</button>
        
        <ul>
          {formData.trainingCourses.map((course, index) => (
            <li key={index}>
              {course}
              <button type="button" onClick={() => handleRemoveCourse(course)}>ลบ</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit">บันทึก</button>
    </form>
  );
};

export default CapacityForm;
```

---

### 3. Vue.js 3 (Composition API)

#### Composable
```javascript
// composables/useCapacity.js
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function useCapacity(employeeId) {
  const capacity = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const token = localStorage.getItem('token');

  const fetchCapacity = async () => {
    loading.value = true;
    try {
      const response = await axios.get(`${API_URL}/capacity/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      capacity.value = response.data.data;
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
    } finally {
      loading.value = false;
    }
  };

  const saveCapacity = async (capacityData) => {
    loading.value = true;
    try {
      const response = await axios.post(
        `${API_URL}/capacity/${employeeId}`,
        capacityData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      capacity.value = response.data.data;
      error.value = null;
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
      return { success: false, error: err.response?.data?.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    capacity,
    loading,
    error,
    fetchCapacity,
    saveCapacity
  };
}
```

#### Component
```vue
<!-- components/CapacityForm.vue -->
<template>
  <div>
    <div v-if="loading">กำลังโหลด...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    
    <form v-else @submit.prevent="handleSubmit">
      <div>
        <label>ชื่อ-นามสกุล:</label>
        <input v-model="formData.full_name" type="text" />
      </div>

      <div>
        <label>แผนก:</label>
        <input v-model="formData.department" type="text" />
      </div>

      <div>
        <label>หลักสูตรที่ผ่าน:</label>
        <select v-model="selectedCourse">
          <option value="">เลือกหลักสูตร</option>
          <option v-for="course in courseOptions" :key="course" :value="course">
            {{ course }}
          </option>
        </select>
        <button type="button" @click="addCourse">เพิ่ม</button>
        
        <ul>
          <li v-for="(course, index) in formData.trainingCourses" :key="index">
            {{ course }}
            <button type="button" @click="removeCourse(course)">ลบ</button>
          </li>
        </ul>
      </div>

      <button type="submit">บันทึก</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCapacity } from '../composables/useCapacity';

const props = defineProps({
  employeeId: String
});

const { capacity, loading, error, fetchCapacity, saveCapacity } = useCapacity(props.employeeId);

const formData = reactive({
  prefix_name: '',
  full_name: '',
  department: '',
  trainingCourses: []
});

const selectedCourse = ref('');

const courseOptions = [
  "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
  "หลักสูตร FETP",
  "หลักสูตร CDCU ระบาดวิทยา"
];

const addCourse = () => {
  if (selectedCourse.value && !formData.trainingCourses.includes(selectedCourse.value)) {
    formData.trainingCourses.push(selectedCourse.value);
    selectedCourse.value = '';
  }
};

const removeCourse = (courseToRemove) => {
  const index = formData.trainingCourses.indexOf(courseToRemove);
  if (index > -1) {
    formData.trainingCourses.splice(index, 1);
  }
};

const handleSubmit = async () => {
  const result = await saveCapacity(formData);
  if (result.success) {
    alert('บันทึกข้อมูลสำเร็จ');
  } else {
    alert(`เกิดข้อผิดพลาด: ${result.error}`);
  }
};

onMounted(() => {
  fetchCapacity();
});
</script>
```

---

## 💡 Tips & Best Practices

### 1. การจัดการ Array
```javascript
// ✅ ถูกต้อง - ส่งเป็น array
{
  trainingCourses: ["หลักสูตร A", "หลักสูตร B"]
}

// ❌ ผิด - ส่งเป็น string
{
  trainingCourses: "หลักสูตร A, หลักสูตร B"
}
```

### 2. การอัปเดตข้อมูล
```javascript
// เมื่ออัปเดต array จะลบข้อมูลเก่าทั้งหมดและสร้างใหม่
// ดังนั้นต้องส่งข้อมูลครบทุกรายการที่ต้องการเก็บ

// ตัวอย่าง: เพิ่มหลักสูตรใหม่
const currentCourses = capacity.trainingCourses.map(c => c.course_name);
const updatedCourses = [...currentCourses, "หลักสูตรใหม่"];

await saveCapacity({
  trainingCourses: updatedCourses
});
```

### 3. Error Handling
```javascript
try {
  const result = await saveCapacity(formData);
  if (result.success) {
    // Success
  } else {
    // Handle error
    console.error(result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

### 4. Loading State
```javascript
// แสดง loading indicator ขณะรอข้อมูล
if (loading) {
  return <div className="spinner">กำลังโหลด...</div>;
}
```

---

## 🎨 CSS Styling Example

```css
.capacity-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.courses-list {
  list-style: none;
  padding: 0;
}

.courses-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background: #f5f5f5;
  border-radius: 4px;
}

.btn-primary {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

---

## 📚 เอกสารเพิ่มเติม

- [CAPACITY_API_GUIDE.md](./CAPACITY_API_GUIDE.md) - เอกสาร API ฉบับสมบูรณ์
- [CAPACITY_FIELDS_LIST.md](./CAPACITY_FIELDS_LIST.md) - รายการฟิลด์ทั้งหมด
