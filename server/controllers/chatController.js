import { Chat } from '../models/Schema.js';

export const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.params.id }); // recommended query
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
