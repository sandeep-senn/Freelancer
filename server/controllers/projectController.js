import { Freelancer, Project } from '../models/Schema.js';
import { parseSkillInput } from '../utils/request.js';

export const fetchProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch project' });
  }
};

export const fetchProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.usertype === 'client') {
      query = { clientId: req.user._id };
    }

    const projects = await Project.find(query);
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, budget, skills } = req.body;
    const parsedBudget = Number(budget);
    const parsedSkills = parseSkillInput(skills);

    if (!title?.trim() || !description?.trim() || !budget || parsedSkills.length === 0) {
      return res.status(400).json({ message: 'Title, description, budget, and skills are required' });
    }

    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      return res.status(400).json({ message: 'Budget must be a positive number' });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      budget: parsedBudget,
      skills: parsedSkills,
      clientId: req.user._id,
      clientName: req.user.username,
      clientEmail: req.user.email,
      postedDate: new Date(),
      status: 'Pending'
    });

    return res.status(201).json({ message: 'Project added', project });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create project' });
  }
};

export const submitProject = async (req, res) => {
  try {
    const { projectId, projectLink, manualLink, submissionDescription } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (String(project.freelancerId) !== req.user._id) {
      return res.status(403).json({ message: 'Only the assigned freelancer can submit this project' });
    }

    project.projectLink = projectLink?.trim() || '';
    project.manualLink = manualLink?.trim() || '';
    project.submissionDescription = submissionDescription?.trim() || '';
    project.submission = true;

    await project.save();
    return res.status(200).json({ message: 'Project submitted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to submit project' });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.usertype !== 'admin' && String(project.clientId) !== req.user._id) {
      return res.status(403).json({ message: 'Only the client owner can approve this submission' });
    }

    const freelancer = await Freelancer.findOne({ userId: project.freelancerId });
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    project.submissionAccepted = true;
    project.status = 'Completed';

    freelancer.currentProjects = freelancer.currentProjects.filter(
      (id) => id.toString() !== project._id.toString()
    );
    freelancer.completedProjects.push(project._id);
    freelancer.funds = (Number(freelancer.funds) || 0) + Number(project.budget);

    await Promise.all([project.save(), freelancer.save()]);
    return res.status(200).json({ message: 'Submission approved' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to approve submission' });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.usertype !== 'admin' && String(project.clientId) !== req.user._id) {
      return res.status(403).json({ message: 'Only the client owner can reject this submission' });
    }

    project.submission = false;
    project.projectLink = '';
    project.manualLink = '';
    project.submissionDescription = '';

    await project.save();
    return res.status(200).json({ message: 'Submission rejected' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to reject submission' });
  }
};
