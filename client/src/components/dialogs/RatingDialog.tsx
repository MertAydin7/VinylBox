import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import StarRating from "@/components/ui/star-rating";
import { X } from "lucide-react";
import { Album } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RatingDialogProps {
  album?: Album;
  open: boolean;
  currentRating?: number;
  currentReview?: string;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  rating: z.number().min(0.5).max(5),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RatingDialog: React.FC<RatingDialogProps> = ({
  album,
  open,
  currentRating = 0,
  currentReview = "",
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(currentRating);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: currentRating,
      content: currentReview,
    },
  });
  
  const hasReview = Boolean(currentReview);
  
  const ratingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // First submit rating
      await apiRequest("POST", "/api/ratings", {
        userId: 1, // In real app, would come from auth
        albumId: album?.id,
        rating: values.rating,
      });
      
      // Then submit review if there's content
      if (values.content?.trim()) {
        await apiRequest("POST", "/api/reviews", {
          userId: 1, // In real app, would come from auth
          albumId: album?.id,
          content: values.content,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/albums/${album?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/albums/${album?.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/feed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/feed/network'] });
      
      toast({
        title: "Success!",
        description: hasReview 
          ? "Your rating and review have been updated." 
          : "Your rating has been saved.",
      });
      
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: FormValues) => {
    ratingMutation.mutate(values);
  };
  
  if (!album) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-header text-xl">Rate & Review</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={album.coverImage} 
            alt={album.title} 
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h4 className="font-medium">{album.title}</h4>
            <p className="text-sm text-muted-foreground">
              {album.artist} ({album.releaseYear})
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel className="text-muted-foreground">Your Rating</FormLabel>
                  <FormControl>
                    <StarRating 
                      rating={field.value}
                      size="lg"
                      interactive={true}
                      onChange={(value) => {
                        field.onChange(value);
                        setRating(value);
                      }}
                      className="justify-center gap-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Write a Review <span className="text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts on this album..."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={ratingMutation.isPending || !rating}
              >
                {ratingMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
