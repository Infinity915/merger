import { motion, AnimatePresence } from 'framer-motion';

export default function SkillRadar({ suggestions = [] }) {
  const primaryColor = "rgba(6, 182, 212, 0.4)"; 

  return (
    <div className="relative w-full h-[550px] flex items-center justify-center bg-[#050505]/60 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
      
      {/* 1. Scanning Beam Animation */}
      <motion.div
        className="absolute w-full h-full origin-center opacity-10"
        style={{ background: `conic-gradient(from 0deg at 50% 50%, ${primaryColor} 0deg, transparent 50deg)` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* 2. Background Orbital Rings */}
      {[220, 360, 500].map((size) => (
        <div 
          key={size} 
          className="absolute border border-white/[0.03] rounded-full pointer-events-none" 
          style={{ width: size, height: size }} 
        />
      ))}

      {/* 3. Central User Node */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-30 w-24 h-24 rounded-full p-[1px] bg-gradient-to-b from-cyan-500/30 to-transparent border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)]"
      >
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <span className="text-[10px] font-medium text-cyan-400 tracking-[0.3em] uppercase">YOU</span>
        </div>
      </motion.div>

      {/* 4. Orbiting Peer Nodes */}
      <AnimatePresence>
        {suggestions.map((peer, i) => {
          const angle = (360 / Math.max(suggestions.length, 1)) * i;
          
          return (
            <motion.div
              key={peer.user?.id || i}
              className="absolute z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: angle }}
              transition={{ type: "spring", stiffness: 35, delay: i * 0.15 }}
              style={{ width: 380 }}
            >
              <motion.div 
                style={{ rotate: -angle }} 
                whileHover={{ y: -8, scale: 1.1 }}
                className="bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-all shadow-xl group"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  {peer.user?.fullName ? peer.user.fullName[0] : '?'}
                </div>
                <div className="text-left text-white">
                  <p className="text-[12px] font-semibold leading-tight">
                    {peer.user?.fullName || 'Searching...'}
                  </p>
                  <p className="text-[10px] text-cyan-400/70 font-medium mt-1">
                    {peer.score}% Match • {peer.user?.collegeName || 'Global Hub'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
