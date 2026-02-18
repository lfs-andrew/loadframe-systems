import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertLeadSchema } from "@shared/schema";
import { useCreateLead } from "@/hooks/use-leads";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// Extend the schema for form validation nuances if needed
const formSchema = insertLeadSchema.extend({
  // Ensure number fields are coerced or handled correctly
});

export function LeadForm() {
  const { mutate, isPending } = useCreateLead();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      primaryPlatform: "",
      followerRange: "",
      revenueRange: "",
      // Initialize jsonb field
      revenueBreakdown: { 
        ads: 0, 
        sponsorships: 0, 
        products: 0, 
        affiliates: 0, 
        services: 0 
      },
      biggestWorry: "",
      openToCall: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        setSuccess(true);
        form.reset();
      },
    });
  }

  if (success) {
    return (
      <div className="bg-card border border-primary/20 p-8 md:p-12 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Application Received</h3>
        <p className="text-muted-foreground">
          We have received your details. Our team will review your profile and contact you if you are a fit for the study.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          variant="outline" 
          className="mt-8 border-primary text-primary hover:bg-primary hover:text-black rounded-none"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} className="input-arch" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} className="input-arch" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="primaryPlatform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Primary Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">X / Twitter</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="followerRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Audience Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under_10k">&lt; 10k</SelectItem>
                    <SelectItem value="10k_50k">10k - 50k</SelectItem>
                    <SelectItem value="50k_100k">50k - 100k</SelectItem>
                    <SelectItem value="100k_500k">100k - 500k</SelectItem>
                    <SelectItem value="500k_plus">500k+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="revenueRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Annual Revenue</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under_50k">&lt; $50k</SelectItem>
                    <SelectItem value="50k_150k">$50k - $150k</SelectItem>
                    <SelectItem value="150k_500k">$150k - $500k</SelectItem>
                    <SelectItem value="500k_1m">$500k - $1M</SelectItem>
                    <SelectItem value="1m_plus">$1M+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-background/30 p-4 border border-border/50">
          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground block mb-4">
            Estimated Revenue Breakdown (%) - Must sum to roughly 100
          </FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['ads', 'sponsorships', 'products', 'affiliates', 'services'].map((key) => (
              <FormItem key={key} className="space-y-1">
                <FormLabel className="text-[10px] uppercase text-muted-foreground/70">{key}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="0"
                    className="input-arch text-center"
                    // @ts-ignore
                    value={form.watch(`revenueBreakdown.${key}` as any)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      // @ts-ignore
                      const current = form.getValues('revenueBreakdown');
                      form.setValue('revenueBreakdown', { ...current, [key]: val });
                    }}
                  />
                </FormControl>
              </FormItem>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="biggestWorry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Biggest Business Worry</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What keeps you up at night regarding your business stability?" 
                  className="input-arch min-h-[100px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openToCall"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-border p-4 bg-card">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded-none border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium text-white cursor-pointer">
                  Open to a 15-minute diagnosis call?
                </FormLabel>
                <FormDescription className="text-xs">
                  If selected, we may reach out to discuss your stress test results personally.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Participate in the Study"
          )}
        </Button>
      </form>
    </Form>
  );
}
