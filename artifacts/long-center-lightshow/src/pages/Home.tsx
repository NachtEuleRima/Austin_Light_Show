import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRsvp, useListRsvps, getListRsvpsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, ChevronRight, Zap, Volume2, Car, Radio, ShieldAlert } from "lucide-react";
import longCenterBg from "../assets/long-center-bg.png";
import americanFlagImg from "../assets/american-flag.png";
import texasFlagImg from "../assets/texas-flag.png";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  guests: z.coerce.number().min(1).max(10),
  message: z.string().max(500).optional(),
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;


export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createRsvp = useCreateRsvp();
  const { data: rsvpsData } = useListRsvps();
  
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      guests: 1,
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
            alt="Long Center for the Performing Arts at night"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.5) saturate(1.3) contrast(1.05)' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(0,8,18,0.6) 0%, rgba(0,4,12,0.15) 40%, rgba(0,0,0,0.65) 100%)'
          }} />
          {/* Neon glow overlays */}
          <div className="absolute inset-0 mix-blend-screen" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,255,0.08) 0%, transparent 70%)'
          }} />
          <div className="absolute inset-0 mix-blend-screen" style={{
            background: 'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(180,0,255,0.07) 0%, transparent 60%)'
          }} />
        </div>


        {/* Neon grid perspective floor */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(65deg)_translateY(120px)_scale(2.2)] opacity-40" />
        </div>

        {/* Ambient glow blobs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[130px] pointer-events-none mix-blend-screen z-[2]" />
        <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-secondary/12 rounded-full blur-[160px] pointer-events-none mix-blend-screen z-[2]" />

        {/* Main content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-[-8vh]">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary mb-8 animate-float shadow-[0_0_15px_rgba(0,255,255,0.2)] backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase font-bold">AUSTIN x TESLA // APR 24</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-6 drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500 text-glow-cyan">Worldwide Fantasy</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-fuchsia-500 to-accent text-glow-magenta mt-2">Lightshow</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 mt-3 tracking-[0.15em]">Mothership Edition</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light tracking-wide mb-12 drop-shadow-md">
            Witness the synchronized spectacle. Hundreds of Tesla vehicles light up the Long Center — Austin's iconic waterfront venue — for one unforgettable night.
          </p>

          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg font-bold tracking-widest uppercase box-glow-cyan transition-all hover:scale-105 active:scale-95"
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-scroll-rsvp"
          >
            Secure Your Spot <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Flags top-right */}
        <div className="absolute top-6 right-6 z-30 flex gap-3 items-center">
          <img
            src={texasFlagImg}
            alt="Texas Flag"
            className="w-16 h-12 object-cover rounded shadow-[0_0_14px_rgba(0,255,255,0.4)] border border-white/10"
          />
          <img
            src={americanFlagImg}
            alt="American Flag"
            className="w-16 h-12 object-cover rounded shadow-[0_0_14px_rgba(255,80,80,0.5)] border border-white/10"
          />
        </div>

        {/* Bottom fade to page background */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[5]" />
      </section>

      {/* 2. THE SPECTACLE SECTION */}
      <section className="py-32 relative z-20 overflow-hidden">
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
                Hundreds of Tesla vehicles synchronized to a custom master track. Headlights, taillights, turn signals, and falcon wing doors moving in perfect harmony with the music, transforming the Long Center into a living, breathing canvas of light.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-xl hover:bg-white/[0.03] transition-all">
                  <Volume2 className="w-8 h-8 text-primary mb-4" />
                  <h4 className="text-lg font-bold mb-2">Immersive Audio</h4>
                  <p className="text-sm text-muted-foreground">Custom mixed track broadcasted across the circuit's PA system and directly into vehicles.</p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-xl hover:bg-white/[0.03] transition-all">
                  <Zap className="w-8 h-8 text-secondary mb-4" />
                  <h4 className="text-lg font-bold mb-2">Lumen Overload</h4>
                  <p className="text-sm text-muted-foreground">Millions of LED lumens pulsing simultaneously, creating a visible spectacle miles away.</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-3xl border border-white/10 bg-black overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.2)_0%,transparent_70%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-[spin_20s_linear_infinite] opacity-30">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent absolute top-1/2 -translate-y-1/2" />
                <div className="w-1 h-full bg-gradient-to-b from-transparent via-secondary to-transparent absolute left-1/2 -translate-x-1/2" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="w-48 h-48 text-primary opacity-80 filter drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] group-hover:scale-110 transition-transform duration-700" />
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
      <section className="py-24 relative z-20 border-y border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent hover:border-primary/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Venue</h3>
              <p className="text-muted-foreground text-sm font-light">Long Center for the Performing Arts<br/>Austin, Texas</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent hover:border-secondary/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Date</h3>
              <p className="text-muted-foreground text-sm font-light">April 24th, 2025<br/>One Night Only</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent hover:border-accent/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Schedule</h3>
              <p className="text-muted-foreground text-sm font-light">Gates Open: 7:00 PM<br/>Sequence Start: 9:00 PM</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent hover:border-primary/50 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10 text-white">Grid Count</h3>
              <p className="text-4xl font-mono text-white text-glow-cyan relative z-10 font-bold" data-testid="text-rsvp-count">
                {rsvpsData ? rsvpsData.total : "..."}
              </p>
              <p className="text-xs text-primary uppercase tracking-widest mt-2 relative z-10 font-bold">Confirmed RSVPs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE FLEET */}
      <section className="py-32 relative z-20 bg-background overflow-hidden">
        {/* Dynamic background rings */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-transparent border-[1px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-transparent border-[1px] border-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-transparent border-[2px] border-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 box-glow-cyan" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 border-primary bg-primary/5 text-primary mb-6">
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-cyan">02 // The Shows</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Three <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Acts</span>
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
                {/* Triangle motif */}
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
              <h3 className="text-2xl font-bold mb-3">Cybertruck Triangle</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Pure angles. Pure steel. Cybertrucks form a massive triangle formation — lightbars blazing in geometric sync, proving that the future is very pointy.
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
                {/* Leaf/juniper icon */}
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
              <h3 className="text-2xl font-bold mb-3">Model Y Juniper</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                The refreshed Juniper takes a solo spotlight — sleeker face, ambient cabin glow, and an all-new light signature that turns the night air electric violet.
              </p>
              <div className="mt-6 flex gap-2 flex-wrap">
                {["Model Y Juniper", "Solo Spotlight", "Ambient Glow"].map(m => (
                  <span key={m} className="text-[10px] font-mono uppercase tracking-wider bg-accent/10 border border-accent/20 text-accent px-2 py-1 rounded-sm">{m}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. RSVP SECTION */}
      <section id="rsvp" className="py-32 relative z-20 bg-black/80">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 border-accent bg-accent/5 text-accent mb-6">
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-magenta">03 // Initialization</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-none">
              Join The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Circuit</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg font-light">
              Space on the grid is limited. Register your vehicle or RSVP as a spectator to witness the largest synchronized lightshow in Texas history.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center shrink-0 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <span className="font-mono text-primary font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Log Credentials</h4>
                  <p className="text-muted-foreground text-sm">Fill out the secure form to transmit your data to the master server.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-secondary/50 flex items-center justify-center shrink-0 bg-secondary/10 shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                  <span className="font-mono text-secondary font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Receive Protocol</h4>
                  <p className="text-muted-foreground text-sm">Your unique access QR and grid coordinates will be sent via email.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
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
                      Register Another Unit
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
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Crew Size (Including Pilot)</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger className="bg-black/80 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-14 rounded-xl px-4 text-lg" data-testid="select-guests">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()} className="focus:bg-white/10 focus:text-white cursor-pointer py-3">
                                    {num} {num === 1 ? "Unit" : "Units"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Optional Transmission</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Vehicle model, special requests, or club affiliation..." 
                                className="resize-none bg-black/80 border-white/10 focus-visible:ring-primary focus-visible:border-primary h-28 rounded-xl p-4 text-lg"
                                {...field}
                                data-testid="input-message"
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
                        ) : "Confirm Access"}
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
            SYSTEM_READY // AUSTIN_TX // LONG_CENTER_LIGHTSHOW_2025
          </p>
          <p className="text-white/20 text-xs mt-2 font-light">
            Not affiliated with Tesla, Inc. or Long Center for the Performing Arts.
          </p>
        </div>
      </footer>
    </div>
  );
}
