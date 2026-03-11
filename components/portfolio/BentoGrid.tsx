"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import {
  Sparkles,
  Rocket,
  Code2,
  Palette,
  Globe,
  Zap,
  Database,
  Layers,
  ArrowUpRight,
  Mail,
  MapPin,
  Clock,
  Coffee,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "project-1",
    title: "AI Dashboard",
    description: "Real-time analytics powered by machine learning with predictive insights and automated reporting.",
    tags: ["React", "Python", "TensorFlow"],
    color: "from-violet-500 to-purple-600",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "project-2",
    title: "E-Commerce Platform",
    description: "Full-stack marketplace with payment integration, inventory management, and user analytics.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    color: "from-pink-500 to-rose-600",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: "project-3",
    title: "Design System",
    description: "Comprehensive component library with 50+ accessible components and theming support.",
    tags: ["TypeScript", "Storybook", "Figma"],
    color: "from-cyan-500 to-blue-600",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    id: "project-4",
    title: "Cloud Infrastructure",
    description: "Scalable microservices architecture with containerization and CI/CD pipelines.",
    tags: ["AWS", "Docker", "Kubernetes"],
    color: "from-orange-500 to-amber-600",
    icon: <Database className="w-6 h-6" />,
  },
];

const techStack = [
  { name: "React", icon: <Code2 className="w-5 h-5" />, color: "from-cyan-400 to-blue-500" },
  { name: "Next.js", icon: <Layers className="w-5 h-5" />, color: "from-gray-400 to-gray-600" },
  { name: "TypeScript", icon: <Zap className="w-5 h-5" />, color: "from-blue-400 to-blue-600" },
  { name: "Node.js", icon: <Globe className="w-5 h-5" />, color: "from-green-400 to-green-600" },
];

interface BentoGridProps {
  onProjectClick: (project: Project) => void;
  onAboutClick: () => void;
  onStackClick: () => void;
  onContactClick?: () => void;
}

export function BentoGrid({ onProjectClick, onAboutClick, onStackClick, onContactClick }: BentoGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
        {/* About Me - Large Card */}
        <GlassCard
          className="md:col-span-2 md:row-span-2"
          onClick={onAboutClick}
          delay={0}
          floating
        >
          <div className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-chart-2 flex items-center justify-center shadow-xl shadow-primary/20"
                whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
              >
                <span className="text-3xl font-bold text-primary-foreground">JD</span>
              </motion.div>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="p-2 rounded-lg bg-white/5"
              >
                <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Jane Developer</h2>
            <p className="text-primary font-medium mb-3">Full-Stack Engineer & Designer</p>
            <p className="text-muted-foreground leading-relaxed flex-1 text-sm">
              Creative developer crafting digital experiences. 
              I blend design aesthetics with technical excellence 
              to build products that inspire and engage.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Open to Work", "Remote", "San Francisco"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary flex items-center gap-1"
                >
                  {i === 2 && <MapPin className="w-3 h-3" />}
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Tech Stack Card */}
        <GlassCard
          className="md:col-span-1 lg:col-span-2"
          onClick={onStackClick}
          delay={0.1}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Tech Stack</h3>
              <motion.div whileHover={{ rotate: 45 }}>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br ${tech.color} text-white shadow-lg`}
                >
                  {tech.icon}
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Stats Card - Experience */}
        <GlassCard className="md:col-span-1" delay={0.15}>
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Experience</span>
            </div>
            <div>
              <motion.span 
                className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                5+
              </motion.span>
              <span className="text-muted-foreground ml-2">Years</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent flex-1 origin-left"
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Coffee Counter - Fun Widget */}
        <GlassCard className="md:col-span-1" delay={0.2}>
          <div className="h-full flex flex-col justify-between items-center text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
            >
              <Coffee className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className="text-3xl font-bold text-foreground">2,847</span>
              <p className="text-sm text-muted-foreground">Cups of coffee</p>
            </div>
            <motion.div 
              className="w-full h-1 rounded-full bg-secondary overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ delay: 0.6, duration: 1 }}
              />
            </motion.div>
          </div>
        </GlassCard>

        {/* Projects Grid */}
        {projects.map((project, index) => (
          <GlassCard
            key={project.id}
            onClick={() => onProjectClick(project)}
            delay={0.25 + index * 0.05}
            className={index === 0 ? "md:col-span-2" : ""}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {project.icon}
                </motion.div>
                <motion.div whileHover={{ rotate: 45 }}>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}

        {/* Contact Card */}
        <GlassCard 
          className="md:col-span-1 lg:col-span-2" 
          delay={0.45} 
          floating
          onClick={onContactClick}
        >
          <div className="h-full flex items-center gap-6">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0, 200, 255, 0.3)",
                  "0 0 40px rgba(0, 200, 255, 0.6)",
                  "0 0 20px rgba(0, 200, 255, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-chart-2 flex items-center justify-center flex-shrink-0"
            >
              <Mail className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-1">{"Let's Connect"}</h3>
              <p className="text-sm text-muted-foreground">Available for freelance projects and full-time opportunities</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 45 }}
              className="p-3 rounded-xl bg-primary/20"
            >
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
