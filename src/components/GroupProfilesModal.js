'use client';

import { X, Users, Edit2, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function GroupProfilesModal({ 
    onClose, 
    numGroups,
    groupProfiles,
    onUpdateProfiles
}) {
    const [profiles, setProfiles] = useState(groupProfiles || 
        Array.from({ length: numGroups }, (_, i) => ({
            id: i,
            name: `Group ${i + 1}`,
            skillLevel: 'Mid',
            leader: '',
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }))
    );

    const [editingIndex, setEditingIndex] = useState(null);

    const handleUpdate = (index, field, value) => {
        const newProfiles = [...profiles];
        newProfiles[index][field] = value;
        setProfiles(newProfiles);
    };

    const handleSave = () => {
        onUpdateProfiles(profiles);
        onClose();
    };

    const skillLevels = ['Junior', 'Mid', 'Senior', 'Expert'];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Group Profiles Management</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {profiles.map((profile, index) => (
                        <div 
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-600 transition"
                            style={{ borderLeftWidth: '4px', borderLeftColor: profile.color }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Group Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Frontend Team"
                                    />
                                </div>

                                {/* Skill Level */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Skill Level</label>
                                    <select
                                        value={profile.skillLevel}
                                        onChange={(e) => handleUpdate(index, 'skillLevel', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {skillLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Leader */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Team Leader</label>
                                    <input
                                        type="text"
                                        value={profile.leader}
                                        onChange={(e) => handleUpdate(index, 'leader', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Leader name"
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Color</label>
                                    <div className="flex gap-2">
                                        {colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => handleUpdate(index, 'color', color)}
                                                className={`w-8 h-8 rounded-full border-2 ${
                                                    profile.color === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Save Profiles
                    </button>
                </div>
            </div>
        </div>
    );
}
