const connectionRepository = require('../repositories/connection.repository');
const notificationRepository = require('../repositories/notification.repository');

/**
 * Send connection request
 */
const sendConnectionRequest = async (studentId, mentorId, message) => {
  // Check if request already exists
  const existingRequests = await connectionRepository.getRequestsByStudent(studentId);
  const existing = existingRequests.find(r => r.mentor_id === mentorId && r.status === 'pending');
  
  if (existing) {
    throw new Error('Connection request already pending');
  }

  // Create request
  const request = await connectionRepository.createConnectionRequest(
    studentId,
    mentorId,
    message || 'I would love to connect and learn from your experience.'
  );

  // Create notification for mentor
  await notificationRepository.createNotification(
    mentorId,
    'connection_request',
    'New Connection Request',
    'You have received a new connection request from a student'
  );

  return request;
};

/**
 * Get user's connection requests
 */
const getUserRequests = async (userId, role) => {
  if (role === 'student') {
    return await connectionRepository.getRequestsByStudent(userId);
  } else if (role === 'mentor') {
    return await connectionRepository.getRequestsByMentor(userId);
  }
  throw new Error('Invalid role');
};

/**
 * Get mentor's connection requests
 */
const getMentorRequests = async (mentorId, status = null) => {
  return await connectionRepository.getRequestsByMentor(mentorId, status);
};

/**
 * Update connection request status
 */
const updateRequestStatus = async (requestId, status, studentId) => {
  if (!['accepted', 'declined', 'cancelled'].includes(status)) {
    throw new Error('Invalid status');
  }

  const request = await connectionRepository.updateRequestStatus(requestId, status);

  if (!request) {
    throw new Error('Connection request not found');
  }

  // Create notification for student
  await notificationRepository.createNotification(
    studentId,
    'connection_response',
    `Connection Request ${status}`,
    `Your connection request has been ${status}`
  );

  return request;
};

module.exports = {
  sendConnectionRequest,
  getUserRequests,
  getMentorRequests,
  updateRequestStatus,
};


