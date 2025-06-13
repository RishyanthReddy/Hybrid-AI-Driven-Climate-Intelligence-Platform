import React, { useEffect, useRef } from 'react';

interface CSS3DVisualizationProps {
  type: 'energy' | 'climate' | 'city';
  className?: string;
}

const CSS3DVisualization: React.FC<CSS3DVisualizationProps> = ({ type, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderEnergyGrid = () => {
    const nodes = [];
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 200;
      const z = Math.random() * 100;
      const size = 8 + Math.random() * 12;
      const color = Math.random() > 0.5 ? '#4facfe' : '#43e97b';
      
      nodes.push(
        <div
          key={`energy-${i}`}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${50 + x / 6}%`,
            top: `${50 + y / 4}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            transform: `translateZ(${z}px) scale(${1 + z / 200})`,
            zIndex: Math.floor(z),
            opacity: 0.7 + z / 300
          }}
        />
      );
    }
    return nodes;
  };

  const renderClimateHeatmap = () => {
    const tiles = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 8; j++) {
        const x = i * 10;
        const y = j * 12;
        const intensity = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 0.5 + 0.5;
        const hue = 240 - intensity * 120; // Blue to red
        const height = 20 + intensity * 40;
        
        tiles.push(
          <div
            key={`climate-${i}-${j}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: '8%',
              height: '10%',
              backgroundColor: `hsl(${hue}, 70%, 50%)`,
              transform: `translateZ(${height}px) rotateX(45deg)`,
              opacity: 0.8,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '2px'
            }}
          />
        );
      }
    }
    return tiles;
  };

  const renderCityBuildings = () => {
    const buildings = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 60 + 20;
      const height = 30 + Math.random() * 80;
      const width = 15 + Math.random() * 25;
      const color = Math.random() > 0.7 ? '#feca57' : '#74b9ff';
      
      buildings.push(
        <div
          key={`building-${i}`}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: color,
            transform: `translateZ(${height / 2}px) rotateX(60deg)`,
            transformOrigin: 'bottom center',
            opacity: 0.8,
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '2px 2px 0 0'
          }}
        />
      );
    }
    return buildings;
  };

  const renderVisualization = () => {
    switch (type) {
      case 'energy':
        return renderEnergyGrid();
      case 'climate':
        return renderClimateHeatmap();
      case 'city':
        return renderCityBuildings();
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.9) 100%)'
      }}
    >
      {/* 3D Scene Container */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg) rotateY(5deg)',
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        {renderVisualization()}
        
        {/* Ground plane */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            transform: 'translateZ(-50px) rotateX(90deg)',
            opacity: 0.3
          }}
        />
      </div>
      
      {/* Overlay info */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 rounded-lg p-3 text-white text-sm">
          <div className="font-semibold capitalize">{type} Visualization</div>
          <div className="text-white/70">CSS 3D Transform</div>
        </div>
      </div>
      
      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: rotateX(15deg) rotateY(5deg) translateY(0px); }
          50% { transform: rotateX(15deg) rotateY(5deg) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default CSS3DVisualization;
