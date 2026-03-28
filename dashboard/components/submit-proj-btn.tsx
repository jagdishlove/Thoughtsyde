"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2, CheckCircle } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button 
      type='submit' 
      className="btn-primary w-full group"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Project...
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Create Project
        </>
      )}
    </Button>
  )
}

export default SubmitButton;
