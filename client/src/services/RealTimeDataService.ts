/**
 * RealTimeDataService - Manages real-time data updates for sustainability metrics
 * Integrates with WebSocket connections and external APIs for live data feeds
 */

export interface RealTimeMetrics {
  timestamp: Date;
  sustainabilityScore: number;
  jobsCreatedToday: number;
  culturalPracticesAtRisk: number;
  supplyChainTransparency: number;
  carbonFootprintReduction: number;
  communityEngagement: number;
  economicEquityIndex: number;
}

export interface DataSubscription {
  id: string;
  type: 'sustainability' | 'jobs' | 'cultural' | 'economic';
  callback: (data: any) => void;
  active: boolean;
}

export class RealTimeDataService {
  private websocket: WebSocket | null = null;
  private subscriptions: Map<string, DataSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private wsUrl: string = 'ws://localhost:5000/ws') {
    this.connect();
  }

  /**
   * Establish WebSocket connection
   */
  private connect(): void {
    try {
      this.websocket = new WebSocket(this.wsUrl);
      
      this.websocket.onopen = () => {
        console.log('Real-time data service connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.resubscribeAll();
      };

      this.websocket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.websocket.onclose = () => {
        console.log('Real-time data service disconnected');
        this.isConnected = false;
        this.stopHeartbeat();
        this.attemptReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to real-time data service:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'sustainability_metrics':
          this.notifySubscribers('sustainability', message.data);
          break;
        case 'job_update':
          this.notifySubscribers('jobs', message.data);
          break;
        case 'cultural_alert':
          this.notifySubscribers('cultural', message.data);
          break;
        case 'economic_update':
          this.notifySubscribers('economic', message.data);
          break;
        case 'heartbeat':
          // Acknowledge heartbeat
          this.send({ type: 'heartbeat_ack' });
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Notify all subscribers of a specific type
   */
  private notifySubscribers(type: string, data: any): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription.type === type && subscription.active) {
        try {
          subscription.callback(data);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      }
    });
  }

  /**
   * Send message through WebSocket
   */
  private send(message: any): void {
    if (this.websocket && this.isConnected) {
      this.websocket.send(JSON.stringify(message));
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'heartbeat' });
    }, 30000); // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached. Switching to polling mode.');
      this.startPollingMode();
    }
  }

  /**
   * Fallback to polling mode when WebSocket fails
   */
  private startPollingMode(): void {
    setInterval(async () => {
      try {
        const metrics = await this.fetchLatestMetrics();
        this.notifySubscribers('sustainability', metrics);
      } catch (error) {
        console.error('Error in polling mode:', error);
      }
    }, 10000); // Poll every 10 seconds
  }

  /**
   * Fetch latest metrics via HTTP API
   */
  private async fetchLatestMetrics(): Promise<RealTimeMetrics> {
    const response = await fetch('/api/sustainability/real-time-metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch real-time metrics');
    }
    return response.json();
  }

  /**
   * Resubscribe all active subscriptions after reconnection
   */
  private resubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription.active) {
        this.send({
          type: 'subscribe',
          subscription: subscription.type,
          id: subscription.id
        });
      }
    });
  }

  /**
   * Subscribe to real-time updates
   */
  public subscribe(
    type: DataSubscription['type'],
    callback: (data: any) => void
  ): string {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: DataSubscription = {
      id,
      type,
      callback,
      active: true
    };

    this.subscriptions.set(id, subscription);

    // Send subscription request if connected
    if (this.isConnected) {
      this.send({
        type: 'subscribe',
        subscription: type,
        id
      });
    }

    return id;
  }

  /**
   * Unsubscribe from updates
   */
  public unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);

      // Send unsubscribe request if connected
      if (this.isConnected) {
        this.send({
          type: 'unsubscribe',
          id: subscriptionId
        });
      }
    }
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    subscriptions: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptions: this.subscriptions.size
    };
  }

  /**
   * Request specific data update
   */
  public requestUpdate(type: string, params?: any): void {
    if (this.isConnected) {
      this.send({
        type: 'request_update',
        dataType: type,
        params
      });
    }
  }

  /**
   * Send analytics event
   */
  public sendAnalyticsEvent(event: {
    category: string;
    action: string;
    label?: string;
    value?: number;
  }): void {
    if (this.isConnected) {
      this.send({
        type: 'analytics_event',
        event
      });
    }
  }

  /**
   * Disconnect and cleanup
   */
  public disconnect(): void {
    this.stopHeartbeat();
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.subscriptions.clear();
    this.isConnected = false;
  }

  /**
   * Mock real-time data generation for development
   */
  public startMockDataGeneration(): void {
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        const mockMetrics: RealTimeMetrics = {
          timestamp: new Date(),
          sustainabilityScore: 75 + Math.random() * 20,
          jobsCreatedToday: Math.floor(Math.random() * 50),
          culturalPracticesAtRisk: Math.floor(Math.random() * 20),
          supplyChainTransparency: 70 + Math.random() * 25,
          carbonFootprintReduction: 1000 + Math.random() * 2000,
          communityEngagement: 60 + Math.random() * 30,
          economicEquityIndex: 65 + Math.random() * 25
        };

        this.notifySubscribers('sustainability', mockMetrics);
      }, 5000); // Update every 5 seconds
    }
  }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService();

// Start mock data generation in development
if (process.env.NODE_ENV === 'development') {
  realTimeDataService.startMockDataGeneration();
}
