import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRsvp, useListRsvps, getListRsvpsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, ChevronRight, Zap, Volume2, Car, Radio, ShieldAlert } from "lucide-react";

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

const CotaTower = () => (
  <svg viewBox="0 0 200 600" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="towerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff00ff" />
        <stop offset="50%" stopColor="#00ffff" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <filter id="neonGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <path d="M 80 600 L 120 600 L 130 150 L 70 150 Z" fill="url(#towerGlow)" opacity="0.2" />
    <path d="M 90 600 L 110 600 L 115 150 L 85 150 Z" fill="#111" stroke="#ff00ff" strokeWidth="2" filter="url(#neonGlow)" />
    <path d="M 88 550 L 112 500 M 112 550 L 88 500 M 87 450 L 113 400 M 113 450 L 87 400 M 86 350 L 114 300 M 114 350 L 86 300 M 85 250 L 115 200 M 115 250 L 85 200" stroke="#00ffff" strokeWidth="1.5" opacity="0.6" />
    <path d="M 50 150 L 150 150 L 140 120 L 60 120 Z" fill="#111" stroke="#ff00ff" strokeWidth="3" filter="url(#neonGlow)" />
    <path d="M 95 120 L 105 120 L 100 20 Z" fill="#00ffff" filter="url(#neonGlow)" />
    <circle cx="100" cy="15" r="5" fill="#fff" filter="url(#neonGlow)" />
    <rect x="65" y="130" width="70" height="10" fill="#0a0a0a" stroke="#00ffff" strokeWidth="1" />
  </svg>
);

const TeslaCar = ({ color = "#00ffff", delay = "0s", speed = "10s", style }: any) => (
  <div className="absolute bottom-0 w-32 h-12" style={{ animation: `drive ${speed} linear ${delay} infinite`, ...style }}>
    <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-[0_0_8px_currentColor]" style={{ color }}>
      <defs>
        <filter id={`carGlow-${color.replace('#', '')}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M 10 30 L 15 15 L 40 10 L 75 15 L 90 25 L 95 30 Z" fill="#111" stroke={color} strokeWidth="1.5" />
      <path d="M 20 16 L 40 12 L 65 16 L 60 20 L 25 20 Z" fill="#0a0a0a" stroke={color} strokeWidth="0.5" opacity="0.8" />
      <path d="M 85 22 L 95 24 L 92 27 L 85 25 Z" fill="#fff" filter={`url(#carGlow-${color.replace('#', '')})`} />
      <path d="M 10 24 L 12 22 L 15 25 L 12 27 Z" fill="#ff0000" filter={`url(#carGlow-${color.replace('#', '')})`} />
      <circle cx="25" cy="30" r="6" fill="#0a0a0a" stroke={color} strokeWidth="1" />
      <circle cx="75" cy="30" r="6" fill="#0a0a0a" stroke={color} strokeWidth="1" />
      <circle cx="25" cy="30" r="2" fill={color} />
      <circle cx="75" cy="30" r="2" fill={color} />
    </svg>
  </div>
);

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
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-secondary/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)_translateY(100px)_scale(2)] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-[-10vh]">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary mb-8 animate-float shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <Zap className="w-4 h-4 text-glow-cyan" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase font-bold text-glow-cyan">COTA x TESLA // MAR 18</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-none mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-600 text-glow-cyan drop-shadow-sm">ELECTRIC</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary via-fuchsia-500 to-accent text-glow-magenta mt-2">SYMPHONY</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light tracking-wide mb-12 drop-shadow-md">
            Witness the synchronized spectacle. Hundreds of vehicles, light, sound, and the iconic S-curves of Austin.
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

        <div className="absolute bottom-0 w-full h-[40vh] pointer-events-none z-10 flex justify-center items-end">
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-20" />
          <div className="w-64 h-full opacity-90 mb-[-2rem] relative z-0">
            <CotaTower />
          </div>
          
          <div className="absolute bottom-10 left-0 w-full h-32 overflow-hidden z-10 opacity-80">
            <TeslaCar color="#00ffff" speed="7s" delay="0s" style={{ bottom: '10px' }} />
            <TeslaCar color="#ff00ff" speed="11s" delay="-3s" style={{ bottom: '35px', transform: 'scale(0.85)' }} />
            <TeslaCar color="#8a2be2" speed="9s" delay="-6s" style={{ bottom: '20px', transform: 'scale(0.95)' }} />
            <TeslaCar color="#00ffff" speed="14s" delay="-1s" style={{ bottom: '45px', transform: 'scale(0.7)' }} />
            <TeslaCar color="#ff00ff" speed="8s" delay="-8s" style={{ bottom: '5px', transform: 'scale(1.1)' }} />
          </div>
        </div>
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
                Hundreds of Tesla vehicles synchronized to a custom master track. Headlights, taillights, turn signals, and falcon wing doors moving in perfect harmony with the music, transforming the COTA grid into a living, breathing canvas of light.
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
              <p className="text-muted-foreground text-sm font-light">Circuit of the Americas<br/>Austin, Texas</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent hover:border-secondary/30 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">The Date</h3>
              <p className="text-muted-foreground text-sm font-light">March 18th, 2025<br/>One Night Only</p>
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
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-glow-cyan">02 // The Fleet</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Supported <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Hardware</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { model: "Model S", tag: "Flagship", icon: <ShieldAlert className="w-6 h-6 text-primary" />, desc: "Featuring falcon wing door choreography and matrix LED sequence." },
              { model: "Model 3 / Y", tag: "Core", icon: <Radio className="w-6 h-6 text-secondary" />, desc: "The backbone of the grid. High-density formation and synchronized trunk actuation." },
              { model: "Cybertruck", tag: "Apex", icon: <Zap className="w-6 h-6 text-accent" />, desc: "Leading the vanguard with lightbar bursts and dominating presence." },
            ].map((car, idx) => (
              <div key={idx} className="group relative p-8 border border-white/10 rounded-2xl bg-black/40 hover:bg-white/5 transition-all overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-primary transition-all" />
                <div className="flex justify-between items-start mb-6">
                  {car.icon}
                  <span className="text-xs font-mono text-muted-foreground uppercase border border-white/10 px-2 py-1 rounded-sm">{car.tag}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{car.model}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{car.desc}</p>
              </div>
            ))}
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
            SYSTEM_READY // AUSTIN_TX // COTA_LIGHTSHOW_2025
          </p>
          <p className="text-white/20 text-xs mt-2 font-light">
            Not affiliated with Tesla, Inc. or Circuit of the Americas.
          </p>
        </div>
      </footer>
    </div>
  );
}
