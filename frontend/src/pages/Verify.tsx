import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { hitApi } from "../service/hitApi"; // Importing the hitApi service

const VerifyUser: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const token = query.get("token");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userVerify = async () => {
      if (!token) {
        console.error("No token found in URL.");
        setLoading(false);
        return;
      }

      try {
        const result = await hitApi.patch(
          "/verify-user",
          {}, // Request body is empty for verification
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(result);
        navigate("/login"); // Redirect to login after successful verification
      } catch (error) {
        console.error("Verification failed: ", error);
      } finally {
        setLoading(false);
      }
    };

    userVerify();
  }, [token, navigate]);

  return (
    <div>
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>{token ? "Verification process complete" : "No token provided"}</p>
      )}
    </div>
  );
};

export default VerifyUser;
