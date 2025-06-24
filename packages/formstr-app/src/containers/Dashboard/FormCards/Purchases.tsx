import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosInstance";
import { useProfileContext } from "../../../hooks/useProfileContext";
import { StoredForm } from "./types";

export const Purchases: React.FC = () => {
  const [purchasedForms, setPurchasedForms] = useState<StoredForm[]>([]);
  const { pubkey } = useProfileContext();

  useEffect(() => {
    if (pubkey) {
      fetchPurchasedForms();
    }
  }, [pubkey]);

  const fetchPurchasedForms = async () => {
    try {
      const response = await axios.get<StoredForm[]>("/api/forms", {
        params: { owner: pubkey },
      });
      setPurchasedForms(response.data);
    } catch (error) {
      console.error("Error fetching purchased forms:", error);
    }
  };

  if (purchasedForms.length === 0) {
    return <div>No purchases found.</div>;
  }

  return (
    <div>
      {purchasedForms.map((form) => (
        <div key={form.id} className="purchase-card">
          <h3>{form.slug}</h3>
          <p>Identifier: {form.identifier}</p>
          <p>Owner: {form.owner}</p>
          <p>
            Expiration Date:{" "}
            {new Date(form.expirationDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
