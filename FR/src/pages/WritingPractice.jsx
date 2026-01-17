import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import {
    PenTool, Send, ArrowLeft, CheckCircle,
    FileText
} from 'lucide-react';
import './Practice.css';

const WritingPractice = () => {
    const { addSubmission } = useUserData();
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const prompts = [
        {
            id: 1,
            title: 'Personal Introduction Email',
            description: 'Write a formal email introducing yourself to a new French colleague. Include your background, current role, and express enthusiasm for working together.',
            difficulty: 'beginner',
            wordLimit: 150
        },
        {
            id: 2,
            title: 'Restaurant Review',
            description: 'Write a review of your favorite restaurant in French. Describe the ambiance, the food you ordered, and your overall experience.',
            difficulty: 'intermediate',
            wordLimit: 250
        },
        {
            id: 3,
            title: 'Opinion Essay: Technology',
            description: 'Write an essay discussing how technology has changed education in the past decade. Present arguments for and against, and conclude with your own opinion.',
            difficulty: 'advanced',
            wordLimit: 400
        }
    ];

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const handleSubmit = async () => {
        if (!content.trim() || !selectedPrompt) return;

        setIsSubmitting(true);

        // Add submission to user data
        addSubmission({
            type: 'writing',
            title: selectedPrompt.title,
            promptId: selectedPrompt.id,
            difficulty: selectedPrompt.difficulty,
            wordCount: wordCount
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="practice-page">
                <div className="submission-success">
                    <div className="success-content animate-scale-in">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h2>Submission Successful!</h2>
                        <p>Your writing practice has been submitted for review. You'll receive expert feedback within 24 hours.</p>
                        <div className="success-actions">
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setContent('');
                                    setSelectedPrompt(null);
                                }}
                                className="btn btn-secondary"
                            >
                                Practice Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="practice-page">
            <div className="practice-container">
                <div className="practice-header">
                    <Link to="/practice" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Back to Practice</span>
                    </Link>
                    <h1>Writing Practice</h1>
                    <p>Write in French and receive detailed grammar and style feedback</p>
                </div>

                <div className="practice-content writing-content">
                    {/* Prompts Section */}
                    <div className="prompts-section">
                        <h3>Choose a Prompt</h3>
                        <div className="prompts-list">
                            {prompts.map((prompt) => (
                                <div
                                    key={prompt.id}
                                    className={`prompt-card ${selectedPrompt?.id === prompt.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPrompt(prompt)}
                                >
                                    <div className="prompt-header">
                                        <h4>{prompt.title}</h4>
                                        <span className={`difficulty-badge ${prompt.difficulty}`}>
                                            {prompt.difficulty}
                                        </span>
                                    </div>
                                    <p>{prompt.description}</p>
                                    <div className="prompt-meta">
                                        <FileText size={14} />
                                        <span>Word limit: {prompt.wordLimit} words</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Writing Section */}
                    <div className="writing-section">
                        <h3>Write Your Response</h3>

                        {selectedPrompt ? (
                            <div className="selected-prompt-display">
                                <h4>{selectedPrompt.title}</h4>
                                <p>{selectedPrompt.description}</p>
                            </div>
                        ) : (
                            <div className="no-prompt-message">
                                <p>Please select a prompt to get started</p>
                            </div>
                        )}

                        <div className="writing-container">
                            <textarea
                                className="writing-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={selectedPrompt
                                    ? "Start writing your response in French..."
                                    : "Select a prompt first..."
                                }
                                disabled={!selectedPrompt}
                            />

                            <div className="writing-footer">
                                <div className="word-count">
                                    <span className={wordCount > (selectedPrompt?.wordLimit || 0) ? 'over-limit' : ''}>
                                        {wordCount}
                                    </span>
                                    {selectedPrompt && (
                                        <span className="word-limit">/ {selectedPrompt.wordLimit} words</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {content.trim() && (
                            <button
                                className="btn btn-primary btn-lg submit-btn"
                                onClick={handleSubmit}
                                disabled={isSubmitting || wordCount > (selectedPrompt?.wordLimit || Infinity)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit for Review <Send size={20} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingPractice;
