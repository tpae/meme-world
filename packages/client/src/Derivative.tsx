// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
// import { singletonEntity } from "@latticexyz/store-sync/recs";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Derivative = () => {
  const navigate = useNavigate();
  // const {
  //   components: { Counter },
  //   systemCalls: { increment },
  // } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
        <Button variant="default">Mint</Button>
      </div>
      <div className="relative max-w-md mb-4">
        <Card>
          <CardContent className="p-0">
            <img
              alt="Selected Image"
              className="h-auto w-auto object-cover transition-all hover:scale-105 rounded-md"
              height="600"
              src="https://placehold.co/600x600"
              width="600"
            />
          </CardContent>
        </Card>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <Button
            className="bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            variant="ghost"
          >
            <svg
              className=" w-5 h-5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <Button
            className="bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            variant="ghost"
          >
            <svg
              className=" w-5 h-5"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="name">Caption</Label>
        <Input type="text" id="name" placeholder="Unique Caption" />
      </div>
      <div className="mt-8 w-full">
        <table className="w-full text-left whitespace-nowrap table-auto">
          <tbody>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Token ID:</td>
              <td className="px-4 py-1 text-right">420</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Name:</td>
              <td className="px-4 py-1 text-right">Meme World #1</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Creator:</td>
              <td className="px-4 py-1 text-right">0xabc...def</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bolx">Owned by:</td>
              <td className="px-4 py-1 text-right">0xabc...def</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
