import { useMUD } from "../MUDContext";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { handleError, templateIdToEntityKey, trimHash } from "../lib/utils";
import { getComponentValue } from "@latticexyz/recs";

export const Derivative = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [templateImage, setTemplateImage] = useState<string | undefined>();
  const [creator, setCreator] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [minted, setMinted] = useState<boolean | undefined>();
  const [templateIds, setTemplateIds] = useState<bigint[] | undefined>();
  const [templateId, setTemplateId] = useState<bigint | undefined>();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const {
    components: { Creator, Name, Minted },
    systemCalls: { getAllMintedTemplates, getTemplateImage, mintDerivative },
  } = useMUD();

  const fetchAllTemplates = useCallback(async () => {
    const templateIds = await getAllMintedTemplates();

    setTemplateIds(templateIds);
    templateIds.length > 0 && setTemplateId(templateIds[0]);
    setIndex(0);
    setLoading(false);
  }, [getAllMintedTemplates]);

  const fetchTemplateData = useCallback(
    async (templateId: bigint) => {
      try {
        setLoading(true);
        const templateImage = await getTemplateImage(templateId);
        const entity = templateIdToEntityKey(templateId);

        const creatorRecord = getComponentValue(Creator, entity);
        const nameRecord = getComponentValue(Name, entity);
        const mintedRecord = getComponentValue(Minted, entity);

        setTemplateImage(templateImage);
        setCreator(creatorRecord?.value as string);
        setName(nameRecord?.value as string);
        setMinted(mintedRecord?.value as boolean);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [getTemplateImage, Creator, Name, Minted]
  );

  const handleMint = useCallback(async () => {
    if (!caption) {
      toast.error("Missing caption");
      return;
    }
    if (!templateId) return;

    try {
      setLoading(true);
      const toastId = toast("handleMint");
      toast.loading("Minting...", {
        id: toastId,
      });
      await mintDerivative(templateId, caption);
      toast.success("Minted.", {
        id: toastId,
      });

      navigate(`/`);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [caption, navigate, templateId, mintDerivative]);

  useEffect(() => {
    if (templateId) {
      fetchTemplateData(templateId);
    }
  }, [fetchTemplateData, templateId]);

  useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  useEffect(() => {
    if (templateIds) {
      if (templateIds[index]) {
        setTemplateId(templateIds[index]);
      } else if (index > templateIds.length - 1) {
        setIndex(0);
      } else if (index < 0) {
        setIndex(templateIds.length - 1);
      }
    }
  }, [index, templateIds]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
        <Button disabled={loading} onClick={handleMint} variant="default">
          Mint
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
            onClick={() => setIndex(index - 1)}
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
            onClick={() => setIndex(index + 1)}
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
        <Input
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
          type="text"
          id="name"
          placeholder="Unique Caption"
        />
      </div>
      <div className="mt-8 w-full">
        <table className="w-full text-left whitespace-nowrap table-auto">
          <tbody>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template ID:</td>
              <td className="px-4 py-1 text-right">{templateId?.toString()}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Name:</td>
              <td className="px-4 py-1 text-right">{name}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Template Creator:</td>
              <td className="px-4 py-1 text-right">{trimHash(creator, 6)}</td>
            </tr>
            <tr className="text-zinc-900 dark:text-zinc-100">
              <td className="px-4 py-1 bold">Minted:</td>
              <td className="px-4 py-1 text-right">{minted ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
