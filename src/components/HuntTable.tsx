import React, { useState } from 'react';
import type { Hunt } from '@src/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@src/components/ui/dialog"
import { Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface HuntTableProps {
    selectedHunt: Hunt | null;
    onHuntSelect: (hunt: Hunt | null) => void;
    hunts: Hunt[];
}

type SortConfig = {
    key: keyof Hunt | '';
    direction: 'asc' | 'desc';
};

const HuntTable: React.FC<HuntTableProps> = ({ hunts = [], selectedHunt, onHuntSelect }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });

    const sortedHunts = [...hunts].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = String(a[sortConfig.key]);
        const bVal = String(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    if (!hunts || hunts.length === 0) {
        return null;
    }

    const requestSort = (key: keyof Hunt) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => requestSort('id')}
                    >
                        <div className="flex items-center gap-2">
                        Hunt #
                        {sortConfig.key === 'id' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                        </div>
                    </th>
                    <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => requestSort('hypothesis')}
                    >
                        <div className="flex items-center gap-2">
                        Idea / Hypothesis
                        {sortConfig.key === 'hypothesis' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                        </div>
                    </th>
                    <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => requestSort('tactic')}
                    >
                        <div className="flex items-center gap-2">
                        Tactic
                        {sortConfig.key === 'tactic' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                        </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitter
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedHunts.map((hunt, index) => (
                    <tr key={hunt.id || index} onClick={() => onHuntSelect(hunt)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {hunt.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {hunt.hypothesis}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {hunt.tactic}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <div className="flex flex-wrap gap-1">
                                {hunt.tags?.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <a
                                href={hunt.submitter?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {hunt.submitter?.name}
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Dialog open={!!selectedHunt} onOpenChange={() => onHuntSelect(null as unknown as Hunt)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Hunt {selectedHunt?.id}</DialogTitle>
                        <DialogDescription className="text-lg">
                            {selectedHunt?.hypothesis}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="prose dark:prose-invert max-w-none">
                            <div className="mb-4">
                                <div className="font-semibold mb-2">Tactic:</div>
                                <div>{selectedHunt?.tactic}</div>
                            </div>
                            <div className="mb-4">
                                <div className="font-semibold mb-2">Tags:</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedHunt?.tags?.map((tag, i) => (
                                        <span key={i} className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {selectedHunt?.notes && (
                                <div className="mb-4">
                                    <div className="font-semibold mb-2">Notes:</div>
                                    <div>{selectedHunt?.notes}</div>
                                </div>
                            )}
                            <div className="mb-4">
                                <div className="font-semibold mb-2">Submitted by:</div>
                                <a
                                    href={selectedHunt?.submitter?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    {selectedHunt?.submitter?.name}
                                </a>
                            </div>
                            <div className="mt-8 border-t pt-4">
                                <div className="font-semibold mb-4">Full Content:</div>
                                <div className="relative">
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(selectedHunt?.content || '')}
                                        className="absolute right-2 top-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                                        <code className="text-sm">
                                            {selectedHunt?.content}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HuntTable;
