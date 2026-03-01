import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Bug, Calendar, FolderGit2, User, MoreVertical } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, bugsRes] = await Promise.all([
                    api.get(`/project/${id}`),
                    api.get(`/bug/project/${id}`)
                ]);
                setProject(projectRes.data);
                setBugs(bugsRes.data);
            } catch (error) {
                console.error("Failed to fetch project details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <FolderGit2 size={24} />
                            </div>
                            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                        </div>
                        <p className="text-gray-400 max-w-2xl">{project.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 border-t border-gray-700 pt-6">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Created by User #{project.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Bugs List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Bug size={20} className="text-blue-500" />
                        Bugs ({bugs.length})
                    </h2>
                    <Link
                        to={`/bugs?projectId=${id}&create=true`}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                        Report Bug
                    </Link>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {bugs.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Priority</th>
                                    <th className="px-6 py-3 font-medium">Reporter</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {bugs.map(bug => (
                                    <tr key={bug.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link to={`/bugs/${bug.id}`} className="text-white font-medium hover:text-blue-400">
                                                {bug.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bug.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    bug.status === 'CLOSED' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                                                }`}>
                                                {bug.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bug.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                                                    bug.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {bug.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            User #{bug.reportedBy}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No bugs reported for this project yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
