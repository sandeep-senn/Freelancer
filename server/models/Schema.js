import mongoose from 'mongoose';

// ------------------ USER ------------------
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usertype: { type: String, enum: ['freelancer', 'client', 'admin'], required: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

// ------------------ FREELANCER ------------------
const freelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: { type: [String], default: [] },
    description: { type: String, default: "" },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    currentProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    completedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    funds: { type: Number, default: 0 }
}, { timestamps: true });

export const Freelancer = mongoose.model('Freelancer', freelancerSchema);

// ------------------ PROJECT ------------------
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    skills: { type: [String], default: [] },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],
    bidAmounts: [{ type: Number }],
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
    freelancerName: { type: String },
    status: { type: String, enum: ['Pending', 'Assigned', 'Completed'], default: 'Pending' },
    submission: { type: Boolean, default: false },
    submissionAccepted: { type: Boolean, default: false },
    projectLink: { type: String, default: "" },
    manualLink: { type: String, default: "" },
    submissionDescription: { type: String, default: "" }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);

// ------------------ APPLICATION ------------------
const applicationSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    freelancerName: { type: String, required: true },
    freelancerEmail: { type: String, required: true },
    freelancerSkills: { type: [String], default: [] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    requiredSkills: { type: [String], default: [] },
    proposal: { type: String, default: "" },
    bidAmount: { type: Number, required: true },
    estimatedTime: { type: String, default: "" },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);

// ------------------ CHAT ------------------
const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);
