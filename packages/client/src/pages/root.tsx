import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";

export const RootPage = () => {
  return (
    <>
      <header className="sticky top-0 flex justify-end w-full p-4 bg-zinc-100 dark:bg-zinc-900">
        <Button variant="outline">Connect Wallet</Button>
      </header>
      <section className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900 p-4">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </section>
    </>
  );
};
