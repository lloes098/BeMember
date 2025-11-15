import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Shield, Globe } from 'lucide-react';

interface SplashScreenCardProps {
  onComplete: () => void;
}

export default function SplashScreenCard({ onComplete }: SplashScreenCardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-[#F7F9FC] to-white flex items-center justify-center p-6">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, #3366FF 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 1,
        }}
        className="relative"
        style={{ perspective: 1000 }}
      >
        {/* Card Container */}
        <div className="relative w-[340px] h-[500px]">
          {/* Glow Effect */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-[#3366FF]/30 to-[#2952CC]/30 rounded-3xl blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Card */}
          <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl border border-[#E6E8EB] overflow-hidden">
            {/* Gradient Header */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-[#3366FF] to-[#2952CC]">
              {/* Decorative Circles */}
              <motion.div
                className="absolute top-4 right-4 w-24 h-24 border-2 border-white/20 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 pt-24 px-8 pb-8 h-full flex flex-col">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.3,
                }}
                className="flex justify-center -mt-8"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#3366FF]">
                  <CheckCircle2 className="w-9 h-9 text-[#3366FF]" />
                </div>
              </motion.div>

              {/* Brand Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center text-[#111111] text-4xl mt-6 mb-2"
              >
                BeMember
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-center text-[#1A1A1A]/60 mb-8"
              >
                Your Onchain Identity
              </motion.p>

              {/* Feature Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex items-center justify-center gap-8 mb-8"
              >
                <IconFeature icon={<Zap className="w-5 h-5" />} label="Fast" delay={0} />
                <IconFeature icon={<Shield className="w-5 h-5" />} label="Secure" delay={0.1} />
                <IconFeature icon={<Globe className="w-5 h-5" />} label="Global" delay={0.2} />
              </motion.div>

              {/* Separator */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="h-px bg-gradient-to-r from-transparent via-[#E6E8EB] to-transparent mb-8"
              />

              {/* Bottom Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="mt-auto text-center space-y-3"
              >
                <p className="text-sm text-[#1A1A1A]/50">
                  Powered by Base Sepolia
                </p>
                
                {/* Loading Indicator */}
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 bg-[#3366FF] rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-[#3366FF] rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-[#3366FF] rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* ONCHAIN VERIFIED Badge */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute top-28 right-8"
            >
              <div className="px-3 py-1 bg-[#3366FF] text-white text-xs rounded-full shadow-lg">
                ONCHAIN VERIFIED
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function IconFeature({ 
  icon, 
  label, 
  delay 
}: { 
  icon: React.ReactNode; 
  label: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 1.2 + delay,
      }}
      className="flex flex-col items-center gap-2"
    >
      <div className="w-10 h-10 bg-[#3366FF]/10 rounded-full flex items-center justify-center text-[#3366FF]">
        {icon}
      </div>
      <span className="text-xs text-[#1A1A1A]/60">{label}</span>
    </motion.div>
  );
}
