import { useMemo, useRef } from "react";
import { keccak256, encodePacked } from "viem";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { useNavigate, useParams } from "react-router-dom";
import { useMUD } from "./MUDContext";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "@/components/react-sketch-canvas";

export const TemplateMint = () => {
  const navigate = useNavigate();
  const params = useParams<{ templateId: string }>();
  const canvas = useRef<ReactSketchCanvasRef | null>(null);
  const entity = useMemo(
    () =>
      params.templateId
        ? (keccak256(
            encodePacked(
              ["string", "uint256"],
              ["template", BigInt(params.templateId)]
            )
          ) as Entity)
        : undefined,
    [params]
  );
  const {
    components: { Creator, Name, Minted },
    systemCalls: { mintTemplate },
  } = useMUD();

  const creator = useComponentValue(Creator, entity);
  const name = useComponentValue(Name, entity);
  const minted = useComponentValue(Minted, entity);

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
              <td className="px-4 py-1 text-right">{params.templateId}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Name:</td>
              <td className="px-4 py-1 text-right">{name?.value}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Creator:</td>
              <td className="px-4 py-1 text-right">{creator?.value}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Minted:</td>
              <td className="px-4 py-1 text-right">
                {minted?.value ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
