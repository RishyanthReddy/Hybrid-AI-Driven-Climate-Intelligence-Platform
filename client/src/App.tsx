import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import scrollPrevention from "./utils/scrollPrevention";
import EnhancedMainDashboard from "./components/Dashboard/EnhancedMainDashboard";
import Sidebar from "./components/Navigation/Sidebar";
import Header from "./components/Navigation/Header";
import CustomScrollbar from "./components/Navigation/CustomScrollbar";
// import ScrollProgress from "./components/Navigation/ScrollProgress";

import CommunityVulnerability from "./components/EnergyAccess/CommunityVulnerability";
import EnergyDistribution from "./components/EnergyAccess/EnergyDistribution";
import ActionTracker from "./components/ClimateAction/ActionTracker";
import ProgressMonitor from "./components/ClimateAction/ProgressMonitor";
import Scene3D from "./components/3D/Scene3D";
import NotFound from "./pages/not-found";

// Sustainability Components
import JobMarketplaceDashboard from "./components/Sustainability/JobMarketplaceDashboard";
import CulturalHeritageDashboard from "./components/Sustainability/CulturalHeritageDashboard";
import EconomicEquityDashboard from "./components/Sustainability/EconomicEquityDashboard";
import { useClimateData } from "./lib/stores/useClimateData";
import { useEnergyData } from "./lib/stores/useEnergyData";
import { use3DScene } from "./lib/stores/use3DScene";

