'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

function SortableTaskItem({ task, id }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${
                isDragging
                    ? 'shadow-2xl scale-105 ring-2 ring-blue-500 dark:ring-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-all cursor-move`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{task.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.start_date} to {task.end_date}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{task.duration} days</p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nett Days</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{task.nett_days}</p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Weekoffs</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">{task.avg_weekoff}</p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        ${task.nett_amount}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DragDropCalendar({ tasks, onTaskReorder }) {
    const [items, setItems] = useState(tasks.map((task, index) => task.name));

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tasks.findIndex((task) => task.name === active.id);
            const newIndex = tasks.findIndex((task) => task.name === over.id);

            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            setItems(newTasks.map((task) => task.name));
            onTaskReorder(newTasks);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-2">
                    <GripVertical className="w-5 h-5" />
                    Drag to Reorder Tasks
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click and drag tasks to change their order. Changes are saved automatically.
                </p>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <GripVertical className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks to reorder</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Add some tasks to get started
                    </p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <SortableTaskItem key={task.name} id={task.name} task={task} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <span>
                        <strong>Tip:</strong> Drag tasks to reorder them. The new order will be reflected 
                        in all views and automatically saved.
                    </span>
                </p>
            </div>
        </div>
    );
}
