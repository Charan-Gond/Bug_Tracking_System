import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Bug, Filter, AlertCircle, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

const BugList = () => {
    const [bugs, setBugs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [searchParams] = useSearchParams();
    const { register, handleSubmit, reset, setValue } = useForm();

    // Filter states
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterProject, setFilterProject] = useState('ALL');

    useEffect(() => {
        // Check for create param
        if (searchParams.get('create') === 'true') {
            setIsModalOpen(true);
            const projectId = searchParams.get('projectId');
            if (projectId) setValue('projectId', projectId);
        }
    }, [searchParams, setValue]);

    const fetchData = async () => {
        try {
            const [bugsRes, projectsRes, usersRes] = await Promise.all([
                api.get('/bug'),
                api.get('/project'),
                api.get('/user')
            ]);
            setBugs(bugsRes.data);
            setProjects(projectsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        setSubmitError('');
        try {
            // reportedBy is set by the backend from the JWT principal
            await api.post('/bug', {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                projectId: parseInt(data.projectId),
                assignedTo: parseInt(data.assignedTo),
            });
            fetchData();
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to create bug", error);
            setSubmitError(error.response?.data?.message || 'Failed to create bug. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubmitError('');
        reset();
    };

    const filteredBugs = bugs.filter(bug => {
        if (filterStatus !== 'ALL' && bug.status !== filterStatus) return false;
        if (filterProject !== 'ALL' && bug.projectId.toString() !== filterProject) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bugs</h1>
                    <p className="text-gray-400">Track and manage issues</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Report Bug
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-400">
                    <Filter size={18} />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="ALL">All Failures</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                </select>

                <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="ALL">All Projects</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">Loading bugs...</div>
                ) : filteredBugs.length > 0 ? (
                    filteredBugs.map(bug => (
                        <div key={bug.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${bug.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                                    bug.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <Link to={`/bugs/${bug.id}`} className="text-lg font-semibold text-white hover:text-blue-400">
                                        {bug.title}
                                    </Link>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                        <span>#{bug.id}</span>
                                        <span>•</span>
                                        <span>{projects.find(p => p.id === bug.projectId)?.name || 'Unknown Project'}</span>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bug.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400' :
                                            bug.status === 'CLOSED' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {bug.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No bugs found matching your filters.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Report New Bug"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Brief summary of the issue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                        <select
                            {...register('projectId', { required: true })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                        <select
                            {...register('assignedTo', { required: true })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select User</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            {...register('description', { required: true })}
                            rows="4"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Steps to reproduce, expected behavior, etc."
                        />
                    </div>
                    {submitError && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
                            <X size={16} className="flex-shrink-0" />
                            <span>{submitError}</span>
                        </div>
                    )}
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="mr-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Report Bug
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BugList;
