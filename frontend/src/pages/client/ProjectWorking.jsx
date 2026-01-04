import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import { GeneralContext } from '../../context/GeneralContext'
import {toast} from 'react-toastify'

const ProjectWorking = () => {
  const { id } = useParams()
  const { socket } = useContext(GeneralContext)

  const [project, setProject] = useState(null)
  const [chats, setChats] = useState(null)
  const [message, setMessage] = useState('')

const fetchProject = async (projectId) => {
  try {
    const { data } = await api.get(`/project/${projectId}`)
    setProject(data)
  } catch (err) {
    console.error(err)
  }
}

const fetchChats = async (projectId) => {
  try {
    const { data } = await api.get(`/chat/${projectId}`)
    setChats(data)
  } catch (err) {
    console.error(err)
  }
}

useEffect(() => {
  if (!id) return

  const loadData = async () => {
    await Promise.all([
      fetchProject(id),
      fetchChats(id)
    ])
  }

  loadData()
}, [id])



  // 🔹 SOCKET LISTENER
 useEffect(() => {
  if (!socket) return

  const onMessage = () => fetchChats(id)

  socket.on('message-from-user', onMessage)

  return () => socket.off('message-from-user', onMessage)
}, [socket, id])


  const handleApproveSubmission = async () => {
    try {
      await api.post(`/application/approve/${id}`)
      toast.success('Submission approved')
      fetchProject()
    } catch {
      toast.error('Operation failed')
    }
  }

  const handleRejectSubmission = async () => {
    try {
      await api.post(`/application/reject/${id}`)
      toast.success('Submission rejected')
      fetchProject()
    } catch {
      toast.error('Operation failed')
    }
  }

  const handleMessageSend = () => {
    if (!message.trim()) return

    socket.emit('new-message', {
      projectId: id,
      senderId: localStorage.getItem('userId'),
      message,
      time: new Date()
    })

    setMessage('')
  }

  if (!project) return null

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* PROJECT INFO */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.skills.map(skill => (
            <span
              key={skill}
              className="bg-gray-100 px-3 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 font-medium">
          Budget: ₹{project.budget}
        </p>
      </div>

      {/* SUBMISSION */}
      {project.freelancerId && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Submission</h3>

          {project.submission ? (
            <>
              <p>
                <b>Project:</b>{' '}
                <a
                  href={project.projectLink}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>

              <p className="mt-2">{project.submissionDescription}</p>

              {project.submissionAccepted ? (
                <p className="text-green-600 mt-3 font-semibold">
                  Project Completed
                </p>
              ) : (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleApproveSubmission}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleRejectSubmission}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No submission yet</p>
          )}
        </div>
      )}

      {/* CHAT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Chat</h3>

        {project.freelancerId ? (
          <>
            <div className="h-64 overflow-y-auto space-y-2 mb-3">
              {chats?.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-xs ${
                    msg.senderId === localStorage.getItem('userId')
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
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

export default ProjectWorking
