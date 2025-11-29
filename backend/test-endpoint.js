/**
 * Test script to verify create-or-update endpoint works
 * Run: node test-endpoint.js
 */

const FormData = require('form-data');
const fetch = require('node-fetch');

async function testEndpoint() {
  console.log('🧪 Testing /api/students/create-or-update endpoint...\n');
  
  const formData = new FormData();
  formData.append('name', 'Test Student');
  formData.append('email', 'test@tamu.edu');
  formData.append('major', 'Computer Science');
  formData.append('grad_year', '2025');
  
  try {
    const response = await fetch('http://localhost:5000/api/students/create-or-update', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ SUCCESS! Student created/updated.');
      console.log('   Student ID:', data.data?.student_id);
      console.log('   Name:', data.data?.name);
      console.log('   Email:', data.data?.email);
    } else {
      console.log('\n❌ FAILED:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEndpoint();



