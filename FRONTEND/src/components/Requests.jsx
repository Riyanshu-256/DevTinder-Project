import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setRequests, removeRequest } from "../utils/requestSlice";
import Skeleton from "./Skeleton";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch received requests
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/request/received`, {
          withCredentials: true,
        });

        dispatch(setRequests(res.data.data || []));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to fetch requests");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch, user, navigate]);

  // Accept / Reject handler
  const handleReview = async (status, requestId) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId));
      console.log(`Request ${status}`);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Action failed");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton variant="title" className="h-8 w-64" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-modern p-6">
              <div className="flex gap-6">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="title" className="h-6 w-48" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card-modern p-12 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-2xl font-bold mb-2">No Connection Requests</h2>
          <p className="text-gray-400">You don’t have any pending requests</p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {requests.map((req) => {
          const requestUser = req.fromUserId;
          if (!requestUser) return null;

          const isLoading = actionLoading === req._id;

          return (
            <div
              key={req._id}
              className="card-modern p-6 flex flex-col sm:flex-row gap-6"
            >
              <img
                src={requestUser.photoUrl || DEFAULT_AVATAR}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />

              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold">
                  {requestUser.firstName} {requestUser.lastName}
                </h2>

                {(requestUser.age || requestUser.gender) && (
                  <p className="text-sm text-gray-400">
                    {requestUser.age && `${requestUser.age} years`}
                    {requestUser.age && requestUser.gender && " • "}
                    {requestUser.gender}
                  </p>
                )}

                {requestUser.about && (
                  <p className="text-sm text-gray-300">{requestUser.about}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  disabled={isLoading}
                  onClick={() => handleReview("accepted", req._id)}
                  className="btn-modern"
                >
                  ✓ Accept
                </button>

                <button
                  disabled={isLoading}
                  onClick={() => handleReview("rejected", req._id)}
                  className="btn-modern-outline"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
