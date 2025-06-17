"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending ? true : false} type="submit">
      {pending ? (
        <>
          {" "}
          <LoaderCircle className="animate-spin */" /> Creating..
        </>
      ) : (
        "Create Project"
      )}
    </Button>
  );
};

export default SubmitButton;
