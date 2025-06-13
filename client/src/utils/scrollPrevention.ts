/**
 * Comprehensive scroll prevention utility for canvas elements
 * Prevents all forms of scrolling, zooming, and viewport manipulation
 */

interface ScrollPreventionData {
  originalStyles: Record<string, string>;
  events: string[];
  preventEvent: (e: Event) => boolean;
}

declare global {
  interface HTMLElement {
    _scrollPreventionData?: ScrollPreventionData;
  }
}

class ScrollPrevention {
  private preventedElements = new Set<HTMLElement>();
  private originalViewport: string | null = null;
  private isLocked = false;
  private globalPreventFunction?: (e: Event) => void;

  /**
   * Apply comprehensive scroll prevention to an element
   */
  preventScrolling(element: HTMLElement): void {
    if (!element || this.preventedElements.has(element)) return;

    // Store original styles
    const originalStyles = {
      touchAction: element.style.touchAction,
      userSelect: element.style.userSelect,
      overflow: element.style.overflow,
      position: element.style.position
    };

    // Apply prevention styles
    element.style.touchAction = 'none';
    element.style.userSelect = 'none';
    element.style.overflow = 'hidden';
    (element.style as any).webkitUserSelect = 'none';
    (element.style as any).mozUserSelect = 'none';
    (element.style as any).msUserSelect = 'none';
    (element.style as any).webkitTouchCallout = 'none';
    (element.style as any).webkitTapHighlightColor = 'transparent';

    // Prevent all scroll-related events
    const preventEvent = (e: Event): boolean => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const events = [
      'wheel',
      'mousewheel',
      'DOMMouseScroll',
      'touchstart',
      'touchmove',
      'touchend',
      'gesturestart',
      'gesturechange',
      'gestureend',
      'scroll'
    ];

    events.forEach(eventType => {
      element.addEventListener(eventType, preventEvent, { 
        passive: false, 
        capture: true 
      });
    });

    // Store cleanup data
    element._scrollPreventionData = {
      originalStyles,
      events,
      preventEvent
    };

    this.preventedElements.add(element);
  }

  /**
   * Remove scroll prevention from an element
   */
  allowScrolling(element: HTMLElement): void {
    if (!element || !this.preventedElements.has(element)) return;

    const data = element._scrollPreventionData;
    if (!data) return;

    // Restore original styles
    Object.keys(data.originalStyles).forEach(prop => {
      if (data.originalStyles[prop] !== undefined) {
        (element.style as any)[prop] = data.originalStyles[prop];
      } else {
        element.style.removeProperty(prop);
      }
    });

    // Remove event listeners
    data.events.forEach(eventType => {
      element.removeEventListener(eventType, data.preventEvent, { 
        capture: true 
      });
    });

    // Clean up
    delete element._scrollPreventionData;
    this.preventedElements.delete(element);
  }

  /**
   * Lock the entire viewport to prevent any scrolling
   */
  lockViewport(): void {
    if (this.isLocked) return;

    // Store original viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewportMeta) {
      this.originalViewport = viewportMeta.content;
    }

    // Set restrictive viewport
    this.setViewportMeta('width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Add global event prevention
    const preventGlobalScroll = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'CANVAS' || target.closest('canvas'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('wheel', preventGlobalScroll, { passive: false });
    document.addEventListener('touchmove', preventGlobalScroll, { passive: false });
    document.addEventListener('gesturestart', preventGlobalScroll, { passive: false });
    document.addEventListener('gesturechange', preventGlobalScroll, { passive: false });

    this.globalPreventFunction = preventGlobalScroll;
    this.isLocked = true;
  }

  /**
   * Unlock the viewport
   */
  unlockViewport(): void {
    if (!this.isLocked) return;

    // Restore viewport
    if (this.originalViewport) {
      this.setViewportMeta(this.originalViewport);
    }

    // Restore body styles
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';

    // Remove global event listeners
    if (this.globalPreventFunction) {
      document.removeEventListener('wheel', this.globalPreventFunction);
      document.removeEventListener('touchmove', this.globalPreventFunction);
      document.removeEventListener('gesturestart', this.globalPreventFunction);
      document.removeEventListener('gesturechange', this.globalPreventFunction);
    }

    this.isLocked = false;
  }

  /**
   * Set viewport meta tag content
   */
  setViewportMeta(content: string): void {
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = content;
  }

  /**
   * Apply prevention to all canvas elements on the page
   */
  preventAllCanvasScrolling(): void {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => this.preventScrolling(canvas as HTMLCanvasElement));
  }

  /**
   * Clean up all prevention
   */
  cleanup(): void {
    // Remove prevention from all elements
    this.preventedElements.forEach(element => {
      this.allowScrolling(element);
    });

    // Unlock viewport
    this.unlockViewport();
  }
}

// Create global instance
const scrollPrevention = new ScrollPrevention();

// Auto-apply to canvas elements when they're added to DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === 'CANVAS') {
          scrollPrevention.preventScrolling(element as HTMLCanvasElement);
        }
        // Also check children
        const canvases = element.querySelectorAll && element.querySelectorAll('canvas');
        if (canvases) {
          canvases.forEach(canvas => scrollPrevention.preventScrolling(canvas as HTMLCanvasElement));
        }
      }
    });
  });
});

// Start observing
if (typeof document !== 'undefined') {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Apply to existing canvases when script loads
  document.addEventListener('DOMContentLoaded', () => {
    scrollPrevention.preventAllCanvasScrolling();
  });

  // Also apply immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scrollPrevention.preventAllCanvasScrolling();
    });
  } else {
    scrollPrevention.preventAllCanvasScrolling();
  }
}

export default scrollPrevention;
