import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import tailwindStyles from "../index.css?inline";
import supabase from "../supabaseClient";

export const Widget = ({ projectId }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      p_project_id: "1",
      p_user_name: form.name.value,
      p_user_email: form.email.value,
      p_message: form.feedback.value,
      // p_rating: rating,
    };
    const { data: returnedData, error } = await supabase.rpc(
      "add_feedback",
      data
    );
    setSubmitted(true);
    console.log(returnedData);
  };

  return (
    <>
      <style>{tailwindStyles}</style>

      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300">
              <MessageCircleIcon />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-xl bg-background p-6 shadow-2xl w-full max-w-md border border-muted">
            <style>{tailwindStyles}</style>
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
                            : "fill-white  "
                        }`}
                        onClick={() => onSelectStar(index)}
                      />
                    ))}
                  </div>

                  {/* Submit */}
                  <Button
                    className="text-white bg-indigo-600 hover:bg-indigo-700 transition-colors mx-auto px-6 py-2"
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
    </>
  );
};

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-message-circle"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
