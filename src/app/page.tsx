'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Zap, Search, Shield, MessageSquare, File } from 'lucide-react';
import { ReviewCard } from './components/ReviewCard';
import { ReviewForm } from './components/ReviewForm';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  reviewer_name: string | null;
  is_anonymous: boolean;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Hero ambient visual system state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/reviews?limit=6`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (data: {
    rating: number;
    reviewText: string;
    reviewerName: string;
    isAnonymous: boolean;
  }) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    // Note: In production, you'd get user_id from auth context
    const res = await fetch(`${apiUrl}/reviews?user_id=demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: data.rating,
        review_text: data.reviewText,
        reviewer_name: data.reviewerName || null,
        is_anonymous: data.isAnonymous,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit review');
    }

    // Refresh reviews
    await fetchReviews();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-cream)' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 px-4 py-4"
        style={{
          backgroundColor: 'var(--bg-cream)',
          borderBottom: '2px solid var(--border-dark)'
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent-coral)',
                border: '2px solid var(--border-dark)',
                borderRadius: '8px'
              }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Unriddle
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
              style={{ color: 'var(--text-body)' }}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
              style={{ color: 'var(--text-body)' }}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
              style={{ color: 'var(--text-body)' }}
            >
              Sign in
            </Link>
            <Link href="/login" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div
            ref={heroRef}
            className="grid md:grid-cols-2 gap-12 md:gap-8 items-center"
            onMouseMove={(e) => {
              if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePosition({ x, y });
              }
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setMousePosition({ x: 0, y: 0 });
            }}
          >
            {/* Left Side - Content (FINAL - DO NOT CHANGE) */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="badge mb-6">
                <Zap size={14} />
                <span>Simple document conversations</span>
              </div>

              {/* Headline */}
              <h1 className="heading-xl mb-6">
                Chat with your<br />
                <span style={{ color: 'var(--accent-coral)' }}>documents.</span>
              </h1>

              {/* Subtext */}
              <p className="body-lg mb-10 max-w-xl">
                Upload any PDF. Ask questions in plain English.
                Get answers that cite exactly where they came from.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="btn-primary">
                  Start Free <ArrowRight size={18} />
                </Link>
                <Link href="/pricing" className="btn-secondary">
                  View Pricing
                </Link>
              </div>

              {/* Social proof snippet */}
              <p className="mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                Free tier includes 50 queries. No credit card needed.
              </p>
            </div>

            {/* Right Side - Ambient Visual System */}
            <div className="relative h-[400px] md:h-[480px] hidden md:block">
              {/* A. PRIMARY ELEMENT - Oversized Paper Sheet (Anchor) */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: isHovering
                    ? `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg)`
                    : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
                }}
              >
                <div
                  style={{
                    width: '320px',
                    height: '400px',
                    backgroundColor: '#FAF9F6',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '4px',
                    boxShadow: '8px 8px 0 var(--border-dark)',
                    transform: 'rotate(6deg)',
                  }}
                />
              </div>

              {/* B. SECONDARY ELEMENTS - Floating Document Chips */}
              {/* Chip 1 - Top left */}
              <div
                className="absolute"
                style={{
                  top: '15%',
                  left: '5%',
                  transform: isHovering
                    ? `translate(${-mousePosition.x * 15}px, ${-mousePosition.y * 15}px) rotate(-3deg)`
                    : 'translate(0, 0) rotate(-3deg)',
                  transition: 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
                  animation: 'drift1 6s ease-in-out infinite',
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 0 var(--border-dark)',
                  }}
                >
                  <File size={14} style={{ color: 'var(--accent-coral)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>report.pdf</span>
                </div>
              </div>

              {/* Chip 2 - Top right */}
              <div
                className="absolute"
                style={{
                  top: '8%',
                  right: '15%',
                  transform: isHovering
                    ? `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px) rotate(4deg)`
                    : 'translate(0, 0) rotate(4deg)',
                  transition: 'transform 0.75s cubic-bezier(0.33, 1, 0.68, 1)',
                  animation: 'drift2 7s ease-in-out infinite',
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 0 var(--border-dark)',
                  }}
                >
                  <FileText size={14} style={{ color: 'var(--bg-mint)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>notes.pdf</span>
                </div>
              </div>

              {/* Chip 3 - Middle right */}
              <div
                className="absolute"
                style={{
                  top: '45%',
                  right: '0%',
                  transform: isHovering
                    ? `translate(${-mousePosition.x * 25}px, ${-mousePosition.y * 25}px) rotate(-2deg)`
                    : 'translate(0, 0) rotate(-2deg)',
                  transition: 'transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)',
                  animation: 'drift3 8s ease-in-out infinite',
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 0 var(--border-dark)',
                  }}
                >
                  <File size={14} style={{ color: 'var(--bg-lavender)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>thesis.pdf</span>
                </div>
              </div>

              {/* Chip 4 - Bottom left */}
              <div
                className="absolute"
                style={{
                  bottom: '20%',
                  left: '8%',
                  transform: isHovering
                    ? `translate(${-mousePosition.x * 18}px, ${-mousePosition.y * 18}px) rotate(5deg)`
                    : 'translate(0, 0) rotate(5deg)',
                  transition: 'transform 0.85s cubic-bezier(0.33, 1, 0.68, 1)',
                  animation: 'drift4 7.5s ease-in-out infinite',
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 0 var(--border-dark)',
                  }}
                >
                  <FileText size={14} style={{ color: 'var(--accent-teal)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>contract.pdf</span>
                </div>
              </div>

              {/* Chip 5 - Bottom center */}
              <div
                className="absolute"
                style={{
                  bottom: '10%',
                  left: '40%',
                  transform: isHovering
                    ? `translate(${-mousePosition.x * 12}px, ${-mousePosition.y * 12}px) rotate(-4deg)`
                    : 'translate(0, 0) rotate(-4deg)',
                  transition: 'transform 0.9s cubic-bezier(0.33, 1, 0.68, 1)',
                  animation: 'drift5 6.5s ease-in-out infinite',
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '2px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '3px 3px 0 var(--border-dark)',
                  }}
                >
                  <File size={14} style={{ color: 'var(--bg-peach)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>research.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Keyframes for drift animations */}
        <style jsx>{`
          @keyframes drift1 {
            0%, 100% { transform: translate(0, 0) rotate(-3deg); }
            50% { transform: translate(3px, -5px) rotate(-2deg); }
          }
          @keyframes drift2 {
            0%, 100% { transform: translate(0, 0) rotate(4deg); }
            50% { transform: translate(-4px, 4px) rotate(5deg); }
          }
          @keyframes drift3 {
            0%, 100% { transform: translate(0, 0) rotate(-2deg); }
            50% { transform: translate(5px, -3px) rotate(-1deg); }
          }
          @keyframes drift4 {
            0%, 100% { transform: translate(0, 0) rotate(5deg); }
            50% { transform: translate(-3px, -4px) rotate(6deg); }
          }
          @keyframes drift5 {
            0%, 100% { transform: translate(0, 0) rotate(-4deg); }
            50% { transform: translate(4px, 3px) rotate(-3deg); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20" style={{ backgroundColor: 'var(--bg-white)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="heading-lg mb-4">How it works</h2>
            <p className="body-lg">
              No complicated setup. Just upload, ask, and get answers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="brutalist-card p-8">
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--bg-peach)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '8px'
                }}
              >
                <FileText size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="heading-md mb-3">1. Upload your PDF</h3>
              <p className="body-md">
                Drag and drop any PDF. We process it in seconds,
                breaking it into searchable chunks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="brutalist-card p-8">
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--bg-mint)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '8px'
                }}
              >
                <Search size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="heading-md mb-3">2. Ask anything</h3>
              <p className="body-md">
                Type your question naturally. Our search understands
                meaning, not just keywords.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="brutalist-card p-8">
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--bg-lavender)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '8px'
                }}
              >
                <MessageSquare size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="heading-md mb-3">3. Get cited answers</h3>
              <p className="body-md">
                Every answer shows exactly where it came from.
                Click to jump to the source.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="brutalist-card p-8">
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--bg-pale-yellow)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '8px'
                }}
              >
                <Zap size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="heading-md mb-3">Fast processing</h3>
              <p className="body-md">
                Most documents are ready in under 30 seconds.
                Large files? Still just a minute or two.
              </p>
            </div>

            <div className="brutalist-card p-8">
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'var(--bg-cream)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '8px'
                }}
              >
                <Shield size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h3 className="heading-md mb-3">Private by default</h3>
              <p className="body-md">
                Your documents are encrypted and never shared.
                Delete anytime, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 py-20" style={{ backgroundColor: 'var(--bg-mint)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="heading-lg mb-4">What people are saying</h2>
            <p className="body-md" style={{ color: 'var(--text-muted)' }}>
              Real feedback from people using Unriddle.
            </p>
          </div>

          {/* Reviews Grid */}
          {isLoadingReviews ? (
            <div className="text-center py-12">
              <p className="body-md">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  rating={review.rating}
                  reviewText={review.review_text}
                  reviewerName={review.reviewer_name}
                  isAnonymous={review.is_anonymous}
                />
              ))}
            </div>
          ) : (
            <div className="brutalist-card p-8 text-center max-w-md mx-auto">
              <p className="body-md mb-4">No reviews yet. Be the first!</p>
            </div>
          )}

          {/* Leave a Review Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-secondary"
            >
              Leave a review
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20" style={{ backgroundColor: 'var(--bg-peach)' }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="brutalist-card p-12 md:p-16 text-center max-w-3xl mx-auto"
            style={{ backgroundColor: 'var(--bg-white)' }}
          >
            <h2 className="heading-lg mb-4">Ready to try it?</h2>
            <p className="body-lg mb-8 max-w-lg mx-auto">
              Start with 50 free queries. Upload your first document
              and see how it works.
            </p>
            <Link href="/login" className="btn-primary inline-flex">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-4 py-12"
        style={{
          backgroundColor: 'var(--bg-cream)',
          borderTop: '2px solid var(--border-dark)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-coral)',
                  border: '2px solid var(--border-dark)',
                  borderRadius: '6px'
                }}
              >
                <FileText className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Unriddle
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/terms"
                className="hover:underline underline-offset-4"
                style={{ color: 'var(--text-body)' }}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:underline underline-offset-4"
                style={{ color: 'var(--text-body)' }}
              >
                Privacy
              </Link>
              <Link
                href="/refund"
                className="hover:underline underline-offset-4"
                style={{ color: 'var(--text-body)' }}
              >
                Refunds
              </Link>
              <Link
                href="/pricing"
                className="hover:underline underline-offset-4"
                style={{ color: 'var(--text-body)' }}
              >
                Pricing
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--text-muted)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Volta Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
