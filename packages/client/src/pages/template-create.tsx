import { useMUD } from "../MUDContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { handleError } from "../lib/utils";

export const TemplateCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    systemCalls: { createTemplate },
  } = useMUD();

  const handleCreate = useCallback(async () => {
    if (!name) {
      toast.error("Missing name");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast("handleCreate");
      toast.loading("Creating...", {
        id: toastId,
      });
      const templateId = await createTemplate(name);
      toast.success("Created.", {
        id: toastId,
      });

      navigate(`/template/${templateId}`);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [name, navigate, createTemplate]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
        <div>
          <Button disabled={loading} variant="default" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="name">Template Name</Label>
        <Input
          onChange={(event) => setName(event.target.value)}
          value={name}
          type="text"
          id="name"
          placeholder="Name"
        />
      </div>
    </>
  );
};
