import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import {
    Mic, MicOff, Play, Pause, Upload,
    Send, ArrowLeft, Clock, CheckCircle,
    Volume2, Trash2
} from 'lucide-react';
import './Practice.css';

const SpeakingPractice = () => {
    const { addSubmission } = useUserData();
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    const prompts = [
        {
            id: 1,
            title: 'Introduce Yourself',
            description: 'Record a 1-2 minute introduction about yourself in French. Include your name, where you\'re from, your hobbies, and why you\'re learning French.',
            difficulty: 'beginner',
            timeLimit: 120
        },
        {
            id: 2,
            title: 'Describe Your Day',
            description: 'Describe what a typical day looks like for you. Talk about your morning routine, work or studies, and evening activities.',
            difficulty: 'intermediate',
            timeLimit: 180
        },
        {
            id: 3,
            title: 'Opinion on Climate Change',
            description: 'Share your thoughts on climate change and what actions individuals can take to help. Use complex sentences and expressions.',
            difficulty: 'advanced',
            timeLimit: 240
        }
    ];

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setRecordedBlob(audioBlob);
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please ensure you have granted permission.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const playRecording = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const deleteRecording = () => {
        setRecordedBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setUploadedFile(null);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            try {
                const formData = new FormData();
                formData.append('audio', file);
                
                const response = await fetch('http://localhost:5000/api/uploads/upload-audio', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    setUploadedFile({ ...file, fileId: result.file_id });
                    const url = URL.createObjectURL(file);
                    setAudioUrl(url);
                    setRecordedBlob(file);
                    
                    const audio = new Audio(url);
                    audio.onloadedmetadata = () => {
                        setRecordingTime(Math.floor(audio.duration));
                    };
                } else {
                    const error = await response.json();
                    alert(`Upload failed: ${error.error}`);
                }
            } catch (error) {
                alert('Upload failed. Please try again.');
            }
        } else {
            alert('Please select a valid audio file');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        if (!recordedBlob || !selectedPrompt) return;

        setIsSubmitting(true);

        // Add submission to user data
        addSubmission({
            type: 'speaking',
            title: selectedPrompt.title,
            promptId: selectedPrompt.id,
            difficulty: selectedPrompt.difficulty,
            duration: recordingTime
        });

        // Simulate API call
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
                        <p>Your speaking practice has been submitted for review. You'll receive expert feedback within 24 hours.</p>
                        <div className="success-actions">
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setRecordedBlob(null);
                                    setAudioUrl(null);
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
                    <h1>Speaking Practice</h1>
                    <p>Record yourself speaking French and receive expert feedback</p>
                </div>

                <div className="practice-content">
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
                                        <Clock size={14} />
                                        <span>Time limit: {formatTime(prompt.timeLimit)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recording Section */}
                    <div className="recording-section">
                        <h3>Record Your Response</h3>

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

                        <div className="recorder-container">
                            {/* Waveform Visualization */}
                            <div className={`waveform-display ${isRecording ? 'active' : ''}`}>
                                {[...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="wave-bar"
                                        style={{
                                            height: isRecording ? `${Math.random() * 80 + 20}%` : '20%',
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    ></div>
                                ))}
                            </div>

                            {/* Timer */}
                            <div className="recording-timer">
                                <span className={`timer ${isRecording ? 'recording' : ''}`}>
                                    {formatTime(recordingTime)}
                                </span>
                                {selectedPrompt && (
                                    <span className="time-limit">
                                        / {formatTime(selectedPrompt.timeLimit)}
                                    </span>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="recorder-controls">
                                {!recordedBlob ? (
                                    <div className="recording-options">
                                        <button
                                            className={`record-btn ${isRecording ? 'recording' : ''}`}
                                            onClick={isRecording ? stopRecording : startRecording}
                                            disabled={!selectedPrompt}
                                        >
                                            {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                                        </button>
                                        <span className="or-divider">OR</span>
                                        <button
                                            className="upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={!selectedPrompt}
                                        >
                                            <Upload size={24} />
                                            Upload Audio
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="playback-controls">
                                        <button className="control-btn" onClick={playRecording}>
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                        </button>
                                        <button className="control-btn delete" onClick={deleteRecording}>
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {audioUrl && (
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onEnded={() => setIsPlaying(false)}
                                />
                            )}

                            {/* Recording Instructions */}
                            <div className="recording-instructions">
                                {!isRecording && !recordedBlob && (
                                    <p>Click the microphone to record or upload an audio file</p>
                                )}
                                {isRecording && (
                                    <p className="recording-active">Recording in progress... Click to stop</p>
                                )}
                                {recordedBlob && (
                                    <p>{uploadedFile ? 'Audio file uploaded!' : 'Recording complete!'} Review and submit your practice.</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        {recordedBlob && (
                            <button
                                className="btn btn-primary btn-lg submit-btn"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
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

export default SpeakingPractice;
