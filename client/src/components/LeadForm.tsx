import { useEffect, useMemo, useState } from "react";
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
} from "@/components/ui/form";

import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Loader2, AlertCircle } from "lucide-react";

const monetizationOptions = [
  { id: "one_offer", label: "One main offer carries most revenue" },
  { id: "spiky", label: "Revenue spikes around launches, then drops" },
  { id: "unpredictable", label: "Sponsorships are unpredictable month-to-month" },
  { id: "platform_dependent", label: "Income depends heavily on one platform" },
  { id: "no_data", label: "I don’t know which content actually drives revenue" },
];

const mixKeys = ["ads", "sponsors", "products", "affiliates", "other"] as const;

const GRID_LABEL_CLASS =
  "text-xs uppercase tracking-wider text-muted-foreground min-h-[52px] flex items-end leading-snug";

type LeadFormValues = z.infer<typeof insertLeadSchema>;

// Client-only additions (do NOT go to backend schema directly)
type ExtraFields = {
  revenueCert: boolean;
  decisionMaker: boolean;
  largestSourcePct: "" | "0_25" | "26_50" | "51_75" | "76_100";
  whyNow: string;
};

export function LeadForm() {
  const { mutate, isPending } = useCreateLead();
  const [success, setSuccess] = useState(false);

const clientSchema = insertLeadSchema.extend({
  revenueCert: z.boolean(),
  decisionMaker: z.boolean(),
  largestSourcePct: z
    .enum(["0_25", "26_50", "51_75", "76_100"])
    .or(z.literal("")),
  whyNow: z.string(),
});

  const form = useForm<z.infer<typeof clientSchema>>({
  resolver: zodResolver(clientSchema),
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

    revenueCert: false,
    decisionMaker: false,
    largestSourcePct: "",
    whyNow: "",
  },
  mode: "onBlur",
});

  const revenueMix = form.watch("revenueMix") as Record<string, number>;

  const mixTotal = useMemo(() => {
    return Object.values(revenueMix).reduce(
      (sum, v) => sum + (Number.isFinite(Number(v)) ? Number(v) : 0),
      0
    );
  }, [revenueMix]);

  const mixTouched = useMemo(() => {
    return Object.values(revenueMix).some((v) => (Number(v) || 0) > 0);
  }, [revenueMix]);

  const showMixWarning = mixTouched && mixTotal !== 100;

  useEffect(() => {
    if (!mixTouched) return;
    if (mixTotal === 100) form.clearErrors("revenueMix");
  }, [mixTotal, mixTouched, form]);

  function onSubmit(values: z.infer<typeof clientSchema>) {
    // hard client gates (without changing backend)
    if (!values.revenueCert) {
      form.setError("revenueCert" as any, {
        type: "manual",
        message: "Please confirm you generate at least $3,000/month.",
      });
      return;
    }

    if (!values.decisionMaker) {
      form.setError("decisionMaker" as any, {
        type: "manual",
        message: "Please confirm you are the primary decision-maker.",
      });
      return;
    }

    // keep your revenue mix validation
    const total = Object.values(values.revenueMix as Record<string, number>).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0
    );

    if (total !== 100) {
      form.setError("revenueMix" as any, {
        type: "manual",
        message: `Revenue breakdown should total 100%. Current total: ${total}%.`,
      });
      return;
    }

    // Pack new fields into biggestWorry so backend + email captures them
    const notes = [
      `Revenue gate confirmed: ${values.revenueCert ? "YES" : "NO"}`,
      `Primary decision-maker: ${values.decisionMaker ? "YES" : "NO"}`,
      `Largest revenue source (%): ${values.largestSourcePct || "-"}`,
      "",
      "Breaks first if traffic -50% for 90 days:",
      values.biggestWorry?.trim() || "-",
      "",
      "Why applying now:",
      values.whyNow?.trim() || "-",
    ].join("\n");

    const payload: LeadFormValues = {
      name: values.name,
      email: values.email,
      link: values.link,
      primaryPlatform: values.primaryPlatform,
      followerRange: values.followerRange,
      monthlyRevenueRange: values.monthlyRevenueRange,
      stuckDuration: values.stuckDuration,
      revenueMix: values.revenueMix,
      monetizationFlags: values.monetizationFlags,
      biggestWorry: notes, // <-- ALWAYS send packed notes here
      openToCall: values.openToCall,
      consent: values.consent,
    };

    mutate(payload, {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Application Received</h3>
        <p className="text-muted-foreground">
          If your structure aligns with the study criteria, you’ll receive a direct outreach to schedule a brief
          structural review call.
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

  const revenueRange = form.watch("monthlyRevenueRange");
  const revenueGateHint =
    revenueRange === "under_1k" || revenueRange === "1k_3k"
      ? "Note: This study is designed for monetized creators earning approximately $3,000+/month."
      : "This diagnostic is designed for monetized creators earning approximately $3,000+/month.";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        {/* Top framing */}
        <div className="bg-background/30 border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">
            {revenueGateHint}
          </p>
        </div>

        {/* Required gates */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name={"revenueCert" as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex flex-row items-start space-x-3 space-y-0 p-2 border border-border/40 bg-background/20">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      className="rounded-none border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  </FormControl>
                  <FormLabel className="text-xs text-white font-medium cursor-pointer leading-tight">
                    I currently generate at least <span className="text-primary">$3,000/month</span> from my creator
                    business.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"decisionMaker" as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex flex-row items-start space-x-3 space-y-0 p-2 border border-border/40 bg-background/20">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="rounded-none border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  </FormControl>
                  <FormLabel className="text-xs text-white font-medium cursor-pointer leading-tight">
                    I am the primary decision-maker in my business.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name / Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  Name
                </FormLabel>
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
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} className="input-arch" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Link */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Link (YouTube/Site/Profile){" "}
                <span className="text-muted-foreground/40 font-normal lowercase">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value || ""}
                  className="input-arch"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4-up selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* Platform */}
          <FormField
            control={form.control}
            name="primaryPlatform"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={GRID_LABEL_CLASS}>Platform</FormLabel>
                <FormControl>
                  <NativeSelect {...field} value={field.value || ""} className="input-arch">
                    <option value="">Select</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="other">Other</option>
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Audience Size */}
          <FormField
            control={form.control}
            name="followerRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={GRID_LABEL_CLASS}>Audience Size</FormLabel>
                <FormControl>
                  <NativeSelect {...field} value={field.value || ""} className="input-arch">
                    <option value="">Select</option>
                    <option value="under_10k">&lt; 10k</option>
                    <option value="10k_50k">10k - 50k</option>
                    <option value="50k_100k">50k - 100k</option>
                    <option value="100k_500k">100k - 500k</option>
                    <option value="500k_plus">500k+</option>
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Monthly Revenue */}
          <FormField
            control={form.control}
            name="monthlyRevenueRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={GRID_LABEL_CLASS}>Monthly Revenue (USD)</FormLabel>
                <FormControl>
                  <NativeSelect {...field} value={field.value || ""} className="input-arch">
                    <option value="">Select</option>
                    <option value="under_1k">&lt; $1k</option>
                    <option value="1k_3k">$1k–$3k</option>
                    <option value="3k_5k">$3k–$5k</option>
                    <option value="5k_8k">$5k–$8k</option>
                    <option value="8k_12k">$8k–$12k</option>
                    <option value="over_12k">$12k+</option>
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stuck Duration */}
          <FormField
            control={form.control}
            name="stuckDuration"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={GRID_LABEL_CLASS}>
                  How long have you been stuck in this range?
                </FormLabel>
                <FormControl>
                  <NativeSelect {...field} value={field.value || ""} className="input-arch">
                    <option value="">Select</option>
                    <option value="under_3_months">&lt; 3 months</option>
                    <option value="3_6_months">3–6 months</option>
                    <option value="6_12_months">6–12 months</option>
                    <option value="over_12_months">12+ months</option>
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Revenue Mix */}
        <div className="bg-background/30 p-6 border border-border/50">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground block">
              Estimated Revenue Breakdown (%)
            </FormLabel>

            <div className="flex items-center gap-3">
              <div className="text-[10px] uppercase text-muted-foreground/60 font-mono italic">
                Please estimate — totals should be 100%
              </div>

              <div className="text-[10px] uppercase text-muted-foreground/60 font-mono">
                Total:{" "}
                <span className={showMixWarning ? "text-primary" : "text-muted-foreground/70"}>
                  {mixTotal}%
                </span>
              </div>

              {showMixWarning && (
                <div className="flex items-center gap-1.5 text-primary/70 text-[10px] uppercase font-mono italic">
                  <AlertCircle size={10} />
                  <span>Adjust to 100%</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mixKeys.map((key) => (
              <FormItem key={key} className="space-y-1">
                <FormLabel className="text-[10px] uppercase text-muted-foreground/70">
                  {key}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="numeric"
                    placeholder="0"
                    className="input-arch text-center"
                    value={Number(revenueMix[key]) ? revenueMix[key] : ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val =
                        raw === ""
                          ? 0
                          : Math.max(0, Math.min(100, parseInt(raw, 10) || 0));
                      const current = form.getValues("revenueMix") as Record<string, number>;
                      form.setValue(
                        "revenueMix",
                        { ...current, [key]: val },
                        { shouldValidate: true }
                      );
                    }}
                    onBlur={() => form.trigger("revenueMix")}
                  />
                </FormControl>
              </FormItem>
            ))}
          </div>

          <div className="mt-3">
            <FormField
              control={form.control}
              name={"revenueMix" as any}
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* NEW: Revenue concentration */}
        <FormField
          control={form.control}
          name={"largestSourcePct" as any}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Approximately what % of your revenue comes from your single largest source?
              </FormLabel>
              <FormControl>
                <NativeSelect {...field} value={field.value || ""} className="input-arch">
                  <option value="">Select</option>
                  <option value="0_25">0–25%</option>
                  <option value="26_50">26–50%</option>
                  <option value="51_75">51–75%</option>
                  <option value="76_100">76–100%</option>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monetization flags */}
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-border/40 p-3 bg-background/20 hover:border-primary/30 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={(field.value as string[])?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const current = (field.value as string[]) || [];
                          return checked
                            ? field.onChange([...current, option.id])
                            : field.onChange(current.filter((v: string) => v !== option.id));
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

        {/* Updated worry question */}
        <FormField
          control={form.control}
          name="biggestWorry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                If your primary platform traffic dropped 50% for 90 days, what would break first in your business?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Be specific (ex: sponsors dry up, ad revenue collapses, offer conversions drop, cash runway ends, etc.)"
                  className="input-arch min-h-[110px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NEW: Why now */}
        <FormField
          control={form.control}
          name={"whyNow" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Why are you applying for this diagnostic right now?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What changed recently? What’s urgent? What triggered this now?"
                  className="input-arch min-h-[90px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Existing: openToCall + consent */}
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
              <FormItem className="space-y-2 border-t border-border/40 pt-4">
                <div className="flex flex-row items-center space-x-3 space-y-0 p-2">
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
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full btn-primary h-14 text-lg">
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Apply to Participate"}
        </Button>
      </form>
    </Form>
  );
}