// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
// import { singletonEntity } from "@latticexyz/store-sync/recs";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "./components/react-sketch-canvas";
import { useRef } from "react";

export const TemplateMint = () => {
  const navigate = useNavigate();
  const canvas = useRef<ReactSketchCanvasRef | null>(null);
  // const {
  //   components: { Counter },
  //   systemCalls: { increment },
  // } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button
          className="mr-2"
          variant="outline"
          onClick={() => canvas.current?.clearCanvas()}
        >
          Clear
        </Button>
        <Button variant="default" onClick={() => navigate("/")}>
          Mint
        </Button>
      </div>
      <Card>
        <CardContent
          style={{ width: "446px", height: "446px" }}
          className="p-0"
        >
          <ReactSketchCanvas
            ref={canvas}
            style={{ height: "100%", width: "100%" }}
            width="446"
            height="446"
            strokeWidth={4}
            strokeColor="black"
          />
        </CardContent>
      </Card>
      <div className="mt-8 w-full">
        <table className="w-full text-left whitespace-nowrap table-auto">
          <tbody>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template ID:</td>
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
              <td className="px-4 py-1 bold">Minted:</td>
              <td className="px-4 py-1 text-right">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
