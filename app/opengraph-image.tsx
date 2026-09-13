import { ImageResponse } from "next/og";

export const alt = "Rashad Shaquille Taofik — Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#04060a",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "300px",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            backgroundColor: "rgba(6, 182, 212, 0.2)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-50px",
            width: "500px",
            height: "400px",
            borderRadius: "50%",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            filter: "blur(140px)",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#22d3ee",
                boxShadow: "0 0 16px #22d3ee",
              }}
            />
            <span
              style={{
                color: "#f8fafc",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              RASHAD.IO
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              backgroundColor: "rgba(34, 211, 238, 0.08)",
              color: "#67e8f9",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            UNIKOM • INFORMATICS
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Rashad Shaquille Taofik
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              maxWidth: "850px",
              lineHeight: 1.4,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Informatics Engineering Student &amp; AI Enthusiast. Integrating software
            logic, data-driven solutions, and network infrastructure.
          </p>

          {/* Skill Badges */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            {["Data Science", "Python / NumPy", "Web Development", "Cisco Networking", "Generative AI"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#e2e8f0",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer Contact Watermark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              fontWeight: 500,
            }}
          >
            ✉️ rashadshaq17@gmail.com
          </span>
          <span
            style={{
              color: "#67e8f9",
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            github.com/rasatshq
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
