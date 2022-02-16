import { Stats as IStats, StatFields as IStatFields } from "./types";

// Stats fields config. Keys will correspond to graphql queries when used, and values
// contain the associated data and methods we need to render. A single query
// can be rendered in multiple ways (see 'upTime').
export const statsFields: { [key in keyof IStats]: IStatFields[] } = {
    blockHeight: [
      {
        title: "Height",
        goodThreshold: (height: number) => height >= 60,
        promoted: true,
      },
    ],
    totalNodes: [
        {
            title: "Total nodes",
        },
    ],
    validatingNodes: [
        {
            title: "Validating nodes",
        },
    ],
    inactiveNodes: [
        {
            title: "Inactive nodes",
        },
    ],
    stakedTotal: [
        {
            title: "Total staked",
            formatter: (total: string) => total.length > 18 && parseInt(total.substring(0, total.length - 18)).toLocaleString('en-US')
        },
    ],
    backlogLength: [
      {
        title: "Backlog",
        goodThreshold: (length: number, blockDuration: number) => {
          return (
            length < 1000 || (length >= 1000 && blockDuration / 1000000000 <= 1)
          );
        },
      },
    ],
    tradesPerSecond: [
      {
        title: "Trades / second",
        goodThreshold: (trades: number) => trades >= 2,
      },
    ],
    averageOrdersPerBlock: [
      {
        title: "Orders / block",
        goodThreshold: (orders: number) => orders >= 2,
      },
    ],
    ordersPerSecond: [
      {
        title: "Orders / second",
        goodThreshold: (orders: number) => orders >= 2,
      },
    ],
    txPerBlock: [
      {
        title: "Transactions / block",
        goodThreshold: (tx: number) => tx > 2,
      },
    ],
    blockDuration: [
      {
        title: "Block time",
        formatter: (duration: number) => (duration / 1000000000).toFixed(3),
        goodThreshold: (blockDuration: number) =>
          blockDuration > 0 && blockDuration <= 2000000000,
      },
    ],
    status: [
      {
        title: "Status",
        formatter: (status: string) => {
          if (!status) {
            return;
          }
  
          const i = status.lastIndexOf("_");
          if (i === -1) {
            return status;
          } else {
            return status.substr(i + 1);
          }
        },
        goodThreshold: (status: string) =>
          status === "CONNECTED" || status === "CHAIN_STATUS_CONNECTED",
        promoted: true,
      },
    ],
    totalPeers: [
      {
        title: "Peers",
        goodThreshold: (peers: number) => peers >= 2,
        promoted: true,
      },
    ],
    vegaTime: [
      {
        title: "Time",
        formatter: (time: Date) => new Date(time).toLocaleTimeString(),
        goodThreshold: (time: Date) => {
          let diff = new Date().getTime() - new Date(time).getTime();
          return diff > 0 && diff < 5000;
        },
      },
    ],
    appVersion: [
      {
        title: "App",
      },
    ],
    chainVersion: [
      {
        title: "Tendermint",
      },
    ],
    uptime: [
      {
        title: "Uptime",
        formatter: (t: string) => {
          if (!t) {
            return;
          }
          const secSinceStart =
            (new Date().getTime() - new Date(t).getTime()) / 1000;
          const days = Math.floor(secSinceStart / 60 / 60 / 24);
          const hours = Math.floor((secSinceStart / 60 / 60) % 24);
          const mins = Math.floor((secSinceStart / 60) % 60);
          const secs = Math.floor(secSinceStart % 60);
          return `${days}d ${hours}h ${mins}m ${secs}s`;
        },
        promoted: true,
      },
      {
        title: "Since",
        formatter: (t: string) => {
          if (!t) {
            return;
          }
          return `${new Date(t).toLocaleString().replace(",", " ")}`;
        },
      },
    ],
    chainId: [
      {
        title: "Chain ID",
      },
    ],
  };