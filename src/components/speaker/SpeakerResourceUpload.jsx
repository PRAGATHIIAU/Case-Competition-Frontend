import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Presentation,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react'

// File type configuration
const ACCEPTED_TYPES = {
  'application/pdf': { icon: FileText, color: 'text-red-600', label: 'PDF Document' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 
    icon: Presentation, 
    color: 'text-orange-600', 
    label: 'PowerPoint' 
  },
  'application/vnd.ms-powerpoint': {
    icon: Presentation,
    color: 'text-orange-600',
    label: 'PowerPoint'
  }
}

const ACCEPTED_EXTENSIONS = ['.pptx', '.ppt', '.pdf']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB for presentations

export default function SpeakerResourceUpload({ lectureId, onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
    return <FileText className="w-5 h-5 text-gray-600" />
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
      errors.push(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit. Current size: ${formatFileSize(file.size)}`)
    }

    return errors
  }

  // Handle file selection
  const handleFileSelect = (file) => {
    setErrorMessage('')
    const validationErrors = validateFile(file)
    
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors[0])
      return
    }

    setSelectedFile({
      id: Date.now(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    })
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Handle file input change
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage('')

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        })
      }

      // Reset state
      setTimeout(() => {
        setSelectedFile(null)
        setUploadProgress(0)
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 500)

    } catch (error) {
      setErrorMessage('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!selectedFile && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-tamu-maroon bg-tamu-maroon/5'
              : 'border-gray-300 hover:border-tamu-maroon hover:bg-gray-50'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            Drag & drop your slides here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            Accepts .pptx, .ppt, .pdf (Max {formatFileSize(MAX_FILE_SIZE)})
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.ppt,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Selected File */}
      {selectedFile && !isUploading && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedFile)}
              <div>
                <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-tamu-maroon animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Uploading {selectedFile?.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-tamu-maroon h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          className="w-full bg-tamu-maroon text-white px-6 py-3 rounded-lg font-medium hover:bg-tamu-maroon-light transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Slides</span>
        </motion.button>
      )}
    </div>
  )
}

