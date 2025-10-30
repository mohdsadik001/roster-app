'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';

// Draggable Task Cell
function DraggableTaskCell({ task, dayIndex, dateLabel }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `task-${task.name}-${dayIndex}`,
        data: { task, dayIndex }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    if (!task) return <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center"></td>;

    return (
        <td 
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`border border-gray-300 dark:border-gray-700 px-3 py-2 text-center ${
                isDragging ? 'bg-blue-100 dark:bg-blue-900' : ''
            }`}
        >
            <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded-full text-sm font-medium cursor-grab active:cursor-grabbing">
                {task}
            </span>
        </td>
    );
}

// Droppable Date Cell
function DroppableCell({ dayIndex, dateLabel, children, isDropTarget }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `drop-${dayIndex}`,
        data: { dayIndex }
    });

    return (
        <td
            ref={setNodeRef}
            className={`border border-gray-300 dark:border-gray-700 px-3 py-2 text-center transition-colors ${
                isOver ? 'bg-green-100 dark:bg-green-900 ring-2 ring-green-500 dark:ring-green-400' : ''
            } ${isDropTarget ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
            {children}
        </td>
    );
}

export default function DraggableCalendar({ 
    calendar, 
    tasks,
    numGroups, 
    totalCalendarDays,
    onTaskMove 
}) {
    const [activeTask, setActiveTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Mandatory':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700';
            case 'weekoff':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
            case 'present':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
        }
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveTask(active.data.current);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        setActiveTask(null);

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || !overData) return;

        const oldDayIndex = activeData.dayIndex;
        const newDayIndex = overData.dayIndex;

        if (oldDayIndex !== newDayIndex) {
            // Find the task object
            const taskToMove = tasks.find(t => t.name.toLowerCase() === activeData.task);
            
            if (taskToMove) {
                // Calculate new columns based on the move
                const columnShift = newDayIndex - oldDayIndex;
                const newStartCol = taskToMove.start_col + columnShift;
                const newEndCol = taskToMove.end_col + columnShift;

                // Validate bounds
                if (newStartCol >= 2 && newEndCol <= totalCalendarDays + 1) {
                    onTaskMove(taskToMove, newStartCol, newEndCol, newDayIndex);
                } else {
                    alert('Cannot move task outside calendar bounds!');
                }
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="text-xl">🖱️</span>
                    <span>
                        <strong>Drag & Drop Tasks:</strong> Click and drag any task to move it to a different date. 
                        The task duration will remain the same, but start/end dates will update automatically.
                    </span>
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-white font-semibold sticky left-0 bg-gradient-to-r from-blue-600 to-purple-600 z-10">
                                Row
                            </th>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                <th key={idx} className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-white font-semibold min-w-[100px]">
                                    {day.date}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Day Row */}
                        <tr className="bg-blue-50 dark:bg-blue-900/20">
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-blue-50 dark:bg-blue-900/20 z-10">
                                Day
                            </td>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                <td key={idx} className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center font-medium">
                                    {day.day}
                                </td>
                            ))}
                        </tr>

                        {/* Task Row - DRAGGABLE */}
                        <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-yellow-50 dark:bg-yellow-900/20 z-10">
                                Task (Drag Me!)
                            </td>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                day.task ? (
                                    <DraggableTaskCell
                                        key={idx}
                                        task={day.task}
                                        dayIndex={idx}
                                        dateLabel={day.date}
                                    />
                                ) : (
                                    <DroppableCell
                                        key={idx}
                                        dayIndex={idx}
                                        dateLabel={day.date}
                                        isDropTarget={activeTask !== null}
                                    >
                                        {/* Empty cell but droppable */}
                                    </DroppableCell>
                                )
                            ))}
                        </tr>

                        {/* Group Rows */}
                        {Array.from({ length: numGroups }).map((_, groupIdx) => (
                            <tr key={groupIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-white dark:bg-gray-900 z-10">
                                    Group {groupIdx + 1}
                                </td>
                                {calendar.slice(0, totalCalendarDays).map((day, dayIdx) => (
                                    <td key={dayIdx} className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(day.groups[groupIdx])}`}>
                                            {day.groups[groupIdx]}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Submission Row */}
                        <tr className="bg-indigo-50 dark:bg-indigo-900/20">
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-indigo-50 dark:bg-indigo-900/20 z-10">
                                Submission
                            </td>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                <td key={idx} className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                                    {day.submission && (
                                        <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 rounded-full text-sm font-medium">
                                            {day.submission}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                {/* Legend */}
                <div className="mt-4 flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-full text-xs font-medium">
                            Mandatory
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Weekends & First 2 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 rounded-full text-xs font-medium">
                            present
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Working day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 rounded-full text-xs font-medium">
                            weekoff
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Day off</span>
                    </div>
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeTask ? (
                    <div className="px-3 py-2 bg-yellow-300 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 rounded-full text-sm font-medium shadow-lg border-2 border-yellow-500 dark:border-yellow-400">
                        {activeTask.task}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
