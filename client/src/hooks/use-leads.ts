import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertLead } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertLead) => {
      // Clean up empty strings to null or defaults if needed, though zod handles type validation
      const res = await fetch(api.leads.create.path, {
        method: api.leads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to submit lead");
      }

      return api.leads.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Application Received",
        description: "We will review your submission and contact you shortly.",
        variant: "default",
      });
      // Invalidate leads query if we had an admin panel
      // queryClient.invalidateQueries({ queryKey: [api.leads.list.path] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
