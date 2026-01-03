import React from 'react';

const BiometricOverlay = ({ landmarks = [], type = "gait" }) => {
    if (!landmarks || landmarks.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            <svg className="w-full h-full">
                {/* Draw Skeleton Connections (Simulated for demo) */}
                {type === "gait" && landmarks.map((lm, i) => (
                    <circle
                        key={i}
                        cx={`${lm[0] * 100}%`}
                        cy={`${lm[1] * 100}%`}
                        r="3"
                        className="fill-cyan-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    />
                ))}

                {/* Connecting Lines for cinematic effect */}
                {type === "gait" && landmarks.map((lm, i) => {
                    if (i === 0) return null;
                    const prev = landmarks[i - 1];
                    return (
                        <line
                            key={`line-${i}`}
                            x1={`${prev[0] * 100}%`}
                            y1={`${prev[1] * 100}%`}
                            x2={`${lm[0] * 100}%`}
                            y2={`${lm[1] * 100}%`}
                            className="stroke-cyan-500/30 stroke-1 animate-pulse"
                        />
                    );
                })}
            </svg>

            {/* Bio-Data Tags */}
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-cyan-400 space-y-1 bg-black/40 p-2 rounded">
                <p>SIG_HASH: 0x82...a41</p>
                <p>POSTURE: 92.4% MATCH</p>
                <p>GAIT: VERIFIED</p>
            </div>
        </div>
    );
};

export default BiometricOverlay;
