import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, FolderGit2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchProjects = async () => {
        try {
            const response = await api.get('/project');
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/project', data); // Backend expects { name, description }
            fetchProjects();
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to create project", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-gray-400">Manage your software projects</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-48 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                        </div>
                    ))
                ) : projects.length > 0 ? (
                    projects.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                                    <FolderGit2 size={24} />
                                </div>
                                {/* <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">ID: {project.id}</span> */}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                {project.description || "No description provided."}
                            </p>

                            <div className="pt-4 border-t border-gray-700 flex items-center text-gray-500 text-xs">
                                <Calendar size={14} className="mr-2" />
                                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
                        <FolderGit2 size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No projects found. Create one to get started.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Project"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Bug Tracker Web App"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows="4"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Describe the project..."
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mr-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectList;
