import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  X, 
  FileText, 
  File, 
  FileArchive, 
  Presentation, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react'

// File type configuration
const ACCEPTED_TYPES = {
  'application/zip': { icon: FileArchive, color: 'text-purple-600', label: 'ZIP Archive' },
  'application/x-zip-compressed': { icon: FileArchive, color: 'text-purple-600', label: 'ZIP Archive' },
  'application/pdf': { icon: FileText, color: 'text-red-600', label: 'PDF Document' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 
    icon: Presentation, 
    color: 'text-orange-600', 
    label: 'PowerPoint' 
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    icon: FileText, 
    color: 'text-blue-600', 
    label: 'Word Document' 
  }
}

const ACCEPTED_EXTENSIONS = ['.zip', '.pptx', '.pdf', '.docx']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export default function SubmissionUpload({ onSubmissionComplete }) {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (file) => {
    const typeConfig = ACCEPTED_TYPES[file.type]
    if (typeConfig) {
      const IconComponent = typeConfig.icon
      return <IconComponent className={`w-5 h-5 ${typeConfig.color}`} />
    }
    return <File className="w-5 h-5 text-gray-600" />
  }

  // Validate file
  const validateFile = (file) => {
    const errors = []

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(fileExtension)) {
      errors.push(`File type not allowed. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`)
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size exceeds 10MB limit. Current size: ${formatFileSize(file.size)}`)
    }

    return errors
  }

  // Handle file selection
  const handleFiles = (fileList) => {
    const newFiles = []
    const errors = []

    Array.from(fileList).forEach((file) => {
      const validationErrors = validateFile(file)
      
      if (validationErrors.length === 0) {
        // Check for duplicates
        const isDuplicate = files.some(f => f.name === file.name && f.size === file.size)
        if (!isDuplicate) {
          newFiles.push({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
          })
        } else {
          errors.push(`${file.name} is already in the list`)
        }
      } else {
        errors.push(...validationErrors.map(err => `${file.name}: ${err}`))
      }
    })

    if (errors.length > 0) {
      setErrorMessage(errors.join(' | '))
      setUploadStatus('error')
      setTimeout(() => {
        setErrorMessage('')
        setUploadStatus(null)
      }, 5000)
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles)
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle click on drop zone
  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  // Remove file from list
  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Simulate upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select at least one file to upload')
      setUploadStatus('error')
      setTimeout(() => {
        setErrorMessage('')
        setUploadStatus(null)
      }, 3000)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus(null)
    setErrorMessage('')

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 40) // Update every 40ms for ~2 seconds total

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Simulate success
      setTimeout(() => {
        setIsUploading(false)
        setUploadStatus('success')
        
        // Callback to parent component
        if (onSubmissionComplete) {
          onSubmissionComplete(files)
        }

        // Clear files after success (optional)
        // setFiles([])
      }, 300)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-tamu-maroon bg-tamu-maroon/5 scale-[1.02]'
            : 'border-gray-300 hover:border-tamu-maroon hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".zip,.pptx,.pdf,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-tamu-maroon' : 'text-gray-400'}`} />
        </motion.div>
        
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag & drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500">
          Accepts .zip, .pptx, .pdf, .docx (Max 10MB per file)
        </p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Upload Error</p>
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                setErrorMessage('')
                setUploadStatus(null)
              }}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {files.map((fileItem) => (
                <motion.div
                  key={fileItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(fileItem)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {fileItem.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileItem.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(fileItem.id)
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-tamu-maroon animate-spin" />
            <p className="text-sm font-medium text-gray-700">Uploading files...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-tamu-maroon h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{uploadProgress}%</p>
        </motion.div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {uploadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Submission Successful!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Your {files.length} file{files.length !== 1 ? 's' : ''} have been uploaded successfully.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {files.length > 0 && !isUploading && uploadStatus !== 'success' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          className="w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          <span>Submit {files.length} File{files.length !== 1 ? 's' : ''}</span>
        </motion.button>
      )}

      {/* Reset Button (after success) */}
      {uploadStatus === 'success' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setFiles([])
            setUploadStatus(null)
            setUploadProgress(0)
          }}
          className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Upload New Files
        </motion.button>
      )}
    </div>
  )
}

