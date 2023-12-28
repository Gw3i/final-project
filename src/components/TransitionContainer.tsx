'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface TransitionContainerProps {
  children: ReactNode;
}

const TransitionContainer: FC<TransitionContainerProps> = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setVisible(entry.isIntersecting);
      });
    });

    const { current } = domRef;

    if (!current) return;

    observer.observe(current);

    return () => observer.unobserve(current);
  }, []);

  return (
    <div ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

export default TransitionContainer;
