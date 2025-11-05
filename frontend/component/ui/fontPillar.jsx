import { useEffect, useRef } from 'react';

export default function CubeAnimation({ className = '' }) {
  const trayRef = useRef(null);
  const povRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    
    script.onload = () => {
      const { gsap } = window;
      const n = 30;
      const rots = [
        { ry: 270, a: 0.5 },
        { ry: 0, a: 0.85 },
        { ry: 90, a: 0.4 },
        { ry: 180, a: 0.0 }
      ];

      gsap.set(".face", {
        z: 200,
        rotateY: i => rots[i].ry,
        transformOrigin: "50% 50% -201px"
      });

      const tray = trayRef.current;
      const firstDie = tray.querySelector('.die');

      for (let i = 0; i < n; i++) {
        let die = firstDie;
        let cube = die.querySelector('.cube');
        
        if (i > 0) {
          let clone = firstDie.cloneNode(true);
          tray.append(clone);
          cube = clone.querySelector('.cube');
        }

        gsap.timeline({ 
          repeat: -1, 
          yoyo: true, 
          defaults: { ease: 'power3.inOut', duration: 1 } 
        })
          .fromTo(cube, {
            rotateY: -90
          }, {
            rotateY: 90,
            ease: 'power1.inOut',
            duration: 2
          })
          .fromTo(cube.querySelectorAll('.face'), {
            color: (j) => `hsl(${i / n * 75 + 130}, 67%, ${100 * [rots[3].a, rots[0].a, rots[1].a][j]}%)`
          }, {
            color: (j) => `hsl(${i / n * 75 + 130}, 67%, ${100 * [rots[0].a, rots[1].a, rots[2].a][j]}%)`
          }, 0)
          .to(cube.querySelectorAll('.face'), {
            color: (j) => `hsl(${i / n * 75 + 130}, 67%, ${100 * [rots[1].a, rots[2].a, rots[3].a][j]}%)`
          }, 1)
          .progress(i / n);
      }

      gsap.timeline()
        .from('.tray', { yPercent: -3, duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
        .fromTo('.tray', { rotate: -15 }, { rotate: 15, duration: 4, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
        .from('.die', { duration: 0.01, opacity: 0, stagger: { each: -0.05, ease: 'power1.in' } }, 0)
        .to('.tray', { scale: 1.2, duration: 2, ease: 'power3.inOut', yoyo: true, repeat: -1 }, 0);

      const handleResize = () => {
        const h = n * 56;
        gsap.set('.tray', { height: h });
        gsap.set('.pov', { scale: window.innerHeight / h });
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        
        body {
          margin: 0;
          font-family: "Montserrat", sans-serif;
          font-optical-sizing: auto;
          font-weight: 900;
          font-style: normal;
          background: #000;
        }
        
        .pov {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        
        .die {
          width: 400px;
          height: 55px;
          padding-bottom: 9px;
          perspective: 999px;
        }
        
        .cube {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
      `}</style>
      
      <div className={`pov ${className}`} ref={povRef}>
        <div className="tray" ref={trayRef}>
          <div className="die">
            <div className="cube">
              <div className="face" style={{ fontSize: '60px' }}>ONCHAIN</div>
              <div className="face" style={{ fontSize: '58px' }}>AUDIT</div>
              <div className="face" style={{ fontSize: '55px' }}>TRAIL</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}