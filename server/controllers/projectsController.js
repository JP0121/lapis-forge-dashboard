const Project = require('../models/Project');
const Article = require('../models/Article');

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

// GET /api/projects/:id/articles — articles matching this project's keywords
const getProjectArticles = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.keywords.length) return res.json({ articles: [] });

    const keywordRegexes = project.keywords.map(
      (kw) => new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    );

    const articles = await Article.find({
      $or: [
        { title: { $in: keywordRegexes } },
        { description: { $in: keywordRegexes } },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(30)
      .lean();

    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project articles' });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, ...rest } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    let slug = slugify(name);
    const existing = await Project.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const project = await Project.create({ name, slug, ...rest });
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project' });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

module.exports = { getProjects, getProject, getProjectArticles, createProject, updateProject, deleteProject };
