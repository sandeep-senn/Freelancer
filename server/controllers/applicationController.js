import { Application, Project, Freelancer, User } from '../models/Schema.js';

export const makeBid = async (req, res) => {
  try {
    const { projectId, proposal, bidAmount, estimatedTime } = req.body;

    if (!projectId || !bidAmount) {
      return res.status(400).json({ message: 'Project and bid amount are required' });
    }

    const freelancerId = req.user._id;
    const freelancerUser = await User.findById(freelancerId);
    const project = await Project.findById(projectId);
    const freelancer = await Freelancer.findOne({ userId: freelancerId });
    const client = project ? await User.findById(project.clientId) : null;

    if (!freelancerUser || !client || !project || !freelancer) {
      return res.status(404).json({ message: 'Invalid data provided' });
    }

    if (project.status !== 'Pending') {
      return res.status(400).json({ message: 'Bids are only allowed on open projects' });
    }

    const alreadyApplied = await Application.findOne({ projectId, freelancerId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }

    const application = await Application.create({
      projectId,
      clientId: project.clientId,
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
      proposal: proposal?.trim() || '',
      bidAmount: Number(bidAmount),
      estimatedTime: estimatedTime?.toString() || ''
    });

    project.bids.push(freelancerId);
    project.bidAmounts.push(Number(bidAmount));
    freelancer.applications.push(application._id);

    await Promise.all([project.save(), freelancer.save()]);
    return res.status(200).json({ message: 'Bidding successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to place bid' });
  }
};

export const fetchApplications = async (req, res) => {
  try {
    let query = {};

    if (req.user.usertype === 'client') {
      query = { clientId: req.user._id };
    } else if (req.user.usertype === 'freelancer') {
      query = { freelancerId: req.user._id };
    }

    const applications = await Application.find(query);
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch applications' });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const project = await Project.findById(application.projectId);
    const freelancer = await Freelancer.findOne({ userId: application.freelancerId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    if (req.user.usertype !== 'admin' && String(project.clientId) !== req.user._id) {
      return res.status(403).json({ message: 'Only the client owner can approve an application' });
    }

    if (project.status === 'Assigned') {
      return res.status(400).json({ message: 'Project already assigned' });
    }

    const user = await User.findById(application.freelancerId);

    application.status = 'Accepted';
    await application.save();

    const remainingApplications = await Application.find({
      projectId: application.projectId,
      status: 'Pending'
    });

    await Promise.all(
      remainingApplications.map((pendingApplication) => {
        pendingApplication.status = 'Rejected';
        return pendingApplication.save();
      })
    );

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.username;
    project.budget = application.bidAmount;
    project.status = 'Assigned';

    freelancer.currentProjects.push(project._id);

    await Promise.all([project.save(), freelancer.save()]);
    return res.status(200).json({ message: 'Application approved' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to approve application' });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.usertype !== 'admin' && String(application.clientId) !== req.user._id) {
      return res.status(403).json({ message: 'Only the client owner can reject an application' });
    }

    application.status = 'Rejected';
    await application.save();
    return res.status(200).json({ message: 'Application rejected' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to reject application' });
  }
};
