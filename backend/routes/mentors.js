import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/mentors - Get all mentors
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        m.company,
        m.role,
        m.expertise,
        m.skills,
        m.bio,
        m.availability,
        m.linkedin_url,
        m.years_of_experience
      FROM users u
      JOIN mentors m ON u.id = m.id
      WHERE u.role = 'mentor'
      ORDER BY u.first_name, u.last_name
    `);

    res.json({
      success: true,
      count: result.rows.length,
      mentors: result.rows
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentors'
    });
  }
});

// POST /api/mentors/recommend - Recommend mentors based on skills
router.post('/recommend', async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Skills array is required'
      });
    }

    // Get all available mentors
    const mentorsResult = await query(`
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as name,
        u.email,
        m.company,
        m.role,
        m.expertise,
        m.skills,
        m.bio,
        m.availability,
        m.linkedin_url
      FROM users u
      JOIN mentors m ON u.id = m.id
      WHERE u.role = 'mentor' AND m.availability = 'Available'
    `);

    // Calculate match scores
    const results = mentorsResult.rows.map(mentor => {
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
        id: mentor.id,
        name: mentor.name,
        company: mentor.company,
        role: mentor.role,
        expertise: mentor.expertise,
        skills: mentorSkills,
        bio: mentor.bio,
        matchScore,
        skillOverlap: overlap,
        matchingSkills,
        availability: mentor.availability,
        linkedin_url: mentor.linkedin_url
      };
    }).filter(Boolean); // Remove null entries

    // Sort by match score (descending)
    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.skillOverlap - a.skillOverlap;
    });

    res.json({
      success: true,
      count: results.length,
      mentors: results
    });
  } catch (error) {
    console.error('Error recommending mentors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to recommend mentors'
    });
  }
});

// GET /api/mentors/:id - Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        m.company,
        m.role,
        m.expertise,
        m.skills,
        m.bio,
        m.availability,
        m.linkedin_url,
        m.years_of_experience
      FROM users u
      JOIN mentors m ON u.id = m.id
      WHERE u.id = $1 AND u.role = 'mentor'
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      mentor: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor'
    });
  }
});

export default router;


