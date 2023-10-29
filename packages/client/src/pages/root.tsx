import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export const RootPage = () => {
  return (
    <>
      <Toaster position="bottom-center" />
      <header className="absolute top-0 flex justify-end w-full p-4">
        <Button variant="outline">Connect Wallet</Button>
      </header>
      <section className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-900 p-4">
        <h1 className="text-center text-2xl mt-0 mb-20">
          meme<span className="text-red-500">world</span>
        </h1>
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </section>
    </>
  );
};
