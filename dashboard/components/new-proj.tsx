import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderPlus } from "lucide-react";
import { createProject } from "@/actions/createProject";
import SubmitButton from "@/components/submit-proj-btn";

const NewProjBtn = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full btn-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">New Project</DialogTitle>
              <DialogDescription className="text-sm">
                Create a new project to start collecting feedback
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form className="flex gap-4 flex-col" action={createProject}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Project Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="My Awesome Project" 
                className="input-smooth"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url" className="text-sm font-medium text-gray-700">Website URL</Label>
              <Input 
                id="url" 
                name="url" 
                placeholder="https://example.com" 
                className="input-smooth"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea 
              name="description" 
              id="description" 
              placeholder="Brief description of your project (optional)" 
              className="input-smooth min-h-[100px] resize-none"
            />
          </div>
          <DialogFooter className="mt-2">
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
};

export default NewProjBtn;
