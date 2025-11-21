import { motion } from 'framer-motion'

interface AnimatedMenuIconProps {
  isOpen: boolean
}

export const AnimatedMenuIcon = ({ isOpen }: AnimatedMenuIconProps) => {
  const transition = {
    duration: 0.4,
    ease: [0.65, 0, 0.35, 1], // Custom cubic-bezier for smooth motion
  }

  return (
    <div className="w-6 h-6 flex items-center justify-center">
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
      >
        {/* Top line */}
        <motion.path
          d="M3 6h18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: {
              d: "M3 6h18",
              rotate: 0,
            },
            open: {
              d: "M6 6l12 12",
              rotate: 0,
            },
          }}
          transition={transition}
        />

        {/* Middle line */}
        <motion.path
          d="M3 12h18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: {
              opacity: 1,
              x: 0,
            },
            open: {
              opacity: 0,
              x: -20,
            },
          }}
          transition={{ ...transition, duration: 0.2 }}
        />

        {/* Bottom line */}
        <motion.path
          d="M3 18h18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: {
              d: "M3 18h18",
              rotate: 0,
            },
            open: {
              d: "M6 18l12-12",
              rotate: 0,
            },
          }}
          transition={transition}
        />
      </motion.svg>
    </div>
  )
}
