export interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const API_URL = "/api/reviews";

export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.warn("Backend server not reachable, using fallback data if needed or returning empty");
      return [];
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      console.warn("Response is not JSON, might be HTML error page from server or proxy");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
};

export const submitReview = async (review: {
  name: string;
  role: string;
  content: string;
  rating: number;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error("Failed to submit review");
  }

  return await response.json();
};
