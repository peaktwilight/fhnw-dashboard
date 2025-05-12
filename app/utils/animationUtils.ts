/**
 * Shared animation variants for consistent animations across components
 */

import { Variants } from 'framer-motion';

// Ease curves
export const easings = {
  // Smooth ease out - good for entrances
  easeOut: [0.16, 1, 0.3, 1],
  // Smooth ease in-out - good for hover states
  easeInOut: [0.83, 0, 0.17, 1],
  // Snappy ease out - good for UI elements that need to feel responsive
  easeOutSnappy: [0.22, 1, 0.36, 1],
  // Gentle bounce - subtle bounce at the end of animations
  gentleBounce: [0.175, 0.885, 0.32, 1.275],
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 10,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
      when: "beforeChildren",
      staggerChildren: 0.07,
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: easings.easeInOut,
    }
  }
};

// Container variants - for parent elements with children
export const containerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: easings.easeOut,
      duration: 0.4,
    }
  }
};

// Section variants - for major page sections
export const sectionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 15 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easings.easeOut,
    }
  }
};

// Card variants - for cards and list items
export const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.97 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    }
  },
  hover: {
    y: -6,
    scale: 1.03,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2,
      ease: easings.easeInOut,
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: easings.easeInOut,
    }
  }
};

// Button variants - for buttons and interactive elements
export const buttonVariants: Variants = {
  initial: { 
    scale: 1 
  },
  hover: { 
    scale: 1.04,
    transition: {
      duration: 0.2,
      ease: easings.easeInOut,
    }
  },
  tap: { 
    scale: 0.96,
    transition: {
      duration: 0.1,
      ease: easings.easeInOut,
    }
  }
};

// Icon variants - for icons with hover effects
export const iconVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.85, 
    rotate: -5 
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.35,
      ease: easings.gentleBounce,
    }
  },
  hover: {
    scale: 1.15,
    rotate: [0, -5, 5, 0],
    transition: { 
      duration: 0.4,
      ease: easings.gentleBounce,
    }
  }
};

// Loading skeleton animation
export const shimmerAnimation = {
  initial: {
    backgroundPosition: "-200% 0",
  },
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear",
    },
  },
};

// Fade in up animation for staggered list items
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
      ease: easings.easeOut,
    }
  })
};

// Bounce animation for attention-grabbing elements
export const bounceAnimation: Variants = {
  initial: { 
    scale: 1 
  },
  animate: {
    scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
    transition: {
      duration: 0.6,
      ease: easings.gentleBounce,
    }
  }
};

// Gradient animation for backgrounds
export const gradientAnimation = {
  initial: { 
    backgroundPosition: "0% 50%" 
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    }
  }
};

// Page transition for route changes
export const routeChangeTransition = {
  initial: {
    x: 20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    }
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeInOut,
    }
  }
};