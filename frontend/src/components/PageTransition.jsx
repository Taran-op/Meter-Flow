import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState('enter-active');
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key !== prevKey.current) {
      // Start exit animation
      setPhase('exit-active');

      const timer = setTimeout(() => {
        // After exit, swap content & start enter
        prevKey.current = location.key;
        setDisplayChildren(children);
        setPhase('enter');

        // Trigger enter-active on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase('enter-active');
          });
        });
      }, 250); // matches exit duration

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [location.key, children]);

  const styles = {
    enter: { opacity: 0, transform: 'translateY(16px) scale(0.99)' },
    'enter-active': {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
      transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    'exit-active': {
      opacity: 0,
      transform: 'translateY(-12px) scale(0.99)',
      transition: 'opacity 0.25s ease-in, transform 0.25s ease-in',
    },
  };

  return (
    <div style={{ ...styles[phase], willChange: 'opacity, transform' }}>
      {displayChildren}
    </div>
  );
}

export default PageTransition;
