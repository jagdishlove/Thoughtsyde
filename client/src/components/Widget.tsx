import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StarIcon from "@/icons/StarIcon";
import MessageCircleIcon from "@/icons/MessageCircleIcon";
import tailwindStyles from "../index.css?inline";

export const Widget = () => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const onSelecStar = (index: number) => {
    setRating(index + 1);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const feedback = (
      form.elements.namedItem("feedback") as HTMLTextAreaElement
    )?.value;

    const data = {
      name,
      email,
      feedback,
      rating,
    };
    setSubmitted(true);
    console.log("data", data);
  };
  return (
    <div className="widget fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            <MessageCircleIcon />
            Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-xl bg-background p-6 shadow-2xl w-full max-w-md border border-muted">
          {submitted ? (
            <div>
              <h3 className="text-lg font-bold">
                Thank you for your feedback!
              </h3>
              <p className="mt-4">
                We appreaciate your feedback. It helps us improve our product
                and provide better service to our customers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-foreground">
                💬 We’d love your feedback!
              </h3>

              <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Name and Email */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col w-full">
                    <Label htmlFor="name" className="mb-1">
                      Name
                    </Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="flex flex-col w-full">
                    <Label htmlFor="email" className="mb-1">
                      Email
                    </Label>
                    <Input id="email" placeholder="Your email" />
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex flex-col">
                  <Label htmlFor="feedback" className="mb-1">
                    Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think..."
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Star Rating */}
                <div className="flex justify-center items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        rating > index
                          ? "fill-yellow-400 stroke-yellow-500"
                          : "fill-muted stroke-muted-foreground"
                      }`}
                      onClick={() => onSelecStar(index)}
                    />
                  ))}
                </div>

                {/* Submit */}
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors mx-auto px-6 py-2"
                  type="submit"
                >
                  Submit Feedback
                </Button>
              </form>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
