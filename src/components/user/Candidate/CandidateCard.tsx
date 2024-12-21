import React from "react";

interface CandidateCardProps {
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string; // e.g., "Selected", "In Progress", "Rejected"
  onClick?: () => void; // Optional for further actions like navigating to detailed profile
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  email,
  phone,
  country,
  status,
  onClick,
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm cursor-pointer hover:bg-gray-100"onClick={onClick}>

      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">Country: {country}</p>
      <p className="text-sm text-gray-500">Status: {status}</p>
      <div className="mt-2 text-sm text-gray-500">
        <p>Email: {email}</p>
        <p>Phone: {phone}</p>
      </div>
      
    </div>
  );
};

export default CandidateCard;
