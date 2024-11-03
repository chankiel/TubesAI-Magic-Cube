import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useEffect } from "react";

const Particlebg = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  useEffect(() => {
    const tsparticles = document.getElementById("tsparticles");
    tsparticles.style.height = `${document.documentElement.scrollHeight}px`;
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: false,
        background: {
          image: " linear-gradient(180deg, #000d0d 0%, #007373 100%)",
        },
        particles: {
          number: {
            value: 45,
            density: {
              enable: true,
              value_area: 700,
            },
          },
          color: {
            value: "#005c5c",
          },
          shape: {
            type: "square",
            stroke: {
              width: 0,
              color: "#003b3b",
            },
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: false,
              speed: 25,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 34,
            random: true,
            anim: {
              enable: false,
              speed: 25,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: false,
            distance: 300,
            color: "#ffffff",
            opacity: 0,
            width: 0,
          },
          move: {
            enable: true,
            speed: 3,
            direction: "outside",
            straight: true,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 900,
              rotateY: 1500,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
              mode: "repulse",
            },
            onclick: {
              enable: false,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 800,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 790,
              size: 79,
              duration: 2,
              opacity: 0.8,
              speed: 3,
            },
            repulse: {
              distance: 400,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
};

export default Particlebg;
