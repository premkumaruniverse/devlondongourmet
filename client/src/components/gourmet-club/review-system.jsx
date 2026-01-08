import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown, Flag, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";

const ReviewSystem = ({ eventId, clubId, hostId, userHasBooked }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: {
      overall: 5,
      food: 5,
      atmosphere: 5,
      hospitality: 5,
      value: 5,
    },
    comment: "",
    highlights: [],
    wouldRecommend: true,
    images: [],
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [eventId, clubId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/event/${eventId}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!userHasBooked) {
      alert("You must have attended this event to leave a review");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          clubId,
          hostId,
          ...reviewData,
        }),
      });

      if (response.ok) {
        setShowReviewForm(false);
        fetchReviews();
        setReviewData({
          rating: {
            overall: 5,
            food: 5,
            atmosphere: 5,
            hospitality: 5,
            value: 5,
          },
          comment: "",
          highlights: [],
          wouldRecommend: true,
          images: [],
        });
        alert("Review submitted successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !reviewData.highlights.includes(highlightInput.trim())) {
      setReviewData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (highlight) => {
    setReviewData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== highlight),
    }));
  };

  const handleRatingChange = (category, value) => {
    setReviewData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: value,
      },
    }));
  };

  const handleHelpfulClick = async (reviewId, isHelpful) => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHelpful }),
      });

      // Update local state
      setReviews(prev => prev.map(review => 
        review._id === reviewId
          ? { ...review, helpful: review.helpful + (isHelpful ? 1 : -1) }
          : review
      ));
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!confirm("Are you sure you want to report this review?")) return;

    try {
      await fetch(`/api/reviews/${reviewId}/report`, {
        method: "POST",
      });

      alert("Review reported successfully");
    } catch (error) {
      console.error("Error reporting review:", error);
      alert("Error reporting review");
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingInput = (category, label) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 ${
                star <= reviewData.rating[category]
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Guest Reviews</span>
            {userHasBooked && (
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Rate Your Experience</h3>
                      {renderRatingInput("overall", "Overall Experience")}
                      {renderRatingInput("food", "Food Quality")}
                      {renderRatingInput("atmosphere", "Atmosphere")}
                      {renderRatingInput("hospitality", "Hospitality")}
                      {renderRatingInput("value", "Value for Money")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <Textarea
                        value={reviewData.comment}
                        onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with other guests..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Highlights
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          placeholder="Add a highlight..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
                        />
                        <Button type="button" onClick={handleAddHighlight}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reviewData.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            {highlight}
                            <button
                              type="button"
                              onClick={() => handleRemoveHighlight(highlight)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="wouldRecommend"
                        checked={reviewData.wouldRecommend}
                        onChange={(e) => setReviewData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="wouldRecommend" className="text-sm">
                        I would recommend this experience to others
                      </label>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submitting || !reviewData.comment.trim()}
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={review.user?.avatar} />
                        <AvatarFallback>
                          {review.user?.userName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.user?.userName}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          {renderStars(review.rating?.overall, "w-3 h-3")}
                          <span>{formatDate(review.createdAt)}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleHelpfulClick(review._id, true)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful || 0}</span>
                      </button>
                      <button
                        onClick={() => handleReportReview(review._id)}
                        className="text-sm text-gray-600 hover:text-red-600"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700">{review.comment}</p>

                  {review.highlights && review.highlights.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-600 mb-2">Highlights:</div>
                      <div className="flex flex-wrap gap-2">
                        {review.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.rating && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Food:</span>
                        {renderStars(review.rating.food, "w-3 h-3")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Atmosphere:</span>
                        {renderStars(review.rating.atmosphere, "w-3 h-3")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hospitality:</span>
                        {renderStars(review.rating.hospitality, "w-3 h-3")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Value:</span>
                        {renderStars(review.rating.value, "w-3 h-3")}
                      </div>
                      <div className="flex items-center">
                        {review.wouldRecommend ? (
                          <span className="text-green-600 flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Recommended
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <ThumbsDown className="w-3 h-3 mr-1" />
                            Not Recommended
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {review.response && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                        <span className="font-medium text-blue-900">Host Response</span>
                        <span className="text-sm text-blue-700">
                          {formatDate(review.response.respondedAt)}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.response.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Be the first to share your experience!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust & Safety Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Trust & Safety Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Review Guidelines</h4>
              <ul className="text-sm space-y-1">
                <li>• Only leave reviews for events you've actually attended</li>
                <li>• Be honest, fair, and constructive in your feedback</li>
                <li>• Focus on the experience, not personal opinions about hosts</li>
                <li>• Include specific details that would help other guests</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Prohibited Content</h4>
              <ul className="text-sm space-y-1">
                <li>• Hate speech, discrimination, or personal attacks</li>
                <li>• False or misleading information</li>
                <li>• Personal contact information or private details</li>
                <li>• Spam or promotional content</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Report a Review</h4>
              <p className="text-sm">
                If you see a review that violates our guidelines, please report it. 
                Our team will review it within 24 hours and take appropriate action.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSystem;
