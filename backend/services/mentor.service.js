const mentorRepository = require('../repositories/mentor.repository');

/**
 * Get all mentors
 */
const getAllMentors = async () => {
  return await mentorRepository.getAllMentors();
};

/**
 * Get mentor by ID
 */
const getMentorById = async (id) => {
  return await mentorRepository.getMentorById(id);
};

/**
 * Recommend mentors based on skills
 */
const recommendMentors = async (skills) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new Error('Skills array is required');
  }

  const mentors = await mentorRepository.getAvailableMentors();

  // Calculate match scores
  const results = mentors.map(mentor => {
    const mentorSkills = mentor.skills || [];
    const studentSkillsSet = new Set(skills.map(s => s.toLowerCase()));
    const mentorSkillsSet = new Set(mentorSkills.map(s => s.toLowerCase()));

    // Find matching skills
    const matchingSkills = [...studentSkillsSet].filter(s => mentorSkillsSet.has(s));
    const overlap = matchingSkills.length;

    if (overlap === 0) {
      return null;
    }

    // Calculate match score
    const maxPossible = Math.max(studentSkillsSet.size, mentorSkillsSet.size);
    const baseScore = (overlap / maxPossible) * 100;
    const bonus = overlap >= 3 ? 10 : overlap >= 2 ? 5 : 0;
    const matchScore = Math.min(100, Math.round(baseScore + bonus));

    return {
      ...mentor,
      matchScore,
      skillOverlap: overlap,
      matchingSkills,
    };
  }).filter(Boolean); // Remove null entries

  // Sort by match score (descending)
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.skillOverlap - a.skillOverlap;
  });

  return results;
};

module.exports = {
  getAllMentors,
  getMentorById,
  recommendMentors,
};


