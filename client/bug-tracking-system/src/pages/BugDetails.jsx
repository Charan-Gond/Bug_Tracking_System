import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    Bug, Calendar, User, MessageSquare, Trash2, Paperclip, ExternalLink, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

const BugDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bug, setBug] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [attachmentError, setAttachmentError] = useState('');
    const [attachmentSubmitting, setAttachmentSubmitting] = useState(false);
    const [filePathInput, setFilePathInput] = useState('');

    const { register, handleSubmit, reset } = useForm();

    const fetchData = async () => {
        try {
            const [bugRes, commentsRes, attachmentsRes] = await Promise.all([
                api.get(`/bug/${id}`),
                api.get(`/comment/${id}`),
                api.get(`/attachment/bug/${id}`)
            ]);
            setBug(bugRes.data);
            setComments(commentsRes.data);
            setAttachments(attachmentsRes.data);
        } catch (error) {
            console.error('Failed to fetch bug details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // ── Comments ──────────────────────────────────────────────────────────────
    const handleCommentSubmit = async (data) => {
        setCommentError('');
        setCommentSubmitting(true);
        try {
            // Backend Comments model uses field `comment` (not `message`)
            // userId is set by the backend from the JWT principal
            await api.post('/comment', {
                comment: data.comment,
                bugId: parseInt(id),
            });
            reset();
            fetchData();
        } catch (error) {
            console.error('Failed to post comment', error);
            setCommentError(error.response?.data?.message || 'Failed to post comment. Please try again.');
        } finally {
            setCommentSubmitting(false);
        }
    };

    // ── Status ────────────────────────────────────────────────────────────────
    const handleStatusChange = async (newStatus) => {
        setStatusUpdating(true);
        try {
            // BugRequest expects `newStatus` (not `status`)
            await api.put(`/bug/${id}`, { newStatus });
            setBug(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setStatusUpdating(false);
        }
    };

    // ── Delete bug ────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this bug?')) return;
        try {
            await api.delete(`/bug/${id}`);
            navigate('/bugs');
        } catch (error) {
            alert('Failed to delete bug. You might not have permission.');
        }
    };

    // ── Attachments ───────────────────────────────────────────────────────────
    const handleAttachmentSubmit = async (e) => {
        e.preventDefault();
        if (!filePathInput.trim()) return;
        setAttachmentError('');
        setAttachmentSubmitting(true);
        try {
            // AttachmentService stores filePath as a string; bugId links it to this bug
            await api.post('/attachment', {
                bugId: parseInt(id),
                filePath: filePathInput.trim(),
            });
            setFilePathInput('');
            fetchData();
        } catch (error) {
            console.error('Failed to add attachment', error);
            setAttachmentError(error.response?.data?.message || 'Failed to add attachment. Please try again.');
        } finally {
            setAttachmentSubmitting(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (!window.confirm('Delete this attachment?')) return;
        try {
            await api.delete(`/attachment/${attachmentId}`);
            setAttachments(prev => prev.filter(a => a.id !== attachmentId));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete attachment.');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
            Loading…
        </div>
    );
    if (!bug) return <div className="text-center py-20 text-gray-400">Bug not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* ── Bug Header ── */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-sm font-bold ${bug.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                                        bug.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {bug.priority}
                                </span>
                                <h1 className="text-2xl font-bold text-white">{bug.title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Status Dropdown */}
                            <select
                                value={bug.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={statusUpdating}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="CLOSED">Closed</option>
                            </select>

                            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Bug"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{bug.description}</p>

                    <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>Assigned to User #{bug.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* ── Comments Section ── */}
                <div className="bg-gray-900/50 p-8 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <MessageSquare size={20} />
                        Comments ({comments.length})
                    </h3>

                    <div className="space-y-6 mb-8">
                        {comments.length > 0 ? (
                            comments.map((c) => (
                                <div key={c.id} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        #{c.userId}
                                    </div>
                                    <div className="bg-gray-800 rounded-lg rounded-tl-none p-4 border border-gray-700 flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-blue-400 text-sm font-medium">User #{c.userId}</span>
                                            <span className="text-gray-600 text-xs">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {/* Backend field is `comment`, not `message` */}
                                        <p className="text-gray-300 text-sm">{c.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No comments yet.</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={handleSubmit(handleCommentSubmit)} className="space-y-2">
                        <div className="flex gap-4">
                            <input
                                {...register('comment', { required: true })}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Add a comment…"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={commentSubmitting}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                {commentSubmitting ? 'Posting…' : 'Post'}
                            </button>
                        </div>
                        {commentError && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm">
                                <AlertCircle size={14} className="flex-shrink-0" />
                                {commentError}
                            </div>
                        )}
                    </form>
                </div>

                {/* ── Attachments Section ── */}
                <div className="bg-gray-900/30 p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Paperclip size={20} />
                        Attachments ({attachments.length})
                    </h3>

                    {/* Attachment List */}
                    {attachments.length > 0 ? (
                        <div className="space-y-3 mb-6">
                            {attachments.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Paperclip size={16} className="text-gray-500 flex-shrink-0" />
                                        <a
                                            href={a.filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm truncate flex items-center gap-1"
                                        >
                                            {a.filePath}
                                            <ExternalLink size={12} className="inline flex-shrink-0" />
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                        <span className="text-gray-600 text-xs hidden sm:block">
                                            User #{a.userId} · {new Date(a.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteAttachment(a.id)}
                                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors"
                                            title="Delete attachment"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4 mb-6">No attachments yet.</p>
                    )}

                    {/* Add Attachment */}
                    <form onSubmit={handleAttachmentSubmit} className="space-y-2">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={filePathInput}
                                onChange={(e) => setFilePathInput(e.target.value)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Paste a file URL or path (e.g. https://…/screenshot.png)"
                            />
                            <button
                                type="submit"
                                disabled={attachmentSubmitting || !filePathInput.trim()}
                                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                            >
                                <Paperclip size={15} />
                                {attachmentSubmitting ? 'Attaching…' : 'Attach'}
                            </button>
                        </div>
                        {attachmentError && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm">
                                <AlertCircle size={14} className="flex-shrink-0" />
                                {attachmentError}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BugDetails;
