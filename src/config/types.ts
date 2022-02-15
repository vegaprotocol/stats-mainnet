export interface Stats_statistics {
    blockHeight: string;
    /**
     * Number of items in the backlog
     */
    backlogLength: string;
    /**
     * Number of the trades per seconds
     */
    tradesPerSecond: string;
    /**
     * Average number of orders added per blocks
     */
    averageOrdersPerBlock: string;
    /**
     * Number of orders per seconds
     */
    ordersPerSecond: string;
    /**
     * Number of transaction processed per block
     */
    txPerBlock: string;
    /**
     * Duration of the last block, in nanoseconds
     */
    blockDuration: string;
    /**
     * Status of the vega application connection with the chain
     */
    status: string;
    /**
     * Total number of peers on the vega network
     */
    totalPeers: string;
    /**
     * RFC3339Nano current time of the chain (decided through consensus)
     */
    vegaTime: string;
    /**
     * Version of the vega node (semver)
     */
    appVersion: string;
    /**
     * Version of the chain (semver)
     */
    chainVersion: string;
    /**
     * RFC3339Nano uptime of the node
     */
    uptime: string;
    /**
     * Current chain id
     */
    chainId: string;
  }
  
  export interface Stats {
    /**
     * get statistics about the vega node
     */
    statistics: Stats_statistics;
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