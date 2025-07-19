// DescriptionBox.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DescriptionBox = () => {
  const { productId } = useParams();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/products/${productId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setDescription(data.product.description || 'No description available.');
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewLoading(true);
      setReviewError('');
      try {
        const res = await fetch(`http://localhost:4000/products/${productId}/reviews`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setReviews(data.reviews || []);
      } catch (err) {
        setReviewError(err.message || 'Failed to load reviews.');
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to submit a review.');
    if (!rating || !comment.trim()) return alert('Please provide a rating and comment.');
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await fetch(`http://localhost:4000/products/${productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          username: user.name,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setReviews(data.reviews);
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="mx-[170px] my-[120px]">
      <div className="flex">
        <div className="flex items-center justify-center text-base font-semibold w-[171px] h-[70px] border border-gray-300">
          Description
        </div>
      </div>
      <div className="flex flex-col gap-[25px] border border-gray-300 p-12 pb-[70px]">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>{description}</p>
        )}
      </div>
      {/* Reviews Section */}
      <div className="flex flex-col gap-4 border border-gray-300 p-8 mt-4">
        <h3 className="text-lg font-bold mb-2">Product Reviews</h3>
        {reviewLoading ? (
          <p>Loading reviews...</p>
        ) : reviewError ? (
          <p className="text-red-500">{reviewError}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.username || 'User'}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="ml-2 text-gray-700">{r.comment}</div>
              </li>
            ))}
          </ul>
        )}
        {/* Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mt-4 flex flex-col gap-2">
            <label className="font-medium">Your Rating:</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-24 border rounded p-1">
              {[5,4,3,2,1].map(val => (
                <option key={val} value={val}>{val} Star{val > 1 ? 's' : ''}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your review..."
              className="border rounded p-2 min-h-[60px]"
              required
            />
            <button type="submit" disabled={reviewLoading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit">
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
