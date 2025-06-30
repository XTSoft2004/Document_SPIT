'use client';

import { getCourse } from '@/actions/course.actions';
import { ICourseResponse } from '@/types/course';
import { useState, useEffect } from 'react';

interface CourseSelectorProps {
    value: string;
    courseId: number | null;
    onCourseSelect: (course: ICourseResponse) => void;
    placeholder?: string;
    className?: string;
}

export default function CourseSelector({
    value,
    courseId,
    onCourseSelect,
    placeholder = "Tìm kiếm môn học...",
    className = ""
}: CourseSelectorProps) {
    const [searchTerm, setSearchTerm] = useState(value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [courses, setCourses] = useState<ICourseResponse[]>([]);
    const handleSearchCourse = async (search: string) => {
        if (search && search.trim() !== '') {
            const response = await getCourse(search, 1, 20);
            if (response.ok) {
                setCourses(response.data);
            }
        }
    }

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCourseSelect = (course: ICourseResponse) => {
        setSearchTerm(course.name);
        setIsDropdownOpen(false);
        onCourseSelect(course);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        handleSearchCourse(e.target.value);
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    return (
        <div className={`relative ${className}`}>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Môn học <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="course"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                    required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
                <>
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <button
                                    key={course.id}
                                    type="button"
                                    onClick={() => handleCourseSelect(course)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">{course.name}</div>
                                    <div className="text-sm text-gray-500">{course.code}</div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-gray-500">
                                Vui lòng nhập để tìm kiếm môn học
                            </div>
                        )}
                    </div>
                    {/* Click outside to close dropdown */}
                    <div
                        className="fixed inset-0 z-5"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                </>
            )}
        </div>
    );
}
