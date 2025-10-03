import React from "react";
import "../assets/Customers.css";

const Customers = () => {
  const customers = []; // placeholder

  return (
    <div className="customers-container">
      <h1>Customers</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.customer_id}>
            {customer.name} - {customer.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
