import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Feedback() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')


  const [answers, setAnswers] = useState({})
  const [wantsContact, setWantsContact] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/questions/active')
        setQuestions(res.data)
      } catch(e) {
        setError('Failed to load form.')
      }
      setLoading(false)
    }
    fetchQuestions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let valid = true
    const payloadAnswers = []

    for (const q of questions) {
      const answer = answers[q.id] || ''
      if (q.is_required && !answer) {
        valid = false
        alert(`Please answer: ${q.question}`)
        break
      }
      payloadAnswers.push({
        question_id: q.id,
        question_text: q.question,
        answer: answer
      })
    }

    if (!valid) return

    const payload = {
      answers: payloadAnswers,
      wants_contact: wantsContact || 'No',
      customer_name: wantsContact === 'Yes, you may contact me' ? customerName : null,
      customer_phone: wantsContact === 'Yes, you may contact me' ? customerPhone : null,
    }

    try {
      await api.post('/feedback', payload)
      setSubmitted(true)
    } catch (e) {
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const handleAnswerChange = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
  }

  if (loading) return <div className="loader p-10 text-center">Loading Form...</div>
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600">Thank you for your feedback!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-page flex flex-col items-center p-4 min-h-screen">
      <div className="brand-header text-center mb-8 mt-4">
        <img 
          src="/logo.jpeg" 
          alt="MALE Logo" 
          className="mx-auto mb-4 object-contain"
          style={{ height: '80px', width: 'auto', maxWidth: '150px' }}
        />
        <p className="text-gray-500 max-w-md">We value your experience! Please take a moment to share your feedback so we can serve you better.</p>
      </div>

      <div className="glass-panel w-full max-w-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          


          <div className="questions-section flex flex-col gap-8">
            <h3 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">Feedback Questions</h3>
            {questions.map((q, index) => (
              <div key={q.id} className="question-block">
                <p className="font-medium mb-4">
                  {index + 1}. {q.question} {q.is_required && <span className="text-red-500">*</span>}
                  {q.question_type === 'Checkbox' && <span className="text-sm text-gray-500 ml-2 font-normal">(Multiple options allowed)</span>}
                </p>
                <QuestionInput 
                  question={q} 
                  value={answers[q.id] || ''} 
                  onChange={(val) => handleAnswerChange(q.id, val)} 
                />
              </div>
            ))}
          </div>

          <div className="contact-section flex flex-col gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200 mt-4">
            <h3 className="text-xl font-semibold mb-2">Would you like us to contact you regarding your feedback?</h3>
            <div className="flex gap-4 mb-4">
              {['Yes, you may contact me', 'No, thank you'].map(opt => (
                <label key={opt} className={`pill-option ${wantsContact === opt ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="wantsContact" 
                    value={opt} 
                    checked={wantsContact === opt}
                    onChange={(e) => setWantsContact(e.target.value)}
                    className="hidden"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {wantsContact === 'Yes, you may contact me' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Your Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    placeholder="Your Mobile Number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full text-lg py-3 mt-4 shadow-lg shadow-primary/30 transform transition hover:scale-[1.02]">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

function QuestionInput({ question: q, value, onChange }) {
  if (q.question_type === 'Star Rating') {
    return (
      <div className="star-rating text-3xl cursor-pointer select-none text-gray-600 transition-colors">
        {[1,2,3,4,5].map(star => (
          <span 
            key={star} 
            onClick={() => onChange(star.toString())}
            className={`star ${parseInt(value) >= star ? 'active-star' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }
  if (q.question_type === 'Multiple Choice') {
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || [])
    const isNumberScale = opts.length === 11 && opts[0] === '0' && opts[10] === '10';
    const getEmoji = (num) => {
      const emojis = ["😡", "😠", "😞", "😟", "😕", "😐", "🙂", "😊", "😀", "😃", "🤩"];
      return emojis[parseInt(num, 10)] || "";
    };

    return (
      <div className="options-container">
        {opts.map(opt => {
          const isSelected = value === opt;
          return (
            <label key={opt} className={`pill-option ${isSelected ? 'selected' : ''} ${isNumberScale ? 'flex-col' : ''}`}>
              <input 
                type="radio" 
                name={`q_${q.id}`} 
                value={opt} 
                checked={isSelected}
                onChange={() => onChange(opt)}
                className="hidden"
              />
              {isNumberScale && <span className="text-2xl mb-1">{getEmoji(opt)}</span>}
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    )
  }
  if (q.question_type === 'Checkbox') {
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || [])
    const selectedOpts = typeof value === 'string' && value ? value.split(', ').filter(Boolean) : [];

    const toggleOpt = (opt) => {
      let newSelection;
      if (selectedOpts.includes(opt)) {
        newSelection = selectedOpts.filter(o => o !== opt);
      } else {
        newSelection = [...selectedOpts, opt];
      }
      onChange(newSelection.join(', '));
    }

    return (
      <div className="options-container">
        {opts.map(opt => {
          const isSelected = selectedOpts.includes(opt);
          return (
            <label key={opt} className={`pill-option ${isSelected ? 'selected' : ''}`}>
              <input 
                type="checkbox" 
                name={`q_${q.id}`} 
                value={opt} 
                checked={isSelected}
                onChange={() => toggleOpt(opt)}
                className="hidden"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    )
  }
  if (q.question_type === 'Yes/No') {
    return (
      <div className="flex gap-4">
        {['Yes', 'No'].map(opt => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5 transition">
            <input 
              type="radio" 
              name={`q_${q.id}`} 
              value={opt} 
              checked={value === opt}
              onChange={() => onChange(opt)}
            /> 
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  if (q.question_type === 'Long Text') {
    return <textarea 
      className="input-field min-h-[100px]" 
      placeholder="Your answer here..."
      value={value}
      onChange={e => onChange(e.target.value)}
    ></textarea>
  }
  
  return <input 
    type="text" 
    className="input-field" 
    placeholder="Your answer here..."
    value={value}
    onChange={e => onChange(e.target.value)}
  />
}
