// src/lib/storage.js - LocalStorage Manager

const STORAGE_KEYS = {
    CALENDAR: 'task_scheduler_calendar',
    TASKS: 'task_scheduler_tasks',
    SETTINGS: 'task_scheduler_settings'
};

export const StorageManager = {
    // Save calendar data
    saveCalendar(calendar) {
        try {
            localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendar));
            return true;
        } catch (error) {
            console.error('Failed to save calendar:', error);
            return false;
        }
    },

    // Load calendar data
    loadCalendar() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CALENDAR);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load calendar:', error);
            return null;
        }
    },

    // Save tasks data
    saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Failed to save tasks:', error);
            return false;
        }
    },

    // Load tasks data
    loadTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TASKS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return null;
        }
    },

    // Save settings (num_groups, amount_per_day)
    saveSettings(numGroups, amountPerDay) {
        try {
            const settings = { numGroups, amountPerDay };
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    },

    // Load settings
    loadSettings() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return null;
        }
    },

    // Clear all data
    clearAll() {
        try {
            localStorage.removeItem(STORAGE_KEYS.CALENDAR);
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    },

    // Check if data exists
    hasData() {
        return localStorage.getItem(STORAGE_KEYS.CALENDAR) !== null;
    },

    // Export all data as JSON
    exportData() {
        return {
            calendar: this.loadCalendar(),
            tasks: this.loadTasks(),
            settings: this.loadSettings(),
            exportDate: new Date().toISOString()
        };
    },

    // Import data from JSON
    importData(data) {
        try {
            if (data.calendar) this.saveCalendar(data.calendar);
            if (data.tasks) this.saveTasks(data.tasks);
            if (data.settings) this.saveSettings(data.settings.numGroups, data.settings.amountPerDay);
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
};
