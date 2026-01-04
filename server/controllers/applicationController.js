import { Application, Project, Freelancer, User } from "../models/Schema.js";

export const makeBid = async (req, res) => {
  try {
    const {
      clientId,
      freelancerId,
      projectId,
      proposal,
      bidAmount,
      estimatedTime,
    } = req.body;

    if (!clientId || !freelancerId || !projectId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const freelancerUser = await User.findById(freelancerId);
    const client = await User.findById(clientId);
    const project = await Project.findById(projectId);
    const freelancer = await Freelancer.findOne({ userId: freelancerId });

    if (!freelancerUser || !client || !project || !freelancer) {
      return res.status(404).json({ message: "Invalid data provided" });
    }

    const alreadyApplied = await Application.findOne({
      projectId,
      freelancerId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "Already applied to this project" });
    }

    const application = await Application.create({
      projectId,
      clientId,
      clientName: client.username,
      clientEmail: client.email,
      freelancerId,
      freelancerName: freelancerUser.username,
      freelancerEmail: freelancerUser.email,
      freelancerSkills: freelancer.skills,
      title: project.title,
      description: project.description,
      budget: project.budget,
      requiredSkills: project.skills,
      proposal,
      bidAmount,
      estimatedTime,
    });

    project.bids.push(freelancerId);
    project.bidAmounts.push(parseInt(bidAmount));
    freelancer.applications.push(application._id);

    await Promise.all([project.save(), freelancer.save()]);

    res.status(200).json({ message: "Bidding successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const project = await Project.findById(application.projectId);
    const freelancer = await Freelancer.findOne({
      userId: application.freelancerId,
    });
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    if (project.status === "Assigned") {
      return res.status(400).json({ message: "Project already assigned" });
    }

    const user = await User.findById(application.freelancerId);

    application.status = "Accepted";
    await application.save();

    const remainingApplications = await Application.find({
      projectId: application.projectId,
      status: "Pending",
    });

    await Promise.all(
      remainingApplications.map((appli) => {
        appli.status = "Rejected";
        return appli.save();
      })
    );

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.username;
    project.budget = application.bidAmount;
    project.status = "Assigned";

    freelancer.currentProjects.push(project._id);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Application approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    application.status = "Rejected";
    await application.save();
    res.status(200).json({ message: "Application rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