// Loading component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md z-50">
    <div className="glass p-8 rounded-2xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-400/30 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-white/80 text-lg font-medium">Loading Climate AI Platform...</p>
      </div>
    </div>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 to-purple-900/90 backdrop-blur-md z-50">
          <div className="glass p-8 rounded-2xl max-w-md mx-4">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
              <h2 className="text-xl font-bold text-white mb-2">System Error</h2>
              <p className="text-white/80 mb-4">
                An unexpected error occurred in the Climate AI platform.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { show3D, toggle3D } = use3DScene();
  const { initializeClimateData } = useClimateData();
  const { initializeEnergyData } = useEnergyData();

  useEffect(() => {
    // Initialize data stores
    const initializeApp = async () => {
      try {
        await Promise.all([
          initializeClimateData(),
          initializeEnergyData(),
        ]);

        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [initializeClimateData, initializeEnergyData]);

  // Initialize scroll prevention only for 3D canvas
  useEffect(() => {
    // Only prevent scrolling on 3D canvas, not the entire page
    if (show3D) {
      scrollPrevention.preventAllCanvasScrolling();
    }

    // Cleanup on unmount
    return () => {
      scrollPrevention.cleanup();
    };
  }, [show3D]);

  // Ultimate scroll prevention system
  useEffect(() => {
    // Add CSS-based scroll prevention
    const style = document.createElement('style');
    style.textContent = `
      canvas {
        touch-action: none !important;
        overscroll-behavior: none !important;
        overflow: hidden !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      canvas::-webkit-scrollbar {
        display: none !important;
      }

      .r3f canvas {
        touch-action: none !important;
        overscroll-behavior: none !important;
      }

      [data-r3f-canvas] {
        touch-action: none !important;
        overscroll-behavior: none !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Nuclear option: prevent ALL scroll events on canvas elements
    const preventAllScrolling = (e: Event) => {
      const target = e.target as HTMLElement;

      // Check if the event is on or within a canvas element
      if (target && (
        target.tagName === 'CANVAS' ||
        target.closest('canvas') ||
        target.closest('[data-r3f-canvas]') ||
        target.classList.contains('r3f-canvas') ||
        target.closest('.r3f') ||
        target.closest('[data-testid="canvas"]') ||
        target.closest('.three-canvas') ||
        target.closest('.webgl-canvas') ||
        target.parentElement?.tagName === 'CANVAS' ||
        target.closest('.fixed.inset-0.z-0') ||
        // Additional checks for React Three Fiber
        target.closest('[data-engine]') ||
        target.closest('.three-js-canvas')
      )) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Comprehensive event prevention
    const allScrollEvents = [
      'wheel', 'mousewheel', 'DOMMouseScroll', 'scroll',
      'touchmove', 'touchstart', 'touchend',
      'gesturestart', 'gesturechange', 'gestureend',
      'pointerdown', 'pointermove', 'pointerup'
    ];

    // Add to document with highest priority
    allScrollEvents.forEach(eventType => {
      document.addEventListener(eventType, preventAllScrolling, {
        passive: false,
        capture: true
      });
    });

    // Also prevent on window
    allScrollEvents.forEach(eventType => {
      window.addEventListener(eventType, preventAllScrolling, {
        passive: false,
        capture: true
      });
    });

    // Additional body-level prevention
    const originalBodyStyle = {
      touchAction: document.body.style.touchAction,
      overscrollBehavior: document.body.style.overscrollBehavior
    };

    return () => {
      // Remove style
      document.head.removeChild(style);

      // Remove event listeners
      allScrollEvents.forEach(eventType => {
        document.removeEventListener(eventType, preventAllScrolling, true);
        window.removeEventListener(eventType, preventAllScrolling, true);
      });

      // Restore body styles
      document.body.style.touchAction = originalBodyStyle.touchAction;
      document.body.style.overscrollBehavior = originalBodyStyle.overscrollBehavior;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* 3D Background Scene */}
        <AnimatePresence>
          {show3D && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-0"
              style={{
                touchAction: 'none',
                overscrollBehavior: 'none',
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onScroll={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Canvas
                camera={{
                  position: [0, 5, 15],
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  alpha: true
                }}
                dpr={[1, 2]}
                style={{
                  width: '100vw',
                  height: '100vh',
                  pointerEvents: 'none',
                  touchAction: 'none',
                  overscrollBehavior: 'none',
                  overflow: 'hidden',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
                onCreated={(state) => {
                  // Apply scroll prevention to the canvas element
                  const canvas = state.gl.domElement;
                  scrollPrevention.preventScrolling(canvas);

                  // Nuclear scroll prevention
                  const preventAll = (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                  };

                  // Apply all possible scroll-related event prevention
                  const allEvents = [
                    'wheel', 'mousewheel', 'DOMMouseScroll', 'scroll',
                    'touchmove', 'touchstart', 'touchend',
                    'gesturestart', 'gesturechange', 'gestureend',
                    'pointerdown', 'pointermove', 'pointerup',
                    'MSPointerDown', 'MSPointerMove', 'MSPointerUp'
                  ];

                  allEvents.forEach(eventType => {
                    canvas.addEventListener(eventType, preventAll, { passive: false, capture: true });
                  });

                  // Set canvas attributes for maximum scroll prevention
                  canvas.setAttribute('data-r3f-canvas', 'true');
                  canvas.style.touchAction = 'none';
                  canvas.style.overscrollBehavior = 'none';
                  canvas.style.overflow = 'hidden';
                  canvas.style.userSelect = 'none';
                  (canvas.style as any).webkitUserSelect = 'none';
                  (canvas.style as any).webkitTouchCallout = 'none';
                  (canvas.style as any).webkitTapHighlightColor = 'transparent';

                  // Prevent context menu
                  canvas.addEventListener('contextmenu', preventAll, { passive: false });

                  // Prevent drag
                  canvas.addEventListener('dragstart', preventAll, { passive: false });
                  canvas.addEventListener('drag', preventAll, { passive: false });
                  canvas.addEventListener('dragend', preventAll, { passive: false });
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onScroll={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Suspense fallback={null}>
                  <Scene3D />
                </Suspense>
                {import.meta.env.DEV && <Stats />}
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout */}
        <div className="relative z-10 flex min-h-screen">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full z-30"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'ml-80' : 'ml-0'
          }`}>
            {/* Header */}
            <Header
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onToggle3D={toggle3D}
              show3D={show3D}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{
              scrollBehavior: 'smooth',
              overscrollBehavior: 'contain'
            }}>
              <Routes>
                <Route path="/" element={<EnhancedMainDashboard />} />
                <Route path="/dashboard" element={<EnhancedMainDashboard />} />
                <Route path="/energy" element={<EnergyDistribution />} />
                <Route path="/energy/vulnerability" element={<CommunityVulnerability />} />
                <Route path="/energy/distribution" element={<EnergyDistribution />} />
                <Route path="/climate" element={<ActionTracker />} />
                <Route path="/climate/actions" element={<ActionTracker />} />
                <Route path="/climate/progress" element={<ProgressMonitor />} />

                {/* Sustainability Routes */}
                <Route path="/sustainability" element={<JobMarketplaceDashboard />} />
                <Route path="/sustainability/jobs" element={<JobMarketplaceDashboard />} />
                <Route path="/sustainability/cultural" element={<CulturalHeritageDashboard />} />
                <Route path="/sustainability/equity" element={<EconomicEquityDashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Extra content to ensure scrolling */}
              <div className="h-96 opacity-0 pointer-events-none" aria-hidden="true"></div>
            </main>
          </div>
        </div>

        {/* Global Overlay for Glassmorphism Effects */}
        <div className="fixed inset-0 pointer-events-none z-5 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>

        {/* Custom Scrollbar */}
        <CustomScrollbar />

        {/* Scroll Progress Indicator - Temporarily disabled */}
        {/* <ScrollProgress /> */}
      </div>
    </ErrorBoundary>
  );
}

export default App;
