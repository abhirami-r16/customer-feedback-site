import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('submissions')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout')
    } catch(e) {}
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  const handleShare = () => {
    const link = 'https://malefashion.in/Male/feedbackform'
    const msg = encodeURIComponent(`Thank you for shopping with MALE.\n\nWe’d love to know how your experience was. Your feedback helps us serve you better.\n\nIt takes less than 1 minute.\n\n👉 Share your feedback:\n${link}\n\nThank you for choosing MALE. ❤️`)
    const modal = document.createElement('div')
    modal.className = 'modal glass-panel'
    modal.innerHTML = `
      <div class="modal-content text-white">
        <h3 class="text-xl mb-4">Share Link</h3>
        <input type="text" value="${link}" readonly class="input-field mb-4 w-full" id="share-link-input">
        <div class="flex gap-2">
          <button class="btn btn-primary" id="btn-copy">Copy Link</button>
          <a href="https://wa.me/?text=${msg}" target="_blank" class="btn bg-green-500 text-white">Share on WhatsApp</a>
          <button class="btn btn-outline" style="color: #e5e7eb; border-color: #4b5563;" id="btn-close-modal">Close</button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    document.getElementById('btn-close-modal')?.addEventListener('click', () => modal.remove())
    document.getElementById('btn-copy')?.addEventListener('click', () => {
      navigator.clipboard.writeText(link)
      alert('Link copied!')
    })
  }

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.jpeg" alt="MALE Logo" className="sidebar-logo" />
          <h2 className="sidebar-brand">MALE Admin</h2>
        </div>
        <ul className="nav-links">
          <li>
            <button 
              className={`nav-btn ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </li>
          <li>
            <button 
              className={`nav-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions
            </button>
          </li>
        </ul>
        <div className="sidebar-footer desktop-footer">
          <button onClick={handleShare} className="btn btn-outline w-full mb-4">Share Feedback Link</button>
          <button onClick={handleLogout} className="btn btn-danger w-full">Logout</button>
        </div>
      </nav>
      <main className="dashboard-content">
        {activeTab === 'submissions' && <SubmissionsTab />}
        {activeTab === 'questions' && <QuestionsTab />}
        
        <div className="mobile-footer">
          <button onClick={handleShare} className="btn btn-outline flex-1">Share Feedback Link</button>
          <button onClick={handleLogout} className="btn btn-danger flex-1">Logout</button>
        </div>
      </main>
    </div>
  )
}

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/submissions')
      setSubmissions(res.data)
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const viewSubmission = async (id) => {
    try {
      await api.put(`/admin/submissions/${id}/read`)
      const res = await api.get(`/admin/submissions/${id}`)
      setViewing(res.data)
    } catch(e) {
      alert('Failed to view submission')
    }
  }

  const deleteSubmission = async (id) => {
    if(confirm('Are you sure you want to delete this submission?')) {
      try {
        await api.delete(`/admin/submissions/${id}`)
        fetchSubmissions()
      } catch(e) {
        alert('Failed to delete submission')
      }
    }
  }

  if (loading) return <div className="loader">Loading...</div>

  if (viewing) {
    return (
      <div>
        <div className="mb-4">
          <button className="btn btn-outline" onClick={() => { setViewing(null); fetchSubmissions(); }}>← Back to Dashboard</button>
        </div>
        <div className="glass-panel p-8 max-w-3xl bg-white rounded-xl shadow border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Customer Feedback</h2>
          <div className="text-sm text-gray-400 mb-6">Submitted: {new Date(viewing.submitted_at).toLocaleString()}</div>
          <div className="flex flex-col gap-6 mt-4">
            {viewing.answers.map((a, i) => (
              <div key={i} className="answer-block">
                <p className="font-semibold text-gray-900 text-lg">{a.question_text}</p>
                <div className="mt-2 text-gray-700 text-lg">
                  {a.answer || <em className="text-gray-400">No answer</em>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-xl mb-4 text-gray-900">Contact Information</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-lg space-y-2">
              <p><strong className="text-gray-600">Contact Requested:</strong> {viewing.wants_contact === 'Yes, you may contact me' ? 'Yes' : 'No'}</p>
              {viewing.wants_contact === 'Yes, you may contact me' && (
                <>
                  <p><strong className="text-gray-600">Customer Name:</strong> {viewing.customer_name}</p>
                  <p><strong className="text-gray-600">Mobile Number:</strong> {viewing.customer_phone}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalSubmissions = submissions.length;
  const filteredSubmissions = submissions;

  return (
    <div>
      <div className="dashboard-header mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Feedback Dashboard</h2>
          <p className="text-gray-500 mt-2">Manage and review customer feedback</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <span className="stat-label">Total Submissions</span>
          <span className="stat-value text-blue-600">{totalSubmissions}</span>
        </div>

      </div>


      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Rating</th>
              <th>Submitted</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((s, index) => (
              <tr key={s.id} className={s.is_read ? '' : 'font-bold bg-blue-50'}>
                <td className="text-gray-500 font-medium">{index + 1}</td>
                <td>
                  {s.overall_rating ? (
                    <span className="text-yellow-400 text-lg">
                      {'★'.repeat(s.overall_rating)}{'☆'.repeat(5 - s.overall_rating)}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td>{new Date(s.submitted_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '0.8rem', backgroundColor: s.wants_contact === 'Yes, you may contact me' ? '#dcfce7' : '#f3f4f6', color: s.wants_contact === 'Yes, you may contact me' ? '#166534' : '#4b5563' }}>
                    {s.wants_contact === 'Yes, you may contact me' ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '0.8rem', backgroundColor: s.is_read ? '#f3f4f6' : '#dbeafe', color: s.is_read ? '#4b5563' : '#1d4ed8' }}>
                    {s.is_read ? 'Read' : 'New'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => viewSubmission(s.id)}>View</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteSubmission(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">No feedback matches your filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QuestionsTab() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/questions')
      setQuestions(res.data)
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const deleteQuestion = async (id) => {
    if(confirm('Are you sure?')) {
      await api.delete(`/admin/questions/${id}`)
      fetchQuestions()
    }
  }

  if (loading) return <div className="loader">Loading...</div>

  if (editingQuestion) {
    return <QuestionForm 
      initialData={editingQuestion === true ? null : editingQuestion} 
      onBack={() => setEditingQuestion(null)} 
      onSaved={() => { setEditingQuestion(null); fetchQuestions(); }} 
    />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feedback Questions</h2>
        <button className="btn btn-primary" onClick={() => setEditingQuestion(true)}>+ Add Question</button>
      </div>
      <div className="questions-list flex flex-col gap-4 max-w-3xl">
        {questions.map((q, index) => {
          let opts = [];
          if (q.options) {
            try {
              opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            } catch(e) {}
          }
          const isNumberScale = opts.length === 11 && opts[0] === '0' && opts[10] === '10';
          const getEmoji = (num) => {
            const emojis = ["😡", "😠", "😞", "😟", "😕", "😐", "🙂", "😊", "😀", "😃", "🤩"];
            return emojis[parseInt(num, 10)] || "";
          };

          return (
            <div key={q.id} className="glass-panel p-6">
              <div className="question-header-layout">
                <div className="question-info">
                  <p className="font-bold text-lg">{index + 1}. {q.question}</p>
                  <p className="text-sm text-gray-400 mt-1">Type: {q.question_type} | Status: {q.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              
              {opts && opts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-500 mb-2">Options:</p>
                  {isNumberScale ? (
                    <div className="flex gap-2 flex-wrap">
                      {opts.map(opt => (
                        <div key={opt} className="flex flex-col items-center bg-gray-50 p-2 rounded w-12">
                          <span className="text-xl">{getEmoji(opt)}</span>
                          <span className="text-sm font-bold text-gray-600">{opt}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="options-container">
                      {opts.map(opt => (
                        <span key={opt} className="pill-display">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="question-actions mt-4 pt-4 border-t border-gray-100" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn-sm btn-outline" onClick={() => setEditingQuestion(q)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteQuestion(q.id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
function QuestionForm({ initialData, onBack, onSaved }) {
  const [q_text, setQText] = useState(initialData?.question || '')
  const [q_type, setQType] = useState(initialData?.question_type || 'Star Rating')
  
  // Format existing options array to a comma separated string
  let initialOptions = '';
  if (initialData?.options) {
      try {
          const optsArray = typeof initialData.options === 'string' ? JSON.parse(initialData.options) : initialData.options;
          initialOptions = optsArray.join(', ');
      } catch(e) {}
  }
  const [q_options, setQOptions] = useState(initialOptions)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      question: q_text,
      question_type: q_type,
      options: (q_type === 'Multiple Choice' || q_type === 'Checkbox') ? q_options.split(',').map(s => s.trim()) : null,
      is_required: initialData ? initialData.is_required : true,
      is_active: initialData ? initialData.is_active : true,
      sort_order: initialData ? initialData.sort_order : 10
    }

    try {
      if (initialData) {
        await api.put(`/admin/questions/${initialData.id}`, payload)
      } else {
        await api.post('/admin/questions', payload)
      }
      onSaved()
    } catch(e) {
      alert('Failed to save question: ' + (e.response?.data?.message || e.message))
    }
  }

  return (
    <div>
      <div className="mb-4">
        <button className="btn btn-outline" onClick={onBack}>← Back to Questions</button>
      </div>
      <div className="glass-panel p-6 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Question' : 'Add Question'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label>Question Text</label>
            <input type="text" className="input-field" required value={q_text} onChange={e=>setQText(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Question Type</label>
            <select className="input-field" value={q_type} onChange={e=>setQType(e.target.value)}>
              <option value="Star Rating">Star Rating</option>
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Checkbox">Checkbox</option>
              <option value="Yes/No">Yes/No</option>
              <option value="Text">Text</option>
              <option value="Long Text">Long Text</option>
            </select>
          </div>
          {(q_type === 'Multiple Choice' || q_type === 'Checkbox') && (
            <div className="form-group">
              <label>Options (comma separated)</label>
              <input type="text" className="input-field" placeholder="Option 1, Option 2" value={q_options} onChange={e=>setQOptions(e.target.value)} />
            </div>
          )}
          <button type="submit" className="btn btn-primary mt-4">Save Question</button>
        </form>
      </div>
    </div>
  )
}
