// SIMPLE TEST VERSION - Use this to test if React is working
// If this works, the issue is in the full App.jsx

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#500000', fontSize: '36px', marginBottom: '20px' }}>
        ✅ React is Working!
      </h1>
      <p style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>
        If you see this message, React is loading correctly.
      </p>
      <p style={{ fontSize: '14px', color: '#666' }}>
        The blank page issue is likely in the components. Check the browser console (F12) for errors.
      </p>
    </div>
  )
}

export default App

