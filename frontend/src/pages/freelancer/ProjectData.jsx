import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import { GeneralContext } from '../../context/GeneralContext'
import { toast } from 'react-toastify'

const ProjectData = () => {
  const { id } = useParams() // projectId
  const { socket } = useContext(GeneralContext)

  const userId = localStorage.getItem('userId')

  const [project, setProject] = useState(null)
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState('')

  // bidding
  const [proposal, setProposal] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  // submission
  const [projectLink, setProjectLink] = useState('')
  const [manualLink, setManualLink] = useState('')
  const [submissionDescription, setSubmissionDescription] = useState('')

  // ---------------- FETCH PROJECT ----------------
  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/project/${id}`)
      setProject(data)
    } catch (err) {
      console.error(err)
    }
  }

  // ---------------- FETCH CHATS (USER BASED) ----------------
  const fetchChats = async () => {
    try {
      const { data } = await api.get(`/chat/${userId}`)
      setChats(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (!id || !userId) return

    const loadData = async () => {
      await Promise.all([fetchProject(), fetchChats()])
    }

    loadData()
  }, [id, userId])

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!socket || !userId) return

    socket.emit('join-chat-room', {
      projectId: id,
      userId
    })

    const onMessage = () => fetchChats()
    socket.on('message-from-user', onMessage)

    return () => {
      socket.off('message-from-user', onMessage)
    }
  }, [socket, id, userId])

  // ---------------- ACTIONS ----------------
  const handleBid = async () => {
    try {
      await api.post('/application/bid', {
        clientId: project.clientId,
        freelancerId: userId,
        projectId: id,
        proposal,
        bidAmount,
        estimatedTime
      })

      toast.success('Bid placed successfully')
      setProposal('')
      setBidAmount('')
      setEstimatedTime('')
      fetchProject()
    } catch (err) {
      console.error(err)
      toast.error('Bidding failed')
    }
  }

  const handleSubmission = async () => {
    try {
      await api.post('/project/submit', {
        projectId: id,
        projectLink,
        manualLink,
        submissionDescription
      })

      toast.success('Submission successful')
      setProjectLink('')
      setManualLink('')
      setSubmissionDescription('')
      fetchProject()
    } catch (err) {
      console.error(err)
      toast.error('Submission failed')
    }
  }

  const handleMessageSend = () => {
    if (!message.trim() || !socket) return

    socket.emit('new-message', {
      projectId: id,
      senderId: userId,
      text: message,
      time: new Date()
    })

    setMessage('')
  }

  if (!project) return null

  const canChat =
    project.freelancerId === userId ||
    project.clientId === userId

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* PROJECT INFO */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.skills?.map(skill => (
            <span key={skill} className="bg-gray-100 px-3 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 font-medium">
          Budget: ₹{project.budget}
        </p>
      </div>

      {/* BID FORM */}
      {project.status === 'Available' && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Send Proposal</h3>

          <input
            type="number"
            placeholder="Bid amount"
            value={bidAmount}
            onChange={e => setBidAmount(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="number"
            placeholder="Estimated time (days)"
            value={estimatedTime}
            onChange={e => setEstimatedTime(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <textarea
            placeholder="Proposal"
            value={proposal}
            onChange={e => setProposal(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          {!project.bids?.includes(userId) ? (
            <button
              onClick={handleBid}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Post Bid
            </button>
          ) : (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
              Already Bidded
            </button>
          )}
        </div>
      )}

      {/* SUBMISSION */}
      {project.freelancerId === userId && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Submit Project</h3>

          {project.submissionAccepted ? (
            <p className="text-green-600 font-semibold">
              Project Completed
            </p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Project link"
                value={projectLink}
                onChange={e => setProjectLink(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />

              <input
                type="text"
                placeholder="Manual link"
                value={manualLink}
                onChange={e => setManualLink(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />

              <textarea
                placeholder="Work description"
                value={submissionDescription}
                onChange={e => setSubmissionDescription(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              {!project.submission ? (
                <button
                  onClick={handleSubmission}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit Project
                </button>
              ) : (
                <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
                  Already Submitted
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* CHAT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Chat</h3>

        {canChat ? (
          <>
            <div className="h-64 overflow-y-auto space-y-2 mb-3">
              {chats?.[0]?.messages?.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded max-w-xs ${
                    msg.senderId === userId
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  }`}
                >
                  {msg.text || msg.message}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Type message..."
              />
              <button
                onClick={handleMessageSend}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Chat enabled after project assignment
          </p>
        )}
      </div>
    </div>
  )
}

export default ProjectData
