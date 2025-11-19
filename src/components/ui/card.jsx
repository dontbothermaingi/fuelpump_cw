import React from "react";

function Card({
  title,
  description,
  children, // for custom action buttons or extra content
  className = "", // allows additional styling
}) {
  return (
    <div
      style={{ fontFamily: "IT Regular" }}
      className={`text-white shadow-md rounded-lg overflow-hidden ${className}`}
    >
      <div className="p-4">
        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        {description && <p className=" mb-4">{description}</p>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

export default Card;
