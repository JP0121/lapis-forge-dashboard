const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProjects, getProject, getProjectArticles,
  createProject, updateProject, deleteProject,
} = require('../controllers/projectsController');

const router = express.Router();
router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProject);
router.get('/:id/articles', getProjectArticles);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
