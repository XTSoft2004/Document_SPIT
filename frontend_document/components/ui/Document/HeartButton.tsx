'use client';

import { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { changeStatusStar } from '@/actions/user.action';

interface HeartButtonProps {
    documentId: number;
    className?: string;
    starDocument?: number[];
    onStarredUpdate?: (starDocument: number[]) => void;
}

export default function HeartButton({
    documentId,
    className = '',
    starDocument = [],
    onStarredUpdate
}: HeartButtonProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLiked(starDocument.includes(documentId));
    }, [starDocument, documentId]);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await changeStatusStar(documentId);

            if (response.ok) {
                setIsLiked(!isLiked);

                if (onStarredUpdate) {
                    const newstarDocument = isLiked
                        ? starDocument.filter(id => id !== documentId)
                        : [...starDocument, documentId];
                    onStarredUpdate(newstarDocument);
                }
            } else {
                console.error('Error changing star status:', response);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={isLoading}
            className={`p-1 hover:bg-red-100 rounded-lg transition-all duration-200 group ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${className}`}
            title={isLiked ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
            {isLiked ? (
                <AiFillHeart className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            ) : (
                <AiOutlineHeart className="w-4 h-4 text-gray-500 group-hover:text-red-500 group-hover:scale-110 transition-all" />
            )}
        </button>
    );
}
