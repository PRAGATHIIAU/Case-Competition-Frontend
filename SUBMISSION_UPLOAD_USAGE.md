# SubmissionUpload Component - Usage Guide

## Overview
The `SubmissionUpload` component is a robust file upload component with drag-and-drop functionality, file validation, and upload simulation.

## Features
✅ **Drag & Drop**: Native HTML5 drag and drop support  
✅ **File Validation**: Type and size validation (10MB limit)  
✅ **File List**: Display selected files with icons and delete functionality  
✅ **Upload Progress**: Animated progress bar during upload  
✅ **Success/Error Messages**: Clear feedback for users  
✅ **File Type Icons**: Visual indicators for different file types  

## Accepted File Types
- `.zip` - ZIP Archives
- `.pptx` - PowerPoint Presentations
- `.pdf` - PDF Documents
- `.docx` - Word Documents

**Max File Size**: 10MB per file

## Basic Usage

```jsx
import SubmissionUpload from './components/student/SubmissionUpload'

function MyComponent() {
  const handleSubmissionComplete = (files) => {
    console.log('Files submitted:', files)
    // Handle successful submission
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Submission</h2>
      <SubmissionUpload onSubmissionComplete={handleSubmissionComplete} />
    </div>
  )
}
```

## Integration into Student Dashboard

### Option 1: Add to Competitions Tab

Update `StudentDashboard.jsx`:

```jsx
import SubmissionUpload from './student/SubmissionUpload'

// In the competitions tab section:
{activeTab === 'competitions' && (
  <div className="space-y-6">
    <CompetitionCenter 
      competition={competition} 
      onRegister={handleCompetitionRegister}
    />
    
    {/* Add Project Submission Section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Project Submission
      </h2>
      <SubmissionUpload 
        onSubmissionComplete={(files) => {
          console.log('Project files submitted:', files)
          // Add notification or update state
        }}
      />
    </div>
  </div>
)}
```

### Option 2: Create New Tab

Add a new tab in `StudentDashboard.jsx`:

```jsx
const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'competitions', label: 'Competitions', icon: Trophy },
  { id: 'submissions', label: 'Submissions', icon: Upload }, // New tab
  { id: 'mentors', label: 'Mentor Match', icon: Users },
  { id: 'requests', label: 'My Requests', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
]

// Add tab content:
{activeTab === 'submissions' && (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">
      Project Submission
    </h2>
    <SubmissionUpload 
      onSubmissionComplete={(files) => {
        // Handle submission
        const newNotification = {
          id: Date.now(),
          type: 'submission',
          message: `Project submitted successfully with ${files.length} file(s)`,
          timestamp: new Date().toISOString(),
          read: false
        }
        setNotifications([newNotification, ...notifications])
      }}
    />
  </div>
)}
```

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmissionComplete` | `function` | No | Callback fired when upload completes. Receives array of file objects. |

## File Object Structure

Each file in the callback contains:

```javascript
{
  id: number,           // Unique identifier
  file: File,           // Native File object
  name: string,         // File name
  size: number,         // File size in bytes
  type: string,         // MIME type
  uploadedAt: Date     // Upload timestamp
}
```

## Styling

The component uses Tailwind CSS and follows the existing design system:
- Uses `tamu-maroon` color scheme
- Responsive design
- Smooth animations with Framer Motion

## Customization

To modify accepted file types, edit `SubmissionUpload.jsx`:

```javascript
const ACCEPTED_EXTENSIONS = ['.zip', '.pptx', '.pdf', '.docx']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
```

To change upload duration, modify the `handleUpload` function:

```javascript
// Change from 2000ms (2 seconds) to desired duration
setTimeout(() => {
  // ...
}, 2000) // Change this value
```

## Error Handling

The component automatically handles:
- Invalid file types
- Files exceeding size limit
- Duplicate files
- Network errors (simulated)

All errors are displayed in a red error message box below the drop zone.

## Testing

1. **Drag & Drop Test**: Drag files onto the drop zone
2. **Click to Select**: Click the drop zone to open file picker
3. **File Validation**: Try uploading invalid files (e.g., `.txt`, `.jpg`)
4. **Size Limit**: Try uploading files larger than 10MB
5. **Multiple Files**: Select multiple files at once
6. **Delete Files**: Remove files from the list before submitting
7. **Upload Progress**: Watch the progress bar during upload
8. **Success Message**: Verify success message appears after upload

## Example Integration

See `StudentDashboard.jsx` for a complete integration example.

