import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Cluster,
} from "@solana/web3.js";

export async function POST(request: Request) {
  const data = await request.json();
  const publicAddress = data.address;
  const amount = data.amount;
  const cluster = data.cluster as Cluster;
  const status = await airdrop(cluster, amount, publicAddress);
  return Response.json({
    status,
  });
}

const airdrop = async (cluster: Cluster, amount: string, address: string) => {
  try {
    const url = clusterApiUrl(cluster);
    const connection = new Connection(url);
    const pubKey = new PublicKey(address);

    const airDropSignature = await connection.requestAirdrop(
      pubKey,
      Number(amount) * LAMPORTS_PER_SOL,
    );

    const latestBlockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airDropSignature,
    });
    return "success";
  } catch (error) {
    return `${error}`;
  }
};
