'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

// Draggable Cell Component
function DraggableCell({ id, content, type, className, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { content, type, id }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.3 : 1,
    };

    if (!content) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`${className} cursor-grab active:cursor-grabbing touch-none select-none`}
            onDoubleClick={() => onRemove && onRemove()}
            title="Drag to move/swap, double-click to remove"
        >
            {content}
        </div>
    );
}

// Droppable Cell Component
function DroppableCell({ id, children, isOver, className = '' }) {
    const { setNodeRef, isOver: dndIsOver } = useDroppable({
        id,
        data: { cellId: id }
    });

    return (
        <td
            ref={setNodeRef}
            className={`border border-gray-300 dark:border-gray-700 px-3 py-2 text-center transition-all min-h-[60px] relative ${
                (isOver || dndIsOver) ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 dark:ring-blue-400' : ''
            } ${className}`}
        >
            {children}
        </td>
    );
}

// Status Palette Component
function StatusPalette() {
    const statuses = [
        { value: 'Mandatory', color: 'bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100' },
        { value: 'present', color: 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100' },
        { value: 'weekoff', color: 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100' },
    ];

    return (
        <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                <GripVertical className="w-4 h-4" />
                Drag Status from Palette (or swap between cells)
            </h3>
            <div className="flex gap-3 flex-wrap">
                {statuses.map((status) => (
                    <DraggableCell
                        key={`palette-${status.value}`}
                        id={`palette-${status.value}`}
                        content={status.value}
                        type="status"
                        className={`px-3 py-2 rounded-full text-xs font-medium border-2 ${status.color} border-opacity-50`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function FullyDraggableCalendar({ 
    calendar, 
    tasks,
    numGroups, 
    totalCalendarDays,
    onCalendarUpdate,
    onTaskMove 
}) {
    const [activeItem, setActiveItem] = useState(null);
    const [overId, setOverId] = useState(null);

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
        setActiveItem(active.data.current);
        console.log('🎯 Drag started:', active.id);
    };

    const handleDragOver = (event) => {
        const { over } = event;
        setOverId(over?.id || null);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        setActiveItem(null);
        setOverId(null);

        if (!over) {
            console.log('❌ No drop target');
            return;
        }

        const activeData = active.data.current;

        if (!activeData) {
            console.log('❌ No active data');
            return;
        }

        console.log('📍 Dropped on:', over.id);

        // Parse active (source) information
        const activeId = active.id;
        
        // Handle palette items (just set values, no swap)
        if (activeId.startsWith('palette-')) {
            let targetId = over.id;
            
            // If over is a draggable, get its parent cell
            if (targetId.includes('group-')) {
                const parts = targetId.split('-');
                
                if (parts.length === 3) {
                    // Dropped on empty cell: group-0-5
                    const groupIdx = parseInt(parts[1]);
                    const dayIdx = parseInt(parts[2]);
                    
                    const newCalendar = [...calendar];
                    newCalendar[dayIdx].groups[groupIdx] = activeData.content;
                    onCalendarUpdate(newCalendar);
                    console.log(`✅ Set ${activeData.content} to Group ${groupIdx + 1} Day ${dayIdx + 1}`);
                } else if (parts.length === 4) {
                    // Dropped on existing value: group-0-5-present
                    const groupIdx = parseInt(parts[1]);
                    const dayIdx = parseInt(parts[2]);
                    
                    const newCalendar = [...calendar];
                    newCalendar[dayIdx].groups[groupIdx] = activeData.content;
                    onCalendarUpdate(newCalendar);
                    console.log(`✅ Replaced to ${activeData.content} at Group ${groupIdx + 1} Day ${dayIdx + 1}`);
                }
            }
            return;
        }

        // Parse source (active) cell information
        const activeIdParts = activeId.split('-');
        let activeRowType, activeGroupIndex, activeDayIndex;
        
        if (activeIdParts[0] === 'task') {
            activeRowType = 'task';
            activeDayIndex = parseInt(activeIdParts[activeIdParts.length - 1]);
        } else if (activeIdParts[0] === 'group') {
            activeRowType = 'group';
            activeGroupIndex = parseInt(activeIdParts[1]);
            activeDayIndex = parseInt(activeIdParts[2]);
        } else if (activeIdParts[0] === 'submission') {
            activeRowType = 'submission';
            activeDayIndex = parseInt(activeIdParts[activeIdParts.length - 1]);
        }

        // Parse target (over) cell information
        const overId = over.id;
        const overIdParts = overId.split('-');
        let overRowType, overGroupIndex, overDayIndex;
        
        if (overIdParts[0] === 'task') {
            overRowType = 'task';
            // Check if it's a droppable cell or draggable item
            if (overIdParts.length === 2) {
                // Droppable: task-0
                overDayIndex = parseInt(overIdParts[1]);
            } else {
                // Draggable: task-task1-0
                overDayIndex = parseInt(overIdParts[overIdParts.length - 1]);
            }
        } else if (overIdParts[0] === 'group') {
            overRowType = 'group';
            if (overIdParts.length === 3) {
                // Droppable: group-0-5
                overGroupIndex = parseInt(overIdParts[1]);
                overDayIndex = parseInt(overIdParts[2]);
            } else {
                // Draggable: group-0-5-present
                overGroupIndex = parseInt(overIdParts[1]);
                overDayIndex = parseInt(overIdParts[2]);
            }
        } else if (overIdParts[0] === 'submission') {
            overRowType = 'submission';
            if (overIdParts.length === 2) {
                // Droppable: submission-0
                overDayIndex = parseInt(overIdParts[1]);
            } else {
                // Draggable: submission-task1-0
                overDayIndex = parseInt(overIdParts[overIdParts.length - 1]);
            }
        }

        // Ensure we have valid indices
        if (activeDayIndex === undefined || overDayIndex === undefined) {
            console.log('❌ Invalid indices');
            return;
        }
        
        // Don't swap with itself
        if (activeDayIndex === overDayIndex && activeGroupIndex === overGroupIndex) {
            console.log('⚠️ Same cell, no action');
            return;
        }

        const newCalendar = [...calendar];

        // Handle TASK swapping/moving
        if (activeRowType === 'task' && overRowType === 'task') {
            const activeValue = newCalendar[activeDayIndex].task;
            const overValue = newCalendar[overDayIndex].task;

            // SWAP
            newCalendar[activeDayIndex].task = overValue || '';
            newCalendar[overDayIndex].task = activeValue;

            if (overValue) {
                console.log(`🔄 Swapped tasks: ${activeValue} ↔ ${overValue}`);
            } else {
                console.log(`➡️ Moved task: ${activeValue} to day ${overDayIndex + 1}`);
            }

            // Update task object positions
            const taskToMove = tasks.find(t => t.name.toLowerCase() === activeValue.toLowerCase());
            if (taskToMove && onTaskMove) {
                const columnShift = overDayIndex - activeDayIndex;
                const newStartCol = taskToMove.start_col + columnShift;
                const newEndCol = taskToMove.end_col + columnShift;
                onTaskMove(taskToMove, newStartCol, newEndCol, overDayIndex);
            } else {
                onCalendarUpdate(newCalendar);
            }
            return;
        }

        // Handle GROUP STATUS swapping/moving
        if (activeRowType === 'group' && overRowType === 'group' && 
            activeGroupIndex !== null && activeGroupIndex !== undefined &&
            overGroupIndex !== null && overGroupIndex !== undefined) {
            
            const activeValue = newCalendar[activeDayIndex].groups[activeGroupIndex];
            const overValue = newCalendar[overDayIndex].groups[overGroupIndex];

            // SWAP
            newCalendar[activeDayIndex].groups[activeGroupIndex] = overValue || '';
            newCalendar[overDayIndex].groups[overGroupIndex] = activeValue;

            if (overValue) {
                console.log(`🔄 Swapped group statuses: ${activeValue} ↔ ${overValue} (Group ${activeGroupIndex + 1} Day ${activeDayIndex + 1} ↔ Group ${overGroupIndex + 1} Day ${overDayIndex + 1})`);
            } else {
                console.log(`➡️ Moved group status: ${activeValue} to Group ${overGroupIndex + 1} Day ${overDayIndex + 1}`);
            }

            onCalendarUpdate(newCalendar);
            return;
        }

        // Handle SUBMISSION swapping/moving
        if (activeRowType === 'submission' && overRowType === 'submission') {
            const activeValue = newCalendar[activeDayIndex].submission;
            const overValue = newCalendar[overDayIndex].submission;

            // SWAP
            newCalendar[activeDayIndex].submission = overValue || '';
            newCalendar[overDayIndex].submission = activeValue;

            if (overValue) {
                console.log(`🔄 Swapped submissions: ${activeValue} ↔ ${overValue}`);
            } else {
                console.log(`➡️ Moved submission: ${activeValue} to day ${overDayIndex + 1}`);
            }

            onCalendarUpdate(newCalendar);
            return;
        }

        console.log('⚠️ No matching swap/move operation');
    };

    const handleRemoveCell = (dayIndex, groupIndex = null, rowType = 'task') => {
        const newCalendar = [...calendar];
        if (rowType === 'task') {
            newCalendar[dayIndex].task = '';
            console.log(`🗑️ Removed task from day ${dayIndex + 1}`);
        } else if (rowType === 'group' && groupIndex !== null) {
            newCalendar[dayIndex].groups[groupIndex] = '';
            console.log(`🗑️ Removed status from Group ${groupIndex + 1} Day ${dayIndex + 1}`);
        } else if (rowType === 'submission') {
            newCalendar[dayIndex].submission = '';
            console.log(`🗑️ Removed submission from day ${dayIndex + 1}`);
        }
        onCalendarUpdate(newCalendar);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="text-xl">🔄</span>
                    <span>
                        <strong>Fully Editable Calendar with Swapping:</strong> Drag any cell over another to <strong>swap positions</strong>. 
                        Drag over empty cell to move. Drag from palette to set status. 
                        Double-click any cell to remove it. Check browser console for swap confirmations!
                    </span>
                </p>
            </div>

            {/* Status Palette */}
            <StatusPalette />

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

                        {/* Task Row - DRAGGABLE & SWAPPABLE */}
                        <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-yellow-50 dark:bg-yellow-900/20 z-10">
                                Task
                            </td>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                <DroppableCell
                                    key={idx}
                                    id={`task-${idx}`}
                                    isOver={overId === `task-${idx}`}
                                    className="bg-yellow-50 dark:bg-yellow-900/20"
                                >
                                    {day.task && (
                                        <DraggableCell
                                            id={`task-${day.task}-${idx}`}
                                            content={day.task}
                                            type="task"
                                            className="px-2 py-1 bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 rounded-full text-sm font-medium inline-block"
                                            onRemove={() => handleRemoveCell(idx, null, 'task')}
                                        />
                                    )}
                                </DroppableCell>
                            ))}
                        </tr>

                        {/* Group Rows - DRAGGABLE & SWAPPABLE */}
                        {Array.from({ length: numGroups }).map((_, groupIdx) => (
                            <tr key={groupIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-white dark:bg-gray-900 z-10">
                                    Group {groupIdx + 1}
                                </td>
                                {calendar.slice(0, totalCalendarDays).map((day, dayIdx) => (
                                    <DroppableCell
                                        key={dayIdx}
                                        id={`group-${groupIdx}-${dayIdx}`}
                                        isOver={overId === `group-${groupIdx}-${dayIdx}`}
                                    >
                                        {day.groups[groupIdx] && (
                                            <DraggableCell
                                                id={`group-${groupIdx}-${dayIdx}-${day.groups[groupIdx]}`}
                                                content={day.groups[groupIdx]}
                                                type="group"
                                                className={`px-2 py-1 rounded-full text-xs font-medium border inline-block ${getStatusColor(day.groups[groupIdx])}`}
                                                onRemove={() => handleRemoveCell(dayIdx, groupIdx, 'group')}
                                            />
                                        )}
                                    </DroppableCell>
                                ))}
                            </tr>
                        ))}

                        {/* Submission Row - DRAGGABLE & SWAPPABLE */}
                        <tr className="bg-indigo-50 dark:bg-indigo-900/20">
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold sticky left-0 bg-indigo-50 dark:bg-indigo-900/20 z-10">
                                Submission
                            </td>
                            {calendar.slice(0, totalCalendarDays).map((day, idx) => (
                                <DroppableCell
                                    key={idx}
                                    id={`submission-${idx}`}
                                    isOver={overId === `submission-${idx}`}
                                    className="bg-indigo-50 dark:bg-indigo-900/20"
                                >
                                    {day.submission && (
                                        <DraggableCell
                                            id={`submission-${day.submission}-${idx}`}
                                            content={day.submission}
                                            type="submission"
                                            className="px-2 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 rounded-full text-sm font-medium inline-block"
                                            onRemove={() => handleRemoveCell(idx, null, 'submission')}
                                        />
                                    )}
                                </DroppableCell>
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

                {/* Swap Info */}
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <span>
                            <strong>Pro Tip:</strong> Open browser console (F12) to see detailed swap confirmations. 
                            Drag task over task to swap. Drag status over status to swap. Try it now!
                        </span>
                    </p>
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeItem ? (
                    <div className={`px-3 py-2 rounded-full text-sm font-medium shadow-2xl border-2 ${
                        activeItem.type === 'task' ? 'bg-yellow-300 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 border-yellow-500' :
                        activeItem.type === 'submission' ? 'bg-indigo-300 dark:bg-indigo-600 text-indigo-900 dark:text-indigo-100 border-indigo-500' :
                        getStatusColor(activeItem.content)
                    }`}>
                        {activeItem.content}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
