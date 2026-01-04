import { Project, Freelancer } from "../models/Schema.js";

export const fetchProject = async (req, res) => {
  try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      skills,
      clientId,
      clientName,
      clientEmail,
    } = req.body;
    const projectSkills = skills.split(",");
    const newProject = new Project({
      title,
      description,
      budget,
      skills: projectSkills,
      clientId,
      clientName,
      clientEmail,
      postedDate: new Date(),
    });
    await newProject.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitProject = async (req, res) => {
  try {
    const { projectId, projectLink, manualLink, submissionDescription } =
      req.body;
    const project = await Project.findById(projectId);
    project.projectLink = projectLink;
    project.manualLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;
    await project.save();
    res.status(200).json({ message: "Project submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const freelancer = await Freelancer.findOne({
      userId: project.freelancerId,
    });

    project.submissionAccepted = true;
    project.status = "Completed";

    freelancer.currentProjects = freelancer.currentProjects.filter(
      (id) => id.toString() !== project._id.toString()
    );
    freelancer.completedProjects.push(project._id);
    freelancer.funds =
      (parseInt(freelancer.funds) || 0) + parseInt(project.budget);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.submission = false;
    project.projectLink = "";
    project.manualLink = "";
    project.submissionDescription = "";
    await project.save();
    res.status(200).json({ message: "Submission rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
