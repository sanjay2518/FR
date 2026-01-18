import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

const Feedback = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState({ score: '', comments: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submissions?status=pending');
      const data = await response.json();
      setPendingSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedSubmission || !feedback.score || !feedback.comments) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/submissions/${selectedSubmission.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      
      if (response.ok) {
        await fetchPendingSubmissions();
        setSelectedSubmission(null);
        setFeedback({ score: '', comments: '' });
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="page-header">
        <h2>Add Written Feedback</h2>
      </div>

      <div className="feedback-layout">
        <div className="pending-submissions">
          <h3>Pending Submissions</h3>
          <div className="submissions-list">
            {pendingSubmissions.map(submission => (
              <div
                key={submission.id}
                className={`submission-card ${selectedSubmission?.id === submission.id ? 'selected' : ''}`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <h4>{submission.title}</h4>
                <p>{submission.user}</p>
                <span className={`type-badge ${submission.type}`}>
                  {submission.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-form">
          {selectedSubmission ? (
            <>
              <h3>Feedback for: {selectedSubmission.title}</h3>
              <p>Student: {selectedSubmission.user}</p>
              
              <div className="form-group">
                <label>Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={feedback.score}
                  onChange={(e) => setFeedback({...feedback, score: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea
                  rows="8"
                  value={feedback.comments}
                  onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                  placeholder="Provide detailed feedback on pronunciation, grammar, vocabulary, etc."
                />
              </div>

              <button className="btn-primary" onClick={submitFeedback} disabled={loading}>
                <Send size={16} />
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a submission to provide feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;