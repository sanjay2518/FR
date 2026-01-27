import { useState, useEffect } from 'react';
import { Play, Download, Eye } from 'lucide-react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submissions');
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    filter === 'all' || sub.status === filter
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="submissions-page">
      <div className="page-header">
        <h2>User Submissions</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Submissions</option>
          <option value="pending">Pending Review</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      <div className="submissions-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Type</th>
              <th>Prompt</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => (
              <tr key={submission.id}>
                <td>{submission.userName}</td>
                <td>{submission.userEmail}</td>
                <td>
                  <span className={`type-badge ${submission.type}`}>
                    {submission.type}
                  </span>
                </td>
                <td>{submission.promptTitle}</td>
                <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button className="btn-icon" title="View">
                      <Eye size={16} />
                    </button>
                    {submission.type === 'speaking' && (
                      <button 
                        className="btn-icon" 
                        title="Play Audio"
                        onClick={() => {
                          if (submission.audioFile) {
                            const audio = new Audio(`http://localhost:5000/api/uploads/audio/${submission.audioFile}`);
                            audio.play().catch(e => console.log('Audio play failed:', e));
                          } else {
                            alert('No audio file available');
                          }
                        }}
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button className="btn-icon" title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;