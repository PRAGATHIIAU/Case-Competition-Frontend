const connectionService = require('../services/connection.service');

/**
 * Send connection request
 */
const sendRequest = async (req, res) => {
  try {
    const { mentor_id, student_id, message } = req.body;

    if (!mentor_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'mentor_id and student_id are required',
      });
    }

    const request = await connectionService.sendConnectionRequest(
      student_id,
      mentor_id,
      message
    );

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: request,
    });
  } catch (error) {
    const statusCode = error.message.includes('already') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get user's connection requests
 */
const getMyRequests = async (req, res) => {
  try {
    const { user_id, role } = req.query;

    if (!user_id || !role) {
      return res.status(400).json({
        success: false,
        message: 'user_id and role are required',
      });
    }

    const requests = await connectionService.getUserRequests(user_id, role);

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get mentor's connection requests
 */
const getMentorRequests = async (req, res) => {
  try {
    const { mentor_id, status } = req.query;

    if (!mentor_id) {
      return res.status(400).json({
        success: false,
        message: 'mentor_id is required',
      });
    }

    const requests = await connectionService.getMentorRequests(mentor_id, status);

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update connection request status
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, student_id } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required',
      });
    }

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'student_id is required',
      });
    }

    const request = await connectionService.updateRequestStatus(id, status, student_id);

    res.json({
      success: true,
      message: `Connection request ${status} successfully`,
      data: request,
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  getMentorRequests,
  updateRequestStatus,
};


