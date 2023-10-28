// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
// import { singletonEntity } from "@latticexyz/store-sync/recs";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "./components/react-sketch-canvas";
import { useRef } from "react";

export const TemplateCreate = () => {
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
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
        <div>
          <Button variant="default" onClick={() => navigate("/template/1")}>
            Create
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 mb-4">
        <Label htmlFor="name">Template Name</Label>
        <Input type="text" id="name" placeholder="Name" />
      </div>
    </>
  );
};
