"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { RouterOutputs } from "@acme/api";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

export function CoinView() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <Button onClick={() => router.push("/")}>#</Button>
        <Button onClick={() => router.push("?sort=symbol")}>Name</Button>
        <Button onClick={() => router.push("?sort=price")}>Price</Button>
        <Button onClick={() => router.push("?sort=percent_change_24h")}>
          Change (24h)
        </Button>
      </div>
      <CoinList />
    </>
  );
}

export function CoinList() {
  const searchParams = useSearchParams();
  // Get a specific query parameter
  let paramString = "sort=market_cap";
  if (searchParams.get("sort")) {
    paramString = searchParams.toString();
  }

  const { data, error, isLoading } = api.post.all.useQuery({
    sort: paramString,
  });
  if (error) {
    return <div>error!</div>;
  }

  if (isLoading || data === undefined) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <CoinCardSkeleton pulse={true} />
        <CoinCardSkeleton pulse={true} />
        <CoinCardSkeleton pulse={true} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {data.map((coin) => {
        return <CoinCard key={coin.symbol} coin={coin} />;
        return <div>{coin.symbol}</div>;
      })}
    </div>
  );
}
function priceFormat(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function marketCapFormat(price: number) {
  if (price >= 1e9) {
    // Billions
    return (price / 1e9).toFixed(2) + " Bn";
  } else if (price >= 1e6) {
    // Millions
    return (price / 1e6).toFixed(2) + " Mn";
  } else if (price >= 1e3) {
    // Thousands
    return (price / 1e3).toFixed(2) + " K";
  } else {
    return price.toFixed(2); // If less than 1000, just return the number with two decimals
  }
}

export function CoinCard(props: {
  coin: NonNullable<RouterOutputs["post"]["all"]>[number];
}) {
  return (
    <div className="flex flex-row gap-4 rounded-lg bg-muted p-4">
      <h2 className="text-2xl font-bold">{props.coin.rank}</h2>
      <div className="flex flex-grow flex-row gap-4">
        {/* <Image src={} /> */}
        <div className="">
          <h2 className="text-2xl font-bold">{props.coin.symbol}</h2>
          <p className="mt-2 text-sm">
            {marketCapFormat(props.coin.marketCap)}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold">{priceFormat(props.coin.price)}</h2>
      <h2 className="text-2xl font-bold">{props.coin.change.toFixed(2)}%</h2>
    </div>
  );
}

export function CoinCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-current text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
