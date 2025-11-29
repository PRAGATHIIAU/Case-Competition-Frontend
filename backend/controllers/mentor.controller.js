const mentorService = require('../services/mentor.service');

/**
 * Get all mentors
 */
const getAllMentors = async (req, res) => {
  try {
    const mentors = await mentorService.getAllMentors();
    res.json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message,
    });
  }
};

/**
 * Get mentor by ID
 */
const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await mentorService.getMentorById(id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    res.json({
      success: true,
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor',
      error: error.message,
    });
  }
};

/**
 * Recommend mentors based on skills
 */
const recommendMentors = async (req, res) => {
  try {
    const { skills } = req.body;
    const mentors = await mentorService.recommendMentors(skills);
    
    res.json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllMentors,
  getMentorById,
  recommendMentors,
};


