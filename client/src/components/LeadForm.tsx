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
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const monetizationOptions = [
  { id: "one_offer", label: "One main offer carries most revenue" },
  { id: "spiky", label: "Revenue spikes around launches, then drops" },
  { id: "unpredictable", label: "Sponsorships are unpredictable month-to-month" },
  { id: "platform_dependent", label: "Income depends heavily on one platform" },
  { id: "no_data", label: "I don’t know which content actually drives revenue" },
];

export function LeadForm() {
  const { mutate, isPending } = useCreateLead();
  const [success, setSuccess] = useState(false);
  const [mixWarning, setMixWarning] = useState(false);

  const form = useForm<z.infer<typeof insertLeadSchema>>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      link: "",
      primaryPlatform: "",
      followerRange: "",
      monthlyRevenueRange: "",
      stuckDuration: "",
      revenueMix: { ads: 0, sponsors: 0, products: 0, affiliates: 0, other: 0 },
      monetizationFlags: [],
      biggestWorry: "",
      openToCall: false,
      consent: false,
    },
  });

  const revenueMix = form.watch("revenueMix") as Record<string, number>;
  
  useEffect(() => {
    const total = Object.values(revenueMix).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    setMixWarning(total !== 100);
  }, [revenueMix]);

  function onSubmit(values: z.infer<typeof insertLeadSchema>) {
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
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Application Received</h3>
        <p className="text-muted-foreground">
          Thanks — if selected, we’ll reach out within 7 days.
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Link (YouTube/Site/Profile) <span className="text-muted-foreground/40 font-normal lowercase">(Optional)</span></FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value || ""} className="input-arch" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="primaryPlatform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Newsletter', 'Other'].map(p => (
                      <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>
                    ))}
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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['< 10k', '10k - 50k', '50k - 100k', '100k - 500k', '500k+'].map(r => (
                      <SelectItem key={r} value={r.replace(/\s/g, '_').toLowerCase()}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyRevenueRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Revenue (USD)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under_1k">&lt; $1k</SelectItem>
                    <SelectItem value="1k_3k">$1k–$3k</SelectItem>
                    <SelectItem value="3k_5k">$3k–$5k</SelectItem>
                    <SelectItem value="5k_8k">$5k–$8k</SelectItem>
                    <SelectItem value="8k_12k">$8k–$12k</SelectItem>
                    <SelectItem value="over_12k">$12k+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stuckDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Time in range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="input-arch">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under_3_months">&lt; 3 months</SelectItem>
                    <SelectItem value="3_6_months">3–6 months</SelectItem>
                    <SelectItem value="6_12_months">6–12 months</SelectItem>
                    <SelectItem value="over_12_months">12+ months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-background/30 p-6 border border-border/50">
          <div className="flex justify-between items-center mb-4">
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground block">
              Estimated Revenue Breakdown (%)
            </FormLabel>
            {mixWarning && (
              <div className="flex items-center gap-1.5 text-primary/60 text-[10px] uppercase font-mono italic animate-pulse">
                <AlertCircle size={10} /> Should sum to 100%
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['ads', 'sponsors', 'products', 'affiliates', 'other'].map((key) => (
              <FormItem key={key} className="space-y-1">
                <FormLabel className="text-[10px] uppercase text-muted-foreground/70">{key}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="0"
                    className="input-arch text-center"
                    value={revenueMix[key] || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const current = form.getValues('revenueMix') as Record<string, number>;
                      form.setValue('revenueMix', { ...current, [key]: val }, { shouldValidate: true });
                    }}
                  />
                </FormControl>
              </FormItem>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground block">
            Which best describes your current monetization?
          </FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {monetizationOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="monetizationFlags"
                render={({ field }) => (
                  <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-border/40 p-3 bg-background/20 hover:border-primary/30 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          return checked
                            ? field.onChange([...current, option.id])
                            : field.onChange(current.filter((value) => value !== option.id));
                        }}
                        className="rounded-none border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <FormLabel className="text-xs text-muted-foreground cursor-pointer leading-tight">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </div>

        <FormField
          control={form.control}
          name="biggestWorry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Biggest Business Worry if reach drops 50%</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us what keeps you up at night..." 
                  className="input-arch min-h-[100px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="openToCall"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-none border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </FormControl>
                <FormLabel className="text-xs text-muted-foreground cursor-pointer">
                  Open to a 15-minute diagnosis call?
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 border-t border-border/40 pt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-none border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </FormControl>
                <FormLabel className="text-xs text-white font-medium cursor-pointer">
                  I agree to be contacted regarding this study.
                </FormLabel>
              </FormItem>
            )}
          />
          <FormMessage />
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full btn-primary h-14 text-lg"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Apply to Participate"
          )}
        </Button>
      </form>
    </Form>
  );
}
