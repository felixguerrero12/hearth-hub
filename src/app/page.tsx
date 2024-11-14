'use client';

import React, { useState, useEffect } from 'react';
import HuntTable from '@src/components/HuntTable';
import type { Hunt } from '@src/lib/types';
import { FaSearch } from 'react-icons/fa';
import { Button } from "@src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui/select";
import { getAllHunts, searchHunts } from '@src/lib/huntCollector';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [hunts, setHunts] = useState<Hunt[]>([]);
    const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchHunts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const allHunts = await getAllHunts();

                if (!allHunts) {
                    throw new Error('Failed to fetch hunts');
                }

                setHunts(allHunts);
                // Extract unique tags
                const tags = Array.from(new Set(
                    allHunts.flatMap(hunt => hunt.tags)
                )).sort();
                setAvailableTags(tags);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHunts();
    }, []);

    const handleSearch = async (value: string) => {
        try {
            setSearchTerm(value);
            setIsLoading(true);
            setError(null);

            if (value.trim()) {
                const results = await searchHunts(value);
                setHunts(results);
            } else {
                const allHunts = await getAllHunts();
                setHunts(allHunts);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const filterByTag = (tag: string) => {
        setSelectedTag(tag);
        if (tag && tag !== 'all') {
            const filtered = hunts.filter(hunt => 
                hunt.tags.includes(tag)
            );
            setHunts(filtered);
        } else {
            getAllHunts().then(setHunts);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6" style={{ minHeight: '100vh' }}>
            {/* Centered Header Section */}
            <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-2 text-gray-800">
                    Hunting Exchange And Research Threat Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    A community-driven repository for threat hunting ideas, methodologies, and research.
                </p>
            </div>

            {/* Search and Filters in Center */}
            <div className="max-w-2xl mx-auto mb-8">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search hunts..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-hearth-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                    <Select value={selectedTag} onValueChange={filterByTag}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by tag" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All tags</SelectItem>
                            {availableTags.map(tag => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={async () => {
                            setSearchTerm('');
                            try {
                                setIsLoading(true);
                                const allHunts = await getAllHunts();
                                setHunts(allHunts);
                            } catch (err) {
                                setError(err instanceof Error ? err.message : 'Failed to reset');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>
            </div>

            <div className="mt-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hearth-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4">
                        {error}
                    </div>
                ) : hunts.length === 0 ? (
                    <div className="text-center text-gray-500 p-4">
                        No hunts found
                    </div>
                ) : (
                    <HuntTable 
                        hunts={hunts} 
                        selectedHunt={selectedHunt}
                        onHuntSelect={setSelectedHunt}
                    />
                )}
            </div>
        </div>
    );
}
