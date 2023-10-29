import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { keccak256, encodePacked } from "viem";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { useNavigate, useParams } from "react-router-dom";
import { useMUD } from "./MUDContext";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "@/components/react-sketch-canvas";
import { toast } from "sonner";
import { handleError, serializePath, trimHash } from "./lib/utils";

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
    systemCalls: { mintTemplate, drawPaths, getTemplateImage },
  } = useMUD();

  const creator = useComponentValue(Creator, entity);
  const name = useComponentValue(Name, entity);
  const minted = useComponentValue(Minted, entity);
  const [templateImage, setTemplateImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const fetchTemplateImage = useCallback(
    async (templateId: bigint) => {
      const template = await getTemplateImage(templateId);

      setTemplateImage(template);
    },
    [getTemplateImage]
  );

  useEffect(() => {
    if (params.templateId) {
      fetchTemplateImage(BigInt(params.templateId));
    }
  }, [fetchTemplateImage, params.templateId]);

  const handleDraw = useCallback(
    async (path: CanvasPath) => {
      if (!params.templateId) return;

      try {
        setLoading(true);
        const toastId = toast("handleDraw");
        toast.loading("Drawing...", {
          id: toastId,
        });
        canvas.current?.setDrawingEnabled(false);
        const serializedPaths = serializePath(path);
        toast.loading("Writing to the Blockchain...", {
          id: toastId,
        });
        await drawPaths(BigInt(params.templateId), serializedPaths);
        canvas.current?.setDrawingEnabled(true);
        toast.success("Saved.", {
          id: toastId,
        });
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [params, drawPaths]
  );

  const handleMint = useCallback(async () => {
    if (!params.templateId) return;

    try {
      setLoading(true);
      const toastId = toast("handleMint");
      toast.loading("Minting...", {
        id: toastId,
      });
      canvas.current?.setDrawingEnabled(false);
      await mintTemplate(BigInt(params.templateId));
      toast.success("Minted.", {
        id: toastId,
      });
      toast.message("Create a new meme to see your new template.");

      navigate("/");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [params, navigate, mintTemplate]);

  return (
    <>
      <div className="flex justify-end mb-8">
        <Button disabled={loading} variant="default" onClick={handleMint}>
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
            backgroundImage={templateImage}
            width="446"
            height="446"
            strokeWidth={4}
            strokeColor="black"
            onMouseUp={handleDraw}
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
              <td className="px-4 py-1 text-right">
                {trimHash(creator?.value, 6)}
              </td>
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
