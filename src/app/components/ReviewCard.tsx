'use client';

interface ReviewCardProps {
    rating: number;
    reviewText: string;
    reviewerName: string | null;
    isAnonymous: boolean;
}

export function ReviewCard({ rating, reviewText, reviewerName, isAnonymous }: ReviewCardProps) {
    // Generate star display
    const stars = Array.from({ length: 5 }, (_, i) => i < rating);

    return (
        <div className="brutalist-card p-6">
            {/* Star Rating */}
            <div className="flex gap-1 mb-4">
                {stars.map((filled, i) => (
                    <span key={i} className={`text-xl ${filled ? 'star-filled' : 'star-empty'}`}>
                        ★
                    </span>
                ))}
            </div>

            {/* Review Text */}
            <p className="body-md mb-4 italic">"{reviewText}"</p>

            {/* Reviewer Name */}
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                — {isAnonymous || !reviewerName ? 'Anonymous' : reviewerName}
            </p>
        </div>
    );
}
