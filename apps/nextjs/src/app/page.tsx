import { HydrateClient } from "~/trpc/server";
import { CoinView } from "./_components/coins";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Asset Tracker
          </h1>
          <p>Track your favourite assets</p>
          <CoinView />
        </div>
      </main>
    </HydrateClient>
  );
}
