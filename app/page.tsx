"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import SpinIcon from "../public/rotate-right-solid.svg";
import styles from "./page.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  //state
  const [amount, setAmount] = useState<string>("");
  const [cluster, setCluster] = useState<string>("devnet");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);

  //vars
  const statusColor = {
    success: "text-green-500",
    failure: "text-red-500",
  };

  //actions
  const onAirDrop = async () => {
    setStatus(null);
    if (!amount.trim() || !address.trim()) {
      setStatus("Please enter amount and address");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/airdrop", {
      method: "POST",
      body: JSON.stringify({
        address,
        amount,
        cluster,
      }),
    });

    const status = await (await response.json()).status;
    setStatus(status);
    setLoading(false);
  };

  return (
    <div
      className={`${styles.main_container} flex items-center justify-center p-10 w-screen h-screen bg-zinc-900`}
    >
      <div className="flex flex-col p-5 border-1 border-zinc-400 rounded-lg gap-4 w-[100%] md:w-auto">
        <ClusterDropdown cluster={cluster} setCluster={setCluster} />
        <h1 className="text-2xl font-bold text-white">
          Request Solana Airdrop
        </h1>
        <div className="flex items-center justify-center gap-2">
          <Input
            placeholder="Wallet Address"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="bg-transparent w-[100%] md:w-[20rem] text-white placeholder-white"
          ></Input>
          <AmountDropDown amount={amount} setAmount={setAmount} />
        </div>
        <Button
          disabled={loading}
          onClick={onAirDrop}
          className="bg-transparent border-1 border-zinc-400 hover:bg-zinc-700 text-white hover:cursor-pointer"
        >
          {loading ? (
            <Image
              className={styles.rotating}
              alt="spin"
              style={{ width: "10px", height: "10px" }}
              src={SpinIcon}
            />
          ) : (
            "Send"
          )}
        </Button>
        {status && (
          <p
            className={`text-center break-all w-[100%] md:w-[25rem] ${status === "success" ? statusColor.success : statusColor.failure}`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

function AmountDropDown({
  amount,
  setAmount,
}: {
  amount: string;
  setAmount: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{amount ? `${amount} SOL` : "Amount"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">
        <DropdownMenuRadioGroup value={amount} onValueChange={setAmount}>
          <DropdownMenuRadioItem value="0.5">0.5</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1">1</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1.5">1.5</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2">2</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ClusterDropdown({
  cluster,
  setCluster,
}: {
  cluster: string;
  setCluster: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-[fit-content] bg-transparent border-1 border-zinc-400">
          {cluster}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">
        <DropdownMenuRadioGroup value={cluster} onValueChange={setCluster}>
          <DropdownMenuRadioItem value="devnet">devnet</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="testnet">testnet</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
