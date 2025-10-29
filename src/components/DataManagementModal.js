import { X, Database, Download, Upload, Trash2, RotateCcw } from 'lucide-react';
import { StorageManager } from '@/lib/storage';

export default function DataManagementModal({ onClose, onReset }) {
    const handleExportJSON = () => {
        const data = StorageManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-scheduler-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Data exported successfully!');
    };

    const handleImportJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (StorageManager.importData(data)) {
                            alert('✅ Data imported successfully! Page will reload.');
                            window.location.reload();
                        } else {
                            alert('❌ Failed to import data. Please check the file format.');
                        }
                    } catch (error) {
                        alert('❌ Invalid JSON file. Please select a valid backup file.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleClearStorage = () => {
        if (confirm('Are you sure you want to clear all saved data? This will not reset to default.')) {
            if (StorageManager.clearAll()) {
                alert('✅ Storage cleared! Page will reload.');
                window.location.reload();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Database className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Data Management</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>💾 Auto-Save:</strong> All changes are automatically saved to your browser's local storage.
                        </p>
                    </div>

                    {/* Export Data */}
                    <button
                        onClick={handleExportJSON}
                        className="w-full flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <Download className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-800">Export Backup</h3>
                            <p className="text-sm text-gray-600">Download all data as JSON file</p>
                        </div>
                    </button>

                    {/* Import Data */}
                    <button
                        onClick={handleImportJSON}
                        className="w-full flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                    >
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-800">Import Backup</h3>
                            <p className="text-sm text-gray-600">Restore data from JSON file</p>
                        </div>
                    </button>

                    {/* Reset to Default */}
                    <button
                        onClick={onReset}
                        className="w-full flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition"
                    >
                        <div className="bg-orange-100 p-3 rounded-full">
                            <RotateCcw className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-800">Reset to Default</h3>
                            <p className="text-sm text-gray-600">Clear all data and restore sample data</p>
                        </div>
                    </button>

                    {/* Clear Storage */}
                    <button
                        onClick={handleClearStorage}
                        className="w-full flex items-center gap-3 p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition"
                    >
                        <div className="bg-red-100 p-3 rounded-full">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-800">Clear Storage</h3>
                            <p className="text-sm text-gray-600">Remove all saved data</p>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
