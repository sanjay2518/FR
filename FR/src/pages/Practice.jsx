import { Link } from 'react-router-dom';
import { Mic, PenTool, ArrowRight, Sparkles } from 'lucide-react';
import './Practice.css';

const Practice = () => {
    return (
        <div className="practice-page">
            {/* Hero Section */}
            <section className="practice-hero">
                <div className="practice-hero-bg"></div>
                <div className="container">
                    <div className="practice-hero-content animate-slide-up">
                        <span className="section-badge">
                            <Sparkles size={16} />
                            Practice
                        </span>
                        <h1>Choose Your <span className="text-gradient">Practice Mode</span></h1>
                        <p>
                            Improve your French through personalized speaking and writing exercises.
                            Get expert feedback on every submission.
                        </p>
                    </div>
                </div>
            </section>

            {/* Practice Options */}
            <section className="practice-options section">
                <div className="container">
                    <div className="practice-options-grid">
                        {/* Speaking Practice */}
                        <Link to="/practice/speaking" className="practice-option-card speaking animate-slide-up">
                            <div className="option-icon">
                                <Mic size={48} />
                            </div>
                            <h2>Speaking Practice</h2>
                            <p>
                                Record yourself speaking French and receive detailed feedback on your
                                pronunciation, fluency, and expression from expert instructors.
                            </p>
                            <ul className="option-features">
                                <li>Record directly in browser</li>
                                <li>Upload audio files</li>
                                <li>Get pronunciation feedback</li>
                                <li>Expert review within 24 hours</li>
                            </ul>
                            <span className="option-cta">
                                Start Speaking <ArrowRight size={20} />
                            </span>
                        </Link>

                        {/* Writing Practice */}
                        <Link to="/practice/writing" className="practice-option-card writing animate-slide-up stagger-2">
                            <div className="option-icon">
                                <PenTool size={48} />
                            </div>
                            <h2>Writing Practice</h2>
                            <p>
                                Write responses to engaging prompts and get comprehensive feedback on
                                grammar, vocabulary, and style from native French speakers.
                            </p>
                            <ul className="option-features">
                                <li>Engaging writing prompts</li>
                                <li>Grammar corrections</li>
                                <li>Vocabulary suggestions</li>
                                <li>Style improvements</li>
                            </ul>
                            <span className="option-cta">
                                Start Writing <ArrowRight size={20} />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Practice;
