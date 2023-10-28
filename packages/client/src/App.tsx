// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
// import { singletonEntity } from "@latticexyz/store-sync/recs";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const App = () => {
  // const {
  //   components: { Counter },
  //   systemCalls: { increment },
  // } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline">Create New Template</Button>
        <Button variant="outline">Create New Meme</Button>
      </div>
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
      <p className="mt-4 text-center italic">&quot;Caption&quot;</p>
      <div className="mt-8 w-full">
        <table className="w-full text-left whitespace-nowrap table-auto">
          <tbody>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Creator:</td>
              <td className="px-4 py-1 text-right">0xabc...def</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template:</td>
              <td className="px-4 py-1 text-right">Meme World #1</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bolx">Minted by:</td>
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
