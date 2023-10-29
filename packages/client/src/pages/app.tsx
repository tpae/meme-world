import { useMUD } from "../MUDContext";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { derivativeIdToEntityKey, handleError, trimHash } from "@/lib/utils";
import { Entity, getComponentValueStrict } from "@latticexyz/recs";

export const App = () => {
  const navigate = useNavigate();
  const [derivativeIds, setDerivativeIds] = useState<bigint[] | undefined>();
  const [derivativeId, setDerivativeId] = useState<bigint | undefined>();
  const [templateImage, setTemplateImage] = useState<string | undefined>();
  const [creator, setCreator] = useState<string | undefined>();
  const [templateCreator, setTemplateCreator] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [caption, setCaption] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const {
    components: { TemplateKey, Creator, Name, Caption },
    systemCalls: { getAllMintedDerivatives, getTemplateImage },
  } = useMUD();

  const fetchAllDerivatives = useCallback(async () => {
    const derivativeIds = await getAllMintedDerivatives();

    setDerivativeIds(derivativeIds);
    derivativeIds.length > 0 && setDerivativeId(derivativeIds[0]);
    setIndex(0);
    setLoading(false);
  }, [getAllMintedDerivatives]);

  const fetchDerivativeData = useCallback(
    async (derivativeId: bigint) => {
      try {
        setLoading(true);
        const entity = derivativeIdToEntityKey(derivativeId);
        const templateRecord = getComponentValueStrict(TemplateKey, entity);

        const creatorRecord = getComponentValueStrict(Creator, entity);
        const captionRecord = getComponentValueStrict(Caption, entity);
        const templateImage = await getTemplateImage(
          templateRecord.value as `0x${string}`
        );
        const templateCreatorRecord = getComponentValueStrict(
          Creator,
          templateRecord.value as Entity
        );
        const nameRecord = getComponentValueStrict(
          Name,
          templateRecord.value as Entity
        );

        setTemplateImage(templateImage);
        setCreator(creatorRecord.value as string);
        setTemplateCreator(templateCreatorRecord.value as string);
        setName(nameRecord.value as string);
        setCaption(captionRecord.value as string);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [Creator, Name, Caption, TemplateKey, getTemplateImage]
  );

  const handlePagination = useCallback(
    (newIndex: number) => {
      if (!derivativeIds || !derivativeIds.length) return;

      const wrappedIndex =
        (newIndex + derivativeIds.length) % derivativeIds.length;

      setDerivativeId(derivativeIds[wrappedIndex]);
      setIndex(wrappedIndex);
    },
    [derivativeIds]
  );

  useEffect(() => {
    if (derivativeId !== undefined) {
      fetchDerivativeData(derivativeId);
    }
  }, [fetchDerivativeData, derivativeId]);

  useEffect(() => {
    fetchAllDerivatives();
  }, [fetchAllDerivatives]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline" onClick={() => navigate("/template")}>
          Create New Template
        </Button>
        <Button variant="outline" onClick={() => navigate("/derivative")}>
          Create New Meme
        </Button>
      </div>
      <div className="relative max-w-md mb-4">
        <Card>
          <CardContent className="p-0">
            <img
              alt="Selected Image"
              className="h-auto w-auto object-cover transition-all hover:scale-105 rounded-md"
              height="443"
              src={templateImage}
              width="443"
            />
          </CardContent>
        </Card>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <Button
            className="bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            variant="ghost"
            onClick={() => handlePagination(index - 1)}
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
            onClick={() => handlePagination(index + 1)}
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
      {caption && (
        <p className="mt-4 text-center italic">&quot;{caption}&quot;</p>
      )}
      <div className="mt-8 w-full">
        <table className="w-full text-left whitespace-nowrap table-auto">
          <tbody>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Token ID:</td>
              <td className="px-4 py-1 text-right">
                {derivativeId?.toString()}
              </td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Creator:</td>
              <td className="px-4 py-1 text-right">{trimHash(creator, 6)}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Name:</td>
              <td className="px-4 py-1 text-right">{name}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Creator:</td>
              <td className="px-4 py-1 text-right">
                {trimHash(templateCreator, 6)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
