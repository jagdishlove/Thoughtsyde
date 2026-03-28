"use client";

import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-in' | 'fade-in-up' | 'slide-in-right' | 'scale-in';
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fade-in-up'
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClass = {
    'fade-in': 'opacity-0 transition-opacity duration-700',
    'fade-in-up': 'opacity-0 translate-y-8 transition-all duration-700 ease-out',
    'slide-in-right': 'opacity-0 -translate-x-8 transition-all duration-700 ease-out',
    'scale-in': 'opacity-0 scale-95 transition-all duration-700 ease-out',
  }[animation];

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay = 100 
}: StaggerContainerProps) {
  return (
    <div className={`stagger-children ${className}`} style={{ '--stagger-delay': `${staggerDelay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}

export default AnimatedSection;