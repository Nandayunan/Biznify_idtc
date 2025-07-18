"use client";

import Spline from "@splinetool/react-spline";

export default function BiznifyRobot({
  sidebarOpen,
}: {
  sidebarOpen: boolean;
}) {
  const getTransform = () => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: smaller size and centered
        return "translate(0px, 50px) scale(0.6)";
      } else {
        // Desktop: adjust based on sidebar
        const translateX = sidebarOpen ? "200px" : "90px";
        return `translate(${translateX}, 100px) scale(1)`;
      }
    }
    return "translate(90px, 100px) scale(1)";
  };

  return (
    <Spline
      scene="https://prod.spline.design/y0EnxvXrPRsZpMhP/scene.splinecode"
      className="w-full px-0 py-8 opacity-30"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        transform: getTransform(),
        transformOrigin: "center center",
        transition: "transform 0.3s ease-in-out",
      }}
    />
  );
}
