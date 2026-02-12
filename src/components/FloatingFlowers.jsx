import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";

export default function FloatingFlowers() {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: {
            value: 35,
            density: { enable: true, area: 800 }
          },
          color: { value: ["#ffffff", "#ffd1dc", "#ffecf1"] },
          shape: {
            type: "image",
            image: [
              {
                src: "/petals1.png",
                width: 32,
                height: 32
              },
              {
                src: "/petals2.png",
                width: 32,
                height: 32
              }
            ]
          },
          opacity: {
            value: 0.8,
            random: true
          },
          size: {
            value: { min: 12, max: 22 }
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "bottom",
            straight: false,
            outModes: { default: "out" }
          }
        }
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2
      }}
    />
  );
}