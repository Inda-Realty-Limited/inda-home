import React from "react";

export default function instantConfirm() {
  return (
    <div>
      <nav></nav>
      <div>
        <h1>Your request has been received!</h1>
        <p>
          Thanks for choosing <span>Inda Instant Report.</span>
        </p>
        <p>Our verification team will now:</p>
        <div>
          <p>1. Review your documents & details.</p>
          <p>
            2. Run legal checks across title, consent, zoning, litigation and
            survey.
          </p>
          <p>
            3. Deliver your report within 48 working hours{" "}
            <span>(for Deep Dive) or 7 days (for Deeper Dive)</span>
          </p>
        </div>
        <div>
          <h1>Status Box</h1>
          <div>
            <span>Order ID: </span>
            <span></span>
          </div>
          <div>
            <span>Product </span>
            <span>Instant Report</span>
          </div>
          <div>
            <span>Expected Delivery: </span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
