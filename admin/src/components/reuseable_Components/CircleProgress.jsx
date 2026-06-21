import React from "react";

export default function CircleProgress({
  progress = 75,
  size = 50,
  strokeWidth = 6,
  color = "#6870FA",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const dashOffset =
    circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="circle-progress"
    >
      {/* Background Circle */}
      <circle
        // stroke="rgb(21, 30, 49)"
        stroke="#6b39cf"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      {/* Progress Circle */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          transition: "stroke-dashoffset 0.5s",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
    </svg>
  );
}