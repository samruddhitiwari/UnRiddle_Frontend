'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; reviewText: string; reviewerName: string; isAnonymous: boolean }) => Promise<void>;
}

export function ReviewForm({ isOpen, onClose, onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (reviewText.length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ rating, reviewText, reviewerName, isAnonymous });
            // Reset form
            setRating(5);
            setReviewText('');
            setReviewerName('');
            setIsAnonymous(false);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(255, 251, 245, 0.95)' }}
        >
            <div className="brutalist-card w-full max-w-md p-8 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    style={{ border: '1.5px solid var(--border-dark)' }}
                >
                    <X size={20} />
                </button>

                <h2 className="heading-md mb-2">Leave a Review</h2>
                <p className="body-md mb-6" style={{ color: 'var(--text-muted)' }}>
                    Share your honest experience with Unriddle.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="text-3xl transition-transform hover:scale-110"
                                >
                                    <span className={star <= rating ? 'star-filled' : 'star-empty'}>★</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What's your experience been like?"
                            rows={4}
                            maxLength={500}
                            className="w-full p-3 border-2 rounded-lg resize-none focus:outline-none"
                            style={{
                                borderColor: 'var(--border-dark)',
                                backgroundColor: 'var(--bg-white)',
                            }}
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {reviewText.length}/500 characters
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Name (optional)</label>
                        <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            placeholder="e.g., Sarah K."
                            maxLength={50}
                            disabled={isAnonymous}
                            className="w-full p-3 border-2 rounded-lg focus:outline-none disabled:opacity-50"
                            style={{
                                borderColor: 'var(--border-dark)',
                                backgroundColor: isAnonymous ? 'var(--bg-cream)' : 'var(--bg-white)',
                            }}
                        />
                    </div>

                    {/* Anonymous toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-5 h-5 border-2 rounded cursor-pointer"
                            style={{ borderColor: 'var(--border-dark)' }}
                        />
                        <span className="text-sm">Post anonymously</span>
                    </label>

                    {/* Error */}
                    {error && (
                        <p className="text-sm p-3 rounded-lg" style={{
                            backgroundColor: '#FFF0F0',
                            border: '1.5px solid #FF6B6B',
                            color: '#CC0000'
                        }}>
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full justify-center disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
