export interface Stats {
    blockHeight: string;
    totalNodes: string;
    validatingNodes: string;
    inactiveNodes: string;
    stakedTotal: string;
    backlogLength: string;
    tradesPerSecond: string;
    averageOrdersPerBlock: string;
    ordersPerSecond: string;
    txPerBlock: string;
    blockDuration: string;
    status: string;
    totalPeers: string;
    vegaTime: string;
    appVersion: string;
    chainVersion: string;
    uptime: string;
    chainId: string;
  }
  
  export interface StatFields {
    title: string;
    goodThreshold?: (...args: any[]) => boolean;
    formatter?: (arg0: any) => any;
    promoted?: boolean;
    value?: any;
  }
  
  export interface StructuredStats {
    promoted: StatFields[], 
    table: StatFields[]
  }