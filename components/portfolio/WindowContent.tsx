"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Code2,
  Layers,
  Zap,
  Globe,
  Database,
  Palette,
  Server,
  Smartphone,
  TestTube,
  Cloud,
  Lock,
  Terminal,
  Download,
  Send,
  Linkedin,
  Twitter,
  Phone,
  FileText,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  GraduationCap,
  FolderKanban,
  User,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
}

const defaultProjects = [
  {
    id: "garden-genie",
    title: "Garden Genie - IoT Plant Monitoring",
    description: "Intelligent urban gardening solution with real-time sensor-based plant health monitoring and AI chatbot",
    tags: ["Arduino", "IoT", "Mobile App", "Sensors"],
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "gas-detection",
    title: "Gas Leakage Detection System",
    description: "Automated gas detection system with GSM-based IVR alerts and real-time LCD monitoring",
    tags: ["Arduino", "MQ Sensors", "GSM", "Embedded C"],
    color: "from-red-500 to-orange-600",
  },
  {
    id: "rfid-hospital",
    title: "RFID Hospital Management",
    description: "Patient identification and tracking system with automated medical record retrieval",
    tags: ["RFID", "Arduino", "SQL", "Database"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "mimetic",
    title: "Mimetic - AI Content Platform",
    description: "AI-powered content repurposing platform for digital creators - CIE Ignite Stage 2 Shortlisted",
    tags: ["HTML5", "CSS3", "JavaScript", "UI/UX"],
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "smoke-detection",
    title: "Automated Smoke Detection",
    description: "Early fire hazard warning system using MQ2 sensor with threshold-based alerts",
    tags: ["Arduino Uno", "MQ2 Sensor", "Embedded C"],
    color: "from-amber-500 to-red-600",
  },
];

export function ProjectWindowContent({ project }: { project?: Project }) {
  // If no specific project, show projects gallery
  if (!project) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-muted-foreground mt-1">A selection of my recent work</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {defaultProjects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-secondary/50 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${proj.color} flex items-center justify-center text-white shadow-lg`}>
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{proj.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white shadow-lg`}
        >
          {project.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
        <ul className="space-y-2">
          {[
            "Responsive design optimized for all devices",
            "Real-time data synchronization",
            "Comprehensive analytics dashboard",
            "Role-based access control",
          ].map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-foreground/80"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Live Demo
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium"
        >
          <Github className="w-4 h-4" />
          Source Code
        </motion.button>
      </div>
    </motion.div>
  );
}

export function AboutWindowContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-xl"
        >
          KD
        </motion.div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground">Karthik Devaraj</h2>
          <p className="text-lg text-primary mt-1">Data & IoT Engineering Intern</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Bengaluru, Karnataka
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              PES University (2026)
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">About Me</h3>
        <p className="text-foreground/80 leading-relaxed">
          {`I am an Intelligence Analyst and Computer Applications graduate who thrives at the intersection of data analytics, market research, and tech-driven operations. Currently delivering consumer intelligence at Consuma AI, my background blends rigorous analytical thinking with hands-on experience managing high-volume event operations and ticketing data for 35+ large-scale events at Paytm Insider. From transforming unstructured consumer data into strategic insights to engineering functional IoT systems, I build scalable solutions that bridge the gap between technical execution and real-world impact.`}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Projects", value: "5+" },
          { label: "Distinctions", value: "3" },
          { label: "Events", value: "35+" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-4 rounded-xl bg-secondary/50"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Contact */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open("mailto:findkarthik7@yahoo.com")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          <Mail className="w-4 h-4" />
          Contact Me
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open("https://www.linkedin.com/in/karthik-devaraj-755241356/", "_blank")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </motion.button>
      </div>
    </motion.div>
  );
}

const fullTechStack = [
  { category: "Programming Languages", items: [
    { name: "Python", icon: <Terminal className="w-4 h-4" /> },
    { name: "Embedded C", icon: <Code2 className="w-4 h-4" /> },
    { name: "JavaScript", icon: <Zap className="w-4 h-4" /> },
    { name: "SQL", icon: <Database className="w-4 h-4" /> },
  ]},
  { category: "Embedded Systems & IoT", items: [
    { name: "Arduino", icon: <Layers className="w-4 h-4" /> },
    { name: "MQ Sensors", icon: <Server className="w-4 h-4" /> },
    { name: "RFID (RC522)", icon: <Globe className="w-4 h-4" /> },
    { name: "GSM Modules", icon: <Smartphone className="w-4 h-4" /> },
  ]},
  { category: "Data & Operations", items: [
    { name: "Data Analysis (Excel / SQL)", icon: <Database className="w-4 h-4" /> },
    { name: "Ticketing & Box Office", icon: <Layers className="w-4 h-4" /> },
    { name: "Git / VS Code", icon: <Terminal className="w-4 h-4" /> },
    { name: "HTML5 / CSS3", icon: <Palette className="w-4 h-4" /> },
  ]},
];

export function StackWindowContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Skills Stack</h2>
        <p className="text-muted-foreground mt-1">
          Technologies I use to bring ideas to life
        </p>
      </div>

      {fullTechStack.map((category, categoryIndex) => (
        <div key={category.category} className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
          <div className="grid grid-cols-2 gap-3">
            {category.items.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: categoryIndex * 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  {tech.icon}
                </div>
                <span className="font-medium text-foreground">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function ContactWindowContent() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
        <p className="text-muted-foreground mt-1">
          {`I'd love to hear from you. Send me a message!`}
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Mail className="w-5 h-5" />, label: "Email", value: "findkarthik7@yahoo.com", color: "from-blue-500 to-cyan-500", href: "mailto:findkarthik7@yahoo.com" },
          { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91 7411530867", color: "from-green-500 to-emerald-500", href: "tel:+917411530867" },
          { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "karthik-devaraj", color: "from-blue-600 to-blue-700", href: "https://www.linkedin.com/in/karthik-devaraj-755241356/" },
          { icon: <Github className="w-5 h-5" />, label: "GitHub", value: "Darkdemon75", color: "from-gray-600 to-gray-700", href: "https://github.com/Darkdemon75" },
        ].map((contact, i) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => window.open(contact.href, "_blank")}
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${contact.color} flex items-center justify-center text-white`}>
              {contact.icon}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{contact.label}</div>
              <div className="text-sm font-medium text-foreground">{contact.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Send a Message</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="email"
            placeholder="Your email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            placeholder="Your message"
            rows={4}
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            <Send className="w-4 h-4" />
            Send Message
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function ResumeWindowContent() {
  const experience = [
    { title: "Intelligence Analyst Intern", company: "Consuma AI", period: "Feb 2026 - Present", description: "Conducting market research and competitive intelligence analysis across industry verticals. Building structured reports and data-driven insights for clients to support strategic decision-making." },
    { title: "Freelance Event Coordinator", company: "Paytm Insider (District by Zomato)", period: "Oct 2024 - Nov 2025", description: "Coordinated 35+ large-scale live events with 10,000+ attendees. Managed ticketing systems and box-office operations achieving 99%+ transaction accuracy." },
  ];

  const education = [
    { degree: "Bachelor of Computer Applications (BCA)", school: "PES University, RR Campus, Bengaluru", year: "2026" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resume</h2>
          <p className="text-muted-foreground mt-1">My professional journey</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/Karthik_Resume.pdf";
            link.download = "Karthik_Devaraj_Resume.pdf";
            link.click();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
        >
          <Download className="w-4 h-4" />
          Download Resume
        </motion.button>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Briefcase className="w-5 h-5 text-primary" />
          Experience
        </h3>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-secondary/50 border-l-2 border-primary"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{exp.title}</h4>
                  <p className="text-sm text-primary">{exp.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">{exp.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <GraduationCap className="w-5 h-5 text-accent" />
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
            >
              <div>
                <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
              </div>
              <span className="text-sm text-primary font-medium">{edu.year}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Award className="w-5 h-5 text-chart-4" />
          Certifications & Achievements
        </h3>
        <div className="space-y-3">
          {[
            { name: "Academic Distinction Awardee", org: "PES University — Semester 1, 4 & 5" },
            { name: "PESU I/O – Automation in IoT", org: "PES University" },
            { name: "Front-End Web Development", org: "Udemy" },
            { name: "CIE Ignite Innovation – Stage 2", org: "PES University (Top 200+ submissions)" },
          ].map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
            >
              <div>
                <h4 className="font-semibold text-foreground text-sm">{cert.name}</h4>
                <p className="text-xs text-muted-foreground">{cert.org}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Award className="w-5 h-5 text-chart-4" />
          Key Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Python", "Embedded C", "Arduino", "JavaScript", "HTML/CSS", "SQL", "IoT Systems", "Git"].map((skill) => (
            <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/20 text-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function NotesWindowContent({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with paper texture feel */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <p className="text-sm text-muted-foreground font-medium">{currentTime}</p>
          <h2 className="text-3xl font-bold text-foreground">
            Hello there!
          </h2>
        </motion.div>
      </div>

      {/* Greeting Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <p className="text-lg text-foreground/90 leading-relaxed">
          {`Welcome to my digital workspace. I'm `}
          <span className="font-semibold text-primary">Karthik Devaraj</span>
          {`, an Intelligence Analyst passionate about decoding consumer behavior, data analytics, and building smart digital systems.`}
        </p>

        <p className="text-foreground/80 leading-relaxed">
          {`Currently transforming unstructured conversation data into strategic market intelligence, my work sits at the intersection of analytical thinking and technology.`}
        </p>

        <p className="text-foreground/80 leading-relaxed">
          {`This portfolio is designed to look and feel like a functional desktop operating system—dive in, explore the data, and navigate your way through the dock icons below or the menu bar above.`}
        </p>
      </motion.div> 

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Start</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "View Projects", icon: <FolderKanban className="w-4 h-4" />, color: "from-violet-500 to-purple-600", action: "projects" },
            { label: "About Me", icon: <User className="w-4 h-4" />, color: "from-cyan-500 to-blue-600", action: "about" },
            { label: "Skills Stack", icon: <Code2 className="w-4 h-4" />, color: "from-emerald-500 to-green-600", action: "stack" },
            { label: "Get in Touch", icon: <Mail className="w-4 h-4" />, color: "from-teal-500 to-cyan-600", action: "contact" },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.(action.action)}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-xl bg-primary/10 border border-primary/20"
      >
        <p className="text-sm text-foreground/80">
          <span className="font-semibold text-primary">Tip:</span>
          {` Try the keyboard shortcuts! Press `}
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">Ctrl+P</kbd>
          {` for Projects, `}
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">Ctrl+A</kbd>
          {` for About, or `}
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">Ctrl+T</kbd>
          {` for Terminal.`}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function TerminalWindowContent() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    { command: "", output: "Welcome to Jane's Terminal v1.0.0\nType 'help' for available commands.\n" },
  ]);

  const commands: Record<string, string> = {
    help: "Available commands:\n  about     - Learn about me\n  skills    - View my tech stack\n  contact   - Get contact info\n  projects  - See my projects\n  clear     - Clear terminal",
    about: "Karthik Devaraj\nData & IoT Engineering Intern\nBCA student at PES University, Bengaluru (2026)\nBuilding IoT systems, embedded solutions & data-driven apps.",
    skills: "Languages: Python, Embedded C, JavaScript, SQL, HTML/CSS\nIoT: Arduino, MQ Sensors, RFID, GSM Modules\nTools: MySQL, Git, VS Code, Excel",
    contact: "Email: findkarthik7@yahoo.com\nPhone: +91 7411530867\nLinkedIn: linkedin.com/in/karthik-devaraj-755241356\nGitHub: github.com/Darkdemon75",
    projects: "1. Garden Genie - IoT Plant Monitoring System\n2. Gas Leakage Detection & Emergency Alert System\n3. RFID-Based Hospital Management System\n4. Mimetic - AI Content Repurposing Platform\n5. Automated Smoke Detection & Alert System",
    clear: "__CLEAR__",
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    
    if (cmd === "clear") {
      setHistory([]);
    } else {
      const output = commands[cmd] || `Command not found: ${cmd}. Type 'help' for available commands.`;
      setHistory([...history, { command: input, output }]);
    }
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-sm"
    >
      <div className="bg-black/50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.command && (
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-blue-400">karthik@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">~</span>
                <span className="text-white">$</span>
                <span className="text-foreground">{entry.command}</span>
              </div>
            )}
            <pre className="text-foreground/80 whitespace-pre-wrap ml-0">{entry.output}</pre>
          </div>
        ))}
        
        <form onSubmit={handleCommand} className="flex items-center gap-2 text-green-400">
          <span className="text-blue-400">karthik@portfolio</span>
          <span className="text-white">:</span>
          <span className="text-purple-400">~</span>
          <span className="text-white">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-foreground outline-none"
            autoFocus
          />
        </form>
      </div>
    </motion.div>
  );
}

export function ScheduleWindowContent() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const isPast = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentMonth &&
    selectedDate?.getFullYear() === currentYear;

  const isWeekend = (day: number) => {
    const d = new Date(currentYear, currentMonth, day).getDay();
    return d === 0 || d === 6;
  };

  const handleDayClick = (day: number) => {
    if (isPast(day)) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setShowConfirm(false);
  };

  const handleSchedule = () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const subject = encodeURIComponent(`Meeting Request - ${dateStr}`);
    const body = encodeURIComponent(`Hi Karthik,\n\nI'd like to schedule a call with you on ${dateStr}.\n\nPlease let me know your availability.\n\nBest regards`);
    window.open(`mailto:findkarthik7@yahoo.com?subject=${subject}&body=${body}`);
    setShowConfirm(true);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Schedule a Call</h2>
        <p className="text-muted-foreground mt-1">Pick a date and I'll get back to you to confirm!</p>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl bg-secondary/40 p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - firstDay + 1;
            const valid = day >= 1 && day <= daysInMonth;
            if (!valid) return <div key={i} />;

            const past = isPast(day);
            const weekend = isWeekend(day);
            const selected = isSelected(day);
            const todayMark = isToday(day);

            return (
              <motion.button
                key={i}
                whileHover={!past ? { scale: 1.1 } : {}}
                whileTap={!past ? { scale: 0.95 } : {}}
                onClick={() => handleDayClick(day)}
                disabled={past}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center
                  ${selected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : ""}
                  ${todayMark && !selected ? "ring-2 ring-primary text-primary" : ""}
                  ${past ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                  ${!past && !selected && weekend ? "text-rose-400/70" : ""}
                  ${!past && !selected && !weekend && !todayMark ? "text-foreground hover:bg-primary/20" : ""}
                `}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full ring-2 ring-primary inline-block" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-400/50 inline-block" /> Weekend</span>
      </div>

      {/* Selected date + schedule button */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-primary/10 border border-primary/20 p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time to be confirmed over email
              </p>
            </div>
          </div>

          {showConfirm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-green-400 font-medium"
            >
              ✅ Email opened! Karthik will confirm the time shortly.
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSchedule}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              <Video className="w-4 h-4" />
              Schedule a Call on this Date
            </motion.button>
          )}
        </motion.div>
      )}

      {!selectedDate && (
        <p className="text-center text-sm text-muted-foreground py-2">
          👆 Click any available date to schedule a call
        </p>
      )}
    </motion.div>
  );
}

interface SettingsProps {
  theme: "dark" | "light";
  wallpaper: "mountain" | "ocean";
  clockFormat: "12h" | "24h";
  cursorStyle: "default" | "dot" | "ring" | "crosshair";
  onThemeChange: (t: "dark" | "light") => void;
  onWallpaperChange: (w: "mountain" | "ocean") => void;
  onClockFormatChange: (f: "12h" | "24h") => void;
  onCursorStyleChange: (c: "default" | "dot" | "ring" | "crosshair") => void;
}

export function SettingsWindowContent({
  theme, wallpaper, clockFormat, cursorStyle,
  onThemeChange, onWallpaperChange, onClockFormatChange, onCursorStyleChange,
}: SettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-1"
    >
      <div className="flex items-center gap-3 pb-2 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-lg">⚙️</div>
        <div>
          <h2 className="text-lg font-bold text-foreground">System Preferences</h2>
          <p className="text-xs text-muted-foreground">Personalise your experience</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
        <div className="grid grid-cols-2 gap-2">
          {(["dark", "light"] as const).map(t => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onThemeChange(t)}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                theme === t
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/10 bg-secondary/40 text-foreground/70 hover:bg-secondary/60"
              }`}
            >
              <span>{t === "dark" ? "🌙" : "☀️"}</span>
              <span className="capitalize">{t} Mode</span>
              {theme === t && <span className="ml-auto text-primary">✓</span>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Wallpaper */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wallpaper</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "mountain", label: "Mountain Space", emoji: "🏔️" },
            { id: "ocean", label: "Deep Ocean", emoji: "🌊" },
          ] as const).map(w => (
            <motion.button
              key={w.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onWallpaperChange(w.id)}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                wallpaper === w.id
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/10 bg-secondary/40 text-foreground/70 hover:bg-secondary/60"
              }`}
            >
              <span className="text-lg">{w.emoji}</span>
              <span>{w.label}</span>
              {wallpaper === w.id && <span className="ml-auto text-primary">✓</span>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clock Format */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clock Format</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "12h", label: "12-Hour", example: "2:30 PM" },
            { id: "24h", label: "24-Hour", example: "14:30" },
          ] as const).map(f => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onClockFormatChange(f.id)}
              className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-start gap-0.5 transition-all ${
                clockFormat === f.id
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/10 bg-secondary/40 text-foreground/70 hover:bg-secondary/60"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <span>🕐</span>
                <span>{f.label}</span>
                {clockFormat === f.id && <span className="ml-auto text-primary">✓</span>}
              </div>
              <span className="text-xs opacity-60 pl-6">{f.example}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cursor Style */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cursor Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "default", label: "Default", desc: "White dot + ring" },
            { id: "dot", label: "Minimal Dot", desc: "Small blue dot" },
            { id: "ring", label: "Ring Only", desc: "Hollow circle" },
            { id: "crosshair", label: "Crosshair", desc: "Precision cross" },
          ] as const).map(c => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCursorStyleChange(c.id)}
              className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-start gap-0.5 transition-all ${
                cursorStyle === c.id
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/10 bg-secondary/40 text-foreground/70 hover:bg-secondary/60"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <span>🖱️</span>
                <span>{c.label}</span>
                {cursorStyle === c.id && <span className="ml-auto text-primary">✓</span>}
              </div>
              <span className="text-xs opacity-60 pl-6">{c.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
