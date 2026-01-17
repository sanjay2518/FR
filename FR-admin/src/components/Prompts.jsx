import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Prompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ title: '', description: '', type: 'speaking', difficulty: 'beginner' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/prompts');
      const data = await response.json();
      setPrompts(data.prompts || []);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  const addPrompt = async () => {
    if (!newPrompt.title || !newPrompt.description) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/prompts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrompt)
      });
      
      if (response.ok) {
        await fetchPrompts();
        setNewPrompt({ title: '', description: '', type: 'speaking', difficulty: 'beginner' });
      }
    } catch (error) {
      console.error('Failed to add prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/prompts/${id}`, { method: 'DELETE' });
      await fetchPrompts();
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  return (
    <div className="prompts-page">
      <div className="page-header">
        <h2>Upload Prompts / Tasks</h2>
      </div>

      <div className="add-prompt-form">
        <h3>Add New Prompt</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Prompt Title"
            value={newPrompt.title}
            onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
          />
          <select
            value={newPrompt.type}
            onChange={(e) => setNewPrompt({...newPrompt, type: e.target.value})}
          >
            <option value="speaking">Speaking</option>
            <option value="writing">Writing</option>
          </select>
          <select
            value={newPrompt.difficulty}
            onChange={(e) => setNewPrompt({...newPrompt, difficulty: e.target.value})}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <textarea
          placeholder="Prompt Description"
          value={newPrompt.description}
          onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
          rows="3"
        />
        <button className="btn-primary" onClick={addPrompt} disabled={loading}>
          <Plus size={16} />
          {loading ? 'Adding...' : 'Add Prompt'}
        </button>
      </div>

      <div className="prompts-list">
        <h3>Existing Prompts</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map(prompt => (
              <tr key={prompt.id}>
                <td>{prompt.title}</td>
                <td>
                  <span className={`type-badge ${prompt.type}`}>
                    {prompt.type}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-badge ${prompt.difficulty}`}>
                    {prompt.difficulty}
                  </span>
                </td>
                <td>
                  <button className="btn-icon delete" onClick={() => deletePrompt(prompt.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prompts;