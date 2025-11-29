/**
 * Test the API endpoint directly
 * Run: node test-api-endpoint.js
 */

const FormData = require('form-data');
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testing API endpoint...\n');
  
  const formData = new FormData();
  formData.append('name', 'API Test Student');
  formData.append('email', 'apitest@tamu.edu');
  formData.append('major', 'Computer Science');
  formData.append('grad_year', '2025');
  formData.append('linkedin_url', 'https://linkedin.com/in/test');
  
  try {
    console.log('📤 Sending request to: http://localhost:5000/api/students/create-or-update');
    console.log('   Method: POST');
    console.log('   Content-Type: multipart/form-data');
    console.log('   Data:', {
      name: 'API Test Student',
      email: 'apitest@tamu.edu',
      major: 'Computer Science',
      grad_year: '2025'
    });
    console.log('');
    
    const response = await fetch('http://localhost:5000/api/students/create-or-update', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ SUCCESS! Student created/updated.');
      console.log('   Student ID:', data.data?.student_id);
      console.log('   Name:', data.data?.name);
      console.log('   Email:', data.data?.email);
    } else {
      console.log('\n❌ FAILED:', data.message);
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Make sure backend is running on port 5000!');
  }
}

testAPI();



