import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRsvp, useListRsvps, getListRsvpsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Zap, Volume2, Car, Radio, ShieldAlert } from "lucide-react";
import longCenterBg from "../assets/long-center-bg.png";
import cybercabImg from "../assets/cybercab.png";
import americanFlagImg from "../assets/american-flag-nobg.png";
import texasFlagImg from "../assets/texas-flag-nobg.png";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const ROBOTS = [
  { value: "s3xy",       label: "S · 3 · X · Y",       sub: "The Classic Formation" },
  { value: "cybertruck", label: "Cybertruck 📐",  sub: "Pure Angles. Pure Steel." },
  { value: "juniper",    label: "Juniper",      sub: "Solo Spotlight" },
] as const;

const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{7,20}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  robot: z.enum(["s3xy", "cybertruck", "juniper"], { required_error: "Please select your robot" }),
  message: z.string().max(500).optional(),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;


export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createRsvp = useCreateRsvp();
  const { data: rsvpsData } = useListRsvps();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: RsvpFormValues) => {
    createRsvp.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
        queryClient.invalidateQueries({ queryKey: getListRsvpsQueryKey() });
        toast({
          title: "Access Granted",
          description: "Your RSVP has been confirmed. See you at the grid.",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.error || "Failed to submit RSVP. Please try again.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground scanline font-sans selection:bg-primary selection:text-primary-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Circuit background — full bleed */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={longCenterBg}
            alt="Tesla lightshow at Long Center Austin"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.78) saturate(1.4) contrast(1.05)' }}
          />
          {/* Dark gradient top + bottom vignette */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(0,4,14,0.55) 0%, rgba(0,4,12,0.0) 35%, rgba(0,0,0,0.45) 100%)'
          }} />
          {/* Subtle cyan glow near the cars */}
          <div className="absolute inset-0 mix-blend-screen" style={{
            background: 'radial-gradient(ellipse 80% 40% at 25% 100%, rgba(0,255,255,0.10) 0%, transparent 60%)'
          }} />
          {/* Subtle magenta on the skyline side */}
          <div className="absolute inset-0 mix-blend-screen" style={{
            background: 'radial-gradient(ellipse 60% 50% at 80% 65%, rgba(255,0,180,0.08) 0%, transparent 55%)'
          }} />
        </div>


        {/* Neon grid perspective floor */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(65deg)_translateY(120px)_scale(2.2)] opacity-40" />
        </div>

        {/* Ambient glow blobs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[130px] pointer-events-none mix-blend-screen z-[2]" />
        <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-secondary/12 rounded-full blur-[160px] pointer-events-none mix-blend-screen z-[2]" />

        {/* Main content — upper area */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-[-28vh]">
          <div className="inline-flex items-center gap-3 max-md:gap-2 px-6 py-3 max-md:px-4 max-md:py-2 rounded-full border border-primary/70 bg-primary/15 text-primary mb-8 animate-float shadow-[0_0_24px_rgba(0,255,255,0.45)] backdrop-blur-md">
            <Zap className="w-5 h-5 max-md:w-4 max-md:h-4 text-primary drop-shadow-[0_0_6px_rgba(0,255,255,0.9)]" />
            <span className="text-sm max-md:text-xs font-mono tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]">AUSTIN x TESLA // APR 24</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-6 drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500 text-glow-cyan">Worldwide Fantasy</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-fuchsia-500 to-accent text-glow-magenta mt-2">Lightshow</span>
            <span className="block text-lg md:text-3xl lg:text-4xl text-white mt-3 tracking-[0.15em]">Mothership Edition</span>
          </h1>

        </div>

        {/* Button — pinned to bottom of hero */}
        <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-5 text-lg font-bold tracking-widest uppercase box-glow-cyan transition-all hover:scale-105 active:scale-95"
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-scroll-rsvp"
          >
            <ChevronLeft className="mr-2 w-5 h-5" /> Secure Your Spot <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Texas flag — top-left */}
        <div className="absolute top-6 left-6 z-30">
          <img
            src={texasFlagImg}
            alt="Texas Flag"
            className="w-16 h-12 object-contain"
            style={{ filter: "drop-shadow(0 0 8px rgba(0,255,255,0.7)) drop-shadow(0 0 16px rgba(0,255,255,0.4))" }}
          />
        </div>

        {/* American flag — top-right */}
        <div className="absolute top-6 right-6 z-30">
          <img
            src={americanFlagImg}
            alt="American Flag"
            className="w-24 h-16 object-contain"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,80,80,0.7)) drop-shadow(0 0 16px rgba(255,80,80,0.4))" }}
          />
        </div>

        {/* Bottom fade to page background */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[5]" />
      </section>

      {/* 2. THE SPECTACLE SECTION */}
      <section className="pt-12 pb-12 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 border-secondary bg-secondary/5 text-secondary">
                <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-magenta">01 // The Spectacle</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
                Choreographed <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Perfection</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Tesla robots synchronized in a worldwide fantasy lightshow lighting up Austin's Long Center for one unforgettable night, choreographed by our legendary lightshow master&nbsp;
                <a
                  href="https://xlightshows.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold transition-all duration-300 hover:opacity-80"
                  style={{
                    background: "linear-gradient(90deg, #00e5f5, #ff00ff, #ea8e2a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 8px rgba(0,229,245,0.6))",
                  }}
                >
                  Simon Pollock
                </a>
                &nbsp;✨ headlights, taillights, turn signals, and falcon wing doors moving in perfect harmony, transforming the Long Center into a living, breathing canvas of light.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-xl hover:bg-white/[0.03] transition-all">
                  <Volume2 className="w-8 h-8 text-primary mb-4" />
                  <h4 className="text-lg font-bold mb-2">Immersive Audio</h4>
                  <p className="text-sm text-muted-foreground">Custom mixed track broadcasted directly through each Tesla's speakers in perfect sync.</p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-xl hover:bg-white/[0.03] transition-all">
                  <Zap className="w-8 h-8 text-secondary mb-4" />
                  <h4 className="text-lg font-bold mb-2">Lumen Overload</h4>
                  <p className="text-sm text-muted-foreground">Millions of LED lumens pulsing simultaneously, creating a visible spectacle miles away.</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[220px] md:h-[600px] rounded-3xl border border-white/10 bg-black overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.2)_0%,transparent_70%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-[spin_20s_linear_infinite] opacity-30">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent absolute top-1/2 -translate-y-1/2" />
                <div className="w-1 h-full bg-gradient-to-b from-transparent via-secondary to-transparent absolute left-1/2 -translate-x-1/2" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={cybercabImg}
                  alt="Tesla Cybercab"
                  className="w-2/3 h-2/3 object-contain mx-auto -translate-y-10 group-hover:scale-105 transition-transform duration-700"
                  style={{
                    filter: "drop-shadow(0 0 18px rgba(0,255,255,0.5)) drop-shadow(0 0 40px rgba(0,255,255,0.2)) saturate(0.8) brightness(0.95) contrast(1.1)",
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="font-mono text-sm text-primary tracking-widest uppercase">System Sync // 100%</p>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent w-full animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT DETAILS SECTION */}
      <section className="pt-12 pb-12 relative z-20 border-y border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent transition-colors group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Venue</h3>
              <p className="text-muted-foreground text-sm font-light">Long Center for the Performing Arts<br/>Austin, Texas</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent transition-colors group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Date</h3>
              <p className="text-muted-foreground text-sm font-light">April 24th, 2026<br/>One Night Only</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Schedule</h3>
              <p className="text-muted-foreground text-sm font-light">Assemble: 8:00 PM<br/>Show Start: 8:30 PM</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10 text-white">Grid Count</h3>
              <p className="text-4xl font-mono text-white text-glow-cyan relative z-10 font-bold" data-testid="text-rsvp-count">
                {rsvpsData ? rsvpsData.total : "..."}
              </p>
              <p className="text-xs text-primary uppercase tracking-widest mt-2 relative z-10 font-bold">Confirmed Supervisors</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE FLEET */}
      <section className="pt-12 pb-12 relative z-20 bg-background overflow-hidden">
        {/* Dynamic background rings */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-transparent border-[1px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-transparent border-[1px] border-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-transparent border-[2px] border-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 box-glow-cyan" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 border-primary bg-primary/5 text-primary mb-6">
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-cyan">02 // The Fleet</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Supported <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Robots</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Show 1 — S 3 X Y */}
            <div className="group relative p-8 border border-white/10 rounded-2xl bg-black/40 hover:bg-white/5 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:opacity-100 opacity-50 transition-all" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">S·3·X·Y</span>
                <span className="text-xs font-mono text-primary/60 uppercase border border-primary/20 px-2 py-1 rounded-sm">Act I</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">The Classic Formation</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Model S, 3, X &amp; Y roll in synchronized harmony — headlights, taillights, falcon wings, and trunk pops dancing to the beat. Yes, the lineup spells it out. 😏
              </p>
              <div className="mt-6 flex gap-2 flex-wrap">
                {["Model S", "Model 3", "Model X", "Model Y"].map(m => (
                  <span key={m} className="text-[10px] font-mono uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-sm">{m}</span>
                ))}
              </div>
            </div>

            {/* Show 2 — Cybertruck */}
            <div className="group relative p-8 border border-white/10 rounded-2xl bg-black/40 hover:bg-white/5 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent group-hover:opacity-100 opacity-50 transition-all" />
              <div className="flex justify-between items-start mb-6">
                <svg viewBox="0 0 60 52" className="w-12 h-10" fill="none">
                  <polygon points="30,4 56,48 4,48" stroke="url(#tgrad)" strokeWidth="2.5" fill="rgba(255,0,255,0.08)" />
                  <polygon points="30,16 46,44 14,44" stroke="url(#tgrad)" strokeWidth="1.5" fill="rgba(255,0,255,0.04)" strokeDasharray="4 2" />
                  <defs>
                    <linearGradient id="tgrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="100%" stopColor="#00ffff" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xs font-mono text-secondary/60 uppercase border border-secondary/20 px-2 py-1 rounded-sm">Act II</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Cybertruck 📐</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Pure angles. Pure steel. Cybertrucks form a massive 📐 formation — lightbars blazing in geometric sync, proving that the future is very pointy.
              </p>
              <div className="mt-6 flex gap-2 flex-wrap">
                {["Cybertruck", "Triangle Formation", "Lightbar Sync"].map(m => (
                  <span key={m} className="text-[10px] font-mono uppercase tracking-wider bg-secondary/10 border border-secondary/20 text-secondary px-2 py-1 rounded-sm">{m}</span>
                ))}
              </div>
            </div>

            {/* Show 3 — Y Juniper */}
            <div className="group relative p-8 border border-white/10 rounded-2xl bg-black/40 hover:bg-white/5 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:opacity-100 opacity-50 transition-all" />
              <div className="flex justify-between items-start mb-6">
                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                  <path d="M24 44 C24 44 6 30 6 18 C6 10 14 4 24 4 C34 4 42 10 42 18 C42 30 24 44 24 44Z" stroke="url(#jgrad)" strokeWidth="2" fill="rgba(160,32,240,0.1)" />
                  <line x1="24" y1="44" x2="24" y2="20" stroke="url(#jgrad)" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="jgrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ffff" />
                      <stop offset="100%" stopColor="#a020f0" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xs font-mono text-accent/60 uppercase border border-accent/20 px-2 py-1 rounded-sm">Act III</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Juniper</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                The refreshed Juniper takes a solo spotlight — sleeker face, ambient cabin glow, and an all-new light signature that turns the night air electric violet.
              </p>
              <div className="mt-6 flex gap-2 flex-wrap">
                {["Juniper", "Solo Spotlight", "Ambient Glow"].map(m => (
                  <span key={m} className="text-[10px] font-mono uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent px-2 py-1 rounded-sm">{m}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. RSVP SECTION */}
      <section id="rsvp" className="pt-12 pb-12 relative z-20 bg-black/80">
        <style>{`
          @keyframes neonFlickerCyan {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
              text-shadow: 0 0 4px #fff, 0 0 10px #fff, 0 0 20px #00FFFF, 0 0 40px #00FFFF, 0 0 80px #00FFFF, 0 0 120px #00FFFF;
            }
            20%, 24%, 55% { opacity: 0.5; text-shadow: none; }
          }
          @keyframes neonFlickerGold {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
              text-shadow: 0 0 4px #fff, 0 0 10px #ea8e2a, 0 0 30px #ea8e2a, 0 0 60px #ea8e2a;
            }
            20%, 24%, 55% { opacity: 0.5; text-shadow: none; }
          }
          @keyframes neonFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
              text-shadow: 0 0 8px #ea8e2a, 0 0 20px #ea8e2a, 0 0 40px #ea8e2a;
            }
            20%, 24%, 55% { opacity: 0.4; text-shadow: none; }
          }
        `}</style>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-y-8 md:gap-16">

          {/* 03 content — mobile order 1, desktop col 1 row 1 */}
          <div className="order-1 md:order-none md:col-start-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 border-accent bg-accent/5 text-accent mb-6">
                <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-magenta">03 // Initialization</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-none">
                Join The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Frequency</span>
              </h2>
              <p className="text-muted-foreground mb-10 text-lg font-light">
                Register your robot to join the largest synchronized worldwide lightshow in history.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center shrink-0 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <span className="font-mono text-primary font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Tune In</h4>
                    <p className="text-muted-foreground text-sm">Fill out the form to lock in your frequency and claim your spot at the Long Center.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full border border-secondary/50 flex items-center justify-center shrink-0 bg-secondary/10 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                    <span className="font-mono text-secondary font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Lock Your Signal</h4>
                    <p className="text-muted-foreground text-sm">Your confirmation and venue details will be transmitted directly to your inbox.</p>
                  </div>
                </div>
              </div>
          </div>

          {/* Tech Support — mobile order 3 (after form), desktop col 1 row 2, nudged up */}
          <div className="order-3 md:order-none md:col-start-1 md:-mt-12">
              <div className="border-t border-white/10 pt-8 flex flex-col items-center text-center">
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.5rem", color: "#ea8e2a", animation: "neonFlickerGold 3s infinite" }}>⚡</span>
                  <span style={{
                    fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                    fontWeight: 900,
                    fontFamily: "monospace",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#00e5f5",
                    animation: "neonFlicker 3s infinite",
                  }}>
                    TECH SUPPORT
                  </span>
                  <span style={{ fontSize: "1.5rem", color: "#ea8e2a", animation: "neonFlickerGold 3s infinite" }}>⚡</span>
                </div>
                <p className="text-white/40 text-sm mb-5">Have a question? Reach out below.</p>
                {[{ username: "RimaSukhadia", display: "📐_Cyber_Owl_🦉", role: "Website and event inquiries" }].map(({ username, display, role }) => (
                  <a
                    key={username}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      if (isMobile) { window.location.href = `twitter://user?screen_name=${username}`; }
                      else { window.open(`https://x.com/${username}`, "_blank", "noopener,noreferrer"); }
                    }}
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-primary/30 shadow-[0_0_18px_rgba(0,255,255,0.15)] hover:border-primary/60 hover:shadow-[0_0_32px_rgba(0,255,255,0.35)] transition-all duration-300"
                    style={{ background: "#0d1117" }}
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-primary/50 shadow-[0_0_12px_rgba(0,255,255,0.4)] overflow-hidden relative flex items-center justify-center bg-white/5 shrink-0">
                      <img src={`https://unavatar.io/twitter/${username}`} alt={username} className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.nextSibling as HTMLElement).style.display = "block"; }} />
                      <svg viewBox="0 0 24 24" className="hidden w-6 h-6 fill-white/30" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="font-bold text-white text-base leading-tight">{display}</p>
                      <p className="text-primary font-mono text-xs">@{username}</p>
                      <p className="text-white/40 text-xs mt-0.5">{role}</p>
                    </div>
                    <span className="text-sm text-primary/60 group-hover:text-primary font-mono font-bold tracking-wider transition-colors ml-auto shrink-0">→ X</span>
                  </a>
                ))}
              </div>
          </div>

          {/* Form — mobile order 2 (between 03 content and tech support), desktop col 2 spanning both rows */}
          <div className="order-2 md:order-none md:col-start-2 md:row-start-1 md:row-span-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/10 to-accent/30 blur-3xl -z-10 rounded-[3rem]" />
            
            <Card className="border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
              
              <CardContent className="p-8 md:p-10">
                {isSuccess ? (
                  <div className="text-center py-16 space-y-6" data-testid="success-state">
                    <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,255,255,0.4)]">
                      <Zap className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-glow-cyan">System Updated</h3>
                    <p className="text-muted-foreground font-light text-lg">
                      Your coordinates have been logged. Prepare for the sequence.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSuccess(false);
                        form.reset();
                      }}
                      className="mt-8 border-white/20 text-white hover:bg-white/10 w-full h-14 uppercase tracking-widest text-sm font-bold"
                    >
                      Register Another Robot
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Pilot Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} className="bg-black/80 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-14 rounded-xl px-4 text-lg" data-testid="input-name" />
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
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Comms Link (Email)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="pilot@tesla.com" {...field} className="bg-black/80 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-14 rounded-xl px-4 text-lg" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="robot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Your Robot (Select One)</FormLabel>
                            <div className="grid grid-cols-1 gap-2 mt-1">
                              {ROBOTS.map((r) => (
                                <button
                                  key={r.value}
                                  type="button"
                                  onClick={() => field.onChange(r.value)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                                    field.value === r.value
                                      ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(0,255,255,0.25)]"
                                      : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5"
                                  }`}
                                >
                                  <div>
                                    <p className="font-bold text-sm tracking-wide">
                                      {r.value === "s3xy" ? (
                                        <>
                                          <span style={{ color: "#89CFF0" }}>S</span>
                                          <span className="text-white/40"> · </span>
                                          <span style={{ color: "#FFFFFF" }}>3</span>
                                          <span className="text-white/40"> · </span>
                                          <span style={{ color: "#EF4444" }}>X</span>
                                          <span className="text-white/40"> · </span>
                                          <span style={{ color: "#60A5FA" }}>Y</span>
                                        </>
                                      ) : r.value === "cybertruck" ? (
                                        <>
                                          <span style={{color:"#C0C8D8"}}>C</span><span style={{color:"#7EC8E3"}}>y</span><span style={{color:"#A8D4E8"}}>b</span><span style={{color:"#90C4D8"}}>e</span><span style={{color:"#D0DCE8"}}>r</span><span style={{color:"#7EC8E3"}}>t</span><span style={{color:"#B8D0E0"}}>r</span><span style={{color:"#A0D8EF"}}>u</span><span style={{color:"#C8D8E8"}}>c</span><span style={{color:"#6CB8D4"}}>k</span><span style={{color:"#A0D8EF"}}> 📐</span>
                                        </>

                                      ) : r.value === "juniper" ? (
                                        <span style={{background:"linear-gradient(90deg, #FF4444, #FFFFFF, #4488FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Juniper</span>
                                      ) : r.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">{r.sub}</p>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${field.value === r.value ? "border-primary bg-primary" : "border-white/20"}`} />
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Uplink <span className="text-white/30 normal-case tracking-normal">(optional)</span></FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(512) 000-0000"
                                {...field}
                                onChange={(e) => field.onChange(formatPhone(e.target.value))}
                                className="bg-black/80 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-14 rounded-xl px-4 text-lg"
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-16 bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-black tracking-widest uppercase text-lg rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                        disabled={createRsvp.isPending}
                        data-testid="button-submit-rsvp"
                      >
                        {createRsvp.isPending ? (
                          <span className="flex items-center gap-2">
                            <Zap className="w-5 h-5 animate-pulse" /> Transmitting...
                          </span>
                        ) : "RSVP"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-white/10 text-center relative z-20 bg-background overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex gap-4 mb-4">
            <div className="w-1 h-4 bg-primary" />
            <div className="w-1 h-4 bg-secondary" />
            <div className="w-1 h-4 bg-accent" />
          </div>
          <p className="text-white/40 font-mono text-sm tracking-[0.3em] uppercase">
            SYSTEM_READY // AUSTIN_TX // LONG_CENTER_LIGHTSHOW_2026
          </p>
          <p className="text-white/20 text-xs mt-2 font-light">
            Not affiliated with Tesla, Inc. or Long Center for the Performing Arts.
          </p>
        </div>
      </footer>

      {/* Scroll to top — pinned top-right */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full border border-primary/70 bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_0_8px_rgba(0,255,255,0.3)] hover:bg-primary/35 hover:border-primary hover:shadow-[0_0_16px_rgba(0,255,255,0.6)] transition-all duration-300"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Scroll to bottom — pinned bottom-right */}
      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        className="fixed bottom-4 right-4 z-50 w-8 h-8 rounded-full border border-primary/70 bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_0_8px_rgba(0,255,255,0.3)] hover:bg-primary/35 hover:border-primary hover:shadow-[0_0_16px_rgba(0,255,255,0.6)] transition-all duration-300"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
