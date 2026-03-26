import React from "react";

const SkeletonLoader = ({ type = "card", count = 1, isDarkMode = true }) => {
  const theme = {
    card: isDarkMode ? "#1F2937" : "#F3F4F6",
    line: isDarkMode ? "#1F2937" : "#E5E7EB",
  };

  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  if (type === "card") {
    return (
      <>
        <style>{pulseKeyframes}</style>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {Array(count)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: theme.card,
                  borderRadius: "16px",
                  padding: "24px",
                  border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    width: "40%",
                    height: "12px",
                    backgroundColor: isDarkMode ? "#374151" : "#D1D5DB",
                    borderRadius: "4px",
                    marginBottom: "16px",
                  }}
                />
                <div
                  style={{
                    width: "60%",
                    height: "28px",
                    backgroundColor: isDarkMode ? "#374151" : "#D1D5DB",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
                <div
                  style={{
                    width: "80%",
                    height: "10px",
                    backgroundColor: isDarkMode ? "#374151" : "#D1D5DB",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
        </div>
      </>
    );
  }

  if (type === "chart") {
    return (
      <>
        <style>{pulseKeyframes}</style>
        <div
          style={{
            backgroundColor: theme.card,
            borderRadius: "20px",
            padding: "28px",
            border: `1px solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
            animation: "pulse 1.5s ease-in-out infinite",
            height: "320px",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "20px",
              backgroundColor: isDarkMode ? "#374151" : "#D1D5DB",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          />
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: isDarkMode ? "#374151" : "#D1D5DB",
              borderRadius: "12px",
            }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Array(count)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              style={{
                height: "60px",
                backgroundColor: theme.line,
                borderRadius: "12px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
