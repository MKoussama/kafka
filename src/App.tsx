import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  Menu,
  X,
  Download,
  Play,
  Server,
  Database,
  Users,
  Network,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Cloud,
  Brain,
  Rocket,
  Building2,
  MessageSquare,
  Lightbulb,
  Scale,
  Globe,
  Settings,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const slides = [
  { id: 0, title: "Couverture", icon: Home },
  { id: 1, title: "Sommaire", icon: FileText },
  { id: 2, title: "Technologies avant Kafka", icon: Brain },
  { id: 3, title: "Naissance de Kafka", icon: Rocket },
  { id: 4, title: "Architecture", icon: Building2 },
  { id: 5, title: "Message Kafka", icon: MessageSquare },
  { id: 6, title: "Cas d'utilisation", icon: Lightbulb },
  { id: 7, title: "Avantages/Inconvénients", icon: Scale },
  { id: 8, title: "Qui utilise Kafka", icon: Globe },
  { id: 9, title: "Fonctionnement", icon: Settings },
  { id: 10, title: "Exemple pratique", icon: Network },
  { id: 11, title: "Conclusion", icon: CheckCircle },
  { id: 12, title: "À propos", icon: Users },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div 
      className="slide-container relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background animé */}
      <AnimatedBackground />
      
      <Progress value={progress} className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#0a0e1a]" />

      <header className="fixed top-4 left-0 right-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/kafka-logo.svg" alt="Kafka" className="h-8 w-8" />
          <span className="text-sm font-semibold text-white hidden md:inline">Apache Kafka</span>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-[#151922]/80 backdrop-blur border-white/10">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#151922] border-l border-white/10">
              <div className="mt-8 space-y-2">
                {slides.map((slide) => {
                  const Icon = slide.icon;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(slide.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentSlide === slide.id 
                          ? "bg-[#0073EC] text-white" 
                          : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{slide.title}</span>
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          {currentSlide === 0 && <Slide0 onStart={() => nextSlide()} />}
          {currentSlide === 1 && <Slide1 goToSlide={goToSlide} />}
          {currentSlide === 2 && <Slide2 />}
          {currentSlide === 3 && <Slide3 />}
          {currentSlide === 4 && <Slide4 />}
          {currentSlide === 5 && <Slide5 />}
          {currentSlide === 6 && <Slide6 />}
          {currentSlide === 7 && <Slide7 />}
          {currentSlide === 8 && <Slide8 />}
          {currentSlide === 9 && <Slide9 />}
          {currentSlide === 10 && <Slide10 />}
          {currentSlide === 11 && <Slide11 />}
          {currentSlide === 12 && <Slide12 />}
        </motion.div>
      </AnimatePresence>

      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-30 bg-[#151922]/80 backdrop-blur hover:bg-[#0073EC] text-white p-3 rounded-full transition-all hover:scale-110"
          aria-label="Slide précédent"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentSlide < slides.length - 1 && (
        <button
          onClick={nextSlide}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-30 bg-[#151922]/80 backdrop-blur hover:bg-[#0073EC] text-white p-3 rounded-full transition-all hover:scale-110"
          aria-label="Slide suivant"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <footer className="fixed bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2 px-6">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(slide.id)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === slide.id 
                ? "w-8 bg-[#0073EC]" 
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Aller au slide ${slide.id + 1}`}
          />
        ))}
      </footer>
    </div>
  );
}

function Slide0({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-5xl w-full text-center space-y-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/kafka-logo.svg" alt="Apache Kafka" className="h-32 w-32 mx-auto mb-8 opacity-90" />
      </motion.div>

      <motion.h1
        className="text-6xl md:text-8xl font-serif font-bold bg-gradient-to-r from-[#0073EC] to-[#00a8ff] bg-clip-text text-transparent"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Apache Kafka
      </motion.h1>

      <motion.p
        className="text-2xl md:text-3xl text-gray-300"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Plateforme de streaming distribué
      </motion.p>

      <motion.div
        className="space-y-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="text-gray-300 space-y-2">
          <p className="text-xl font-semibold text-[#0073EC]">Réalisé par :</p>
          <p className="text-lg">Elmaknassi Oussama</p>
          <p className="text-lg">Chalf Fatima Zahra</p>
          <p className="text-lg">Fourari Taha</p>
          <p className="text-lg">Fouta Mohamed Yasser</p>
        </div>
        <p className="text-lg text-gray-500 mt-4">
          Étudiants en Intelligence Artificielle - Spécialité Big Data
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <Button 
          onClick={onStart}
          size="lg"
          className="bg-[#0073EC] hover:bg-[#0056b3] text-white text-lg px-8 py-6 group"
        >
          <Play className="mr-2 group-hover:scale-110 transition-transform" />
          Commencer la présentation
        </Button>
      </motion.div>

      <motion.p
        className="text-sm text-gray-600 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Utilisez les flèches ← → ou glissez pour naviguer
      </motion.p>
    </div>
  );
}

function Slide1({ goToSlide }: { goToSlide: (index: number) => void }) {
  const sections = [
    { id: 2, title: "Les technologies avant Kafka", icon: Brain },
    { id: 3, title: "La naissance de Kafka", icon: Rocket },
    { id: 4, title: "Architecture de Kafka", icon: Building2 },
    { id: 5, title: "Contenu d'un message", icon: MessageSquare },
    { id: 6, title: "Cas d'utilisation", icon: Lightbulb },
    { id: 7, title: "Avantages et inconvénients", icon: Scale },
    { id: 8, title: "Qui utilise Kafka", icon: Globe },
    { id: 9, title: "Fonctionnement détaillé", icon: Settings },
    { id: 10, title: "Exemple pratique", icon: Network },
  ];

  return (
    <div className="max-w-4xl w-full">
      <motion.h2
        className="text-5xl md:text-6xl font-bold text-[#0073EC] mb-12 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        📚 Sommaire
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={section.id}
              onClick={() => goToSlide(section.id)}
              className="bg-[#151922]/60 backdrop-blur border border-white/10 rounded-xl p-6 text-left hover:bg-[#0073EC]/20 hover:border-[#0073EC]/50 transition-all group"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#0073EC]/20 p-3 rounded-lg group-hover:bg-[#0073EC] transition-colors">
                  <Icon className="text-[#0073EC] group-hover:text-white transition-colors" size={24} />
                </div>
                <span className="text-lg text-white font-medium">{section.title}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🧠 Les technologies avant Kafka
      </motion.h2>

      <motion.div
        className="mb-8 bg-gradient-to-r from-[#0073EC]/20 to-transparent border-l-4 border-[#0073EC] p-6 rounded-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-lg text-gray-200 leading-relaxed mb-4">
          Avant l'apparition de Kafka, plusieurs systèmes étaient utilisés pour la <strong className="text-[#0073EC]">messagerie et le transfert de données</strong> :
        </p>
        <h3 className="text-xl font-semibold text-white mt-4 mb-2">a. Systèmes traditionnels de messagerie</h3>
        <ul className="list-none text-gray-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#0073EC]">•</span>
            <span><strong>RabbitMQ</strong>, <strong>ActiveMQ</strong>, <strong>IBM MQ</strong>, etc. → Utilisés pour envoyer des messages entre applications (Producer → Consumer). → Basés sur des files d'attente (queues).</span>
          </li>
        </ul>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-4">Systèmes traditionnels de messagerie</h3>
          
          <div className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-xl p-5 flex items-center gap-4">
            <Server className="text-[#0073EC]" size={32} />
            <div>
              <h4 className="text-xl font-semibold text-white">RabbitMQ</h4>
              <p className="text-gray-400 text-sm">Message broker AMQP</p>
            </div>
          </div>

          <div className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-xl p-5 flex items-center gap-4">
            <Database className="text-[#0073EC]" size={32} />
            <div>
              <h4 className="text-xl font-semibold text-white">ActiveMQ</h4>
              <p className="text-gray-400 text-sm">Open source message broker</p>
            </div>
          </div>

          <div className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-xl p-5 flex items-center gap-4">
            <Cloud className="text-[#0073EC]" size={32} />
            <div>
              <h4 className="text-xl font-semibold text-white">IBM MQ</h4>
              <p className="text-gray-400 text-sm">Enterprise messaging</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-red-400 mb-4">❌ Limitations majeures</h3>
          
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-white mb-1">Performance limitée</h4>
                <p className="text-gray-300 text-sm">Difficulté à gérer un grand volume de données en temps réel</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-white mb-1">Pas de streaming continu</h4>
                <p className="text-gray-300 text-sm">Pas conçus pour le flux constant de données</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-white mb-1">Scalabilité limitée</h4>
                <p className="text-gray-300 text-sm">Ajout de serveurs difficile ou impossible</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-white mb-1">Pertes et duplications</h4>
                <p className="text-gray-300 text-sm">Messages perdus ou dupliqués lors de pics de charge</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-[#0073EC]/20 to-transparent border-l-4 border-[#0073EC] p-6 rounded-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xl text-gray-200 leading-relaxed">
          💡 <strong>En résumé :</strong> Avant Kafka, les systèmes étaient bons pour la <strong className="text-[#0073EC]">messagerie ponctuelle</strong>, 
          mais pas pour le <strong className="text-[#0073EC]">traitement massif et continu</strong> des données (logs, capteurs, événements temps réel...).
        </p>
      </motion.div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🚀 La naissance de Kafka
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#0073EC]/20 p-4 rounded-lg">
                <Users className="text-[#0073EC]" size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">LinkedIn</h3>
                <p className="text-xl text-gray-400">2011</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-white mb-3">Créateurs :</h4>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-green-400" size={20} />
                <span>Jay Kreps</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-green-400" size={20} />
                <span>Neha Narkhede</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-green-400" size={20} />
                <span>Jun Rao</span>
              </div>
            </div>
          </div>

          <motion.p
            className="text-lg text-gray-300 leading-relaxed bg-[#151922]/40 p-6 rounded-xl border border-white/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Face à des <strong className="text-[#0073EC]">milliards d'événements</strong> générés quotidiennement, 
            LinkedIn avait besoin d'une solution capable de traiter des flux de données en temps réel 
            de manière fiable et scalable.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-[#0073EC] mb-6">🎯 Objectifs clés</h3>

          <div className="bg-gradient-to-br from-[#0073EC]/20 to-transparent border border-[#0073EC]/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <Zap className="text-[#0073EC]" size={32} />
              <h4 className="text-xl font-semibold text-white">Vitesse ultra-rapide</h4>
            </div>
            <p className="text-gray-300">Une solution rapide et distribuée pour gérer des volumes massifs</p>
          </div>

          <div className="bg-gradient-to-br from-[#0073EC]/20 to-transparent border border-[#0073EC]/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <Shield className="text-[#0073EC]" size={32} />
              <h4 className="text-xl font-semibold text-white">Résilience maximale</h4>
            </div>
            <p className="text-gray-300">Haute tolérance aux pannes et disponibilité continue</p>
          </div>

          <div className="bg-gradient-to-br from-[#0073EC]/20 to-transparent border border-[#0073EC]/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-3">
              <TrendingUp className="text-[#0073EC]" size={32} />
              <h4 className="text-xl font-semibold text-white">Scalabilité illimitée</h4>
            </div>
            <p className="text-gray-300">Capable de stocker, publier et consommer en temps réel</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-[#0073EC]/30 via-[#00a8ff]/20 to-transparent p-8 rounded-2xl border border-[#0073EC]/50"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-[#0073EC] to-[#00a8ff] bg-clip-text text-transparent">
          Résultat : Apache Kafka
        </h3>
        <p className="text-xl text-center text-gray-200">
          Un <strong className="text-[#0073EC]">système de streaming distribué</strong> permettant de collecter, traiter et transmettre 
          des données en temps réel entre différents systèmes
        </p>
      </motion.div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🏗️ Architecture de Kafka
      </motion.h2>

      <motion.div
        className="mb-8 bg-[#0a0e1a] p-8 rounded-xl border border-[#0073EC]/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-around gap-8 flex-wrap">
          <motion.div 
            className="bg-green-500/20 border-2 border-green-500 rounded-xl p-8 text-center min-w-[150px]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Users className="mx-auto text-green-400 mb-3" size={48} />
            <div className="text-xl font-bold text-green-400">Producer</div>
          </motion.div>

          <motion.div 
            className="text-[#0073EC] text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            →
          </motion.div>

          <motion.div 
            className="bg-[#0073EC]/20 border-2 border-[#0073EC] rounded-xl p-8 text-center min-w-[180px]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Database className="mx-auto text-[#0073EC] mb-3" size={48} />
            <div className="text-xl font-bold text-[#0073EC] mb-2">Broker / Topic</div>
            <div className="text-xs text-gray-400">Partitions: 1, 2, 3</div>
          </motion.div>

          <motion.div 
            className="text-[#0073EC] text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            →
          </motion.div>

          <motion.div 
            className="bg-orange-500/20 border-2 border-orange-500 rounded-xl p-8 text-center min-w-[150px]"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Network className="mx-auto text-orange-400 mb-3" size={48} />
            <div className="text-xl font-bold text-orange-400">Consumer</div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Users, title: "Producers", desc: "Publient les messages dans les topics", color: "text-green-400" },
          { icon: Server, title: "Brokers", desc: "Serveurs stockant les données de manière distribuée", color: "text-[#0073EC]" },
          { icon: Database, title: "Topics", desc: "Catégories logiques contenant les messages", color: "text-purple-400" },
          { icon: Network, title: "Consumers", desc: "Lisent et traitent les messages", color: "text-orange-400" },
          { icon: Cloud, title: "Partitions", desc: "Division d'un topic pour le parallélisme", color: "text-cyan-400" },
          { icon: Settings, title: "Zookeeper", desc: "Coordination du cluster (Raft)", color: "text-yellow-400" },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className="bg-[#151922]/60 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:border-[#0073EC]/50 transition-all"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className={`${item.color} mx-auto mb-3`} size={36} />
              <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="max-w-5xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        💬 Contenu d'un message Kafka
      </motion.h2>

      <motion.div
        className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-xl overflow-hidden mb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <table className="w-full">
          <thead className="bg-[#0073EC]">
            <tr>
              <th className="text-left py-4 px-6 text-white font-semibold">Élément</th>
              <th className="text-left py-4 px-6 text-white font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              { element: "Key", desc: "(optionnelle) Permet d'identifier ou de regrouper les messages" },
              { element: "Value", desc: "Le contenu principal du message (JSON, texte, binaire...)" },
              { element: "Timestamp", desc: "La date/heure d'envoi" },
              { element: "Headers", desc: "Métadonnées supplémentaires" },
              { element: "Offset", desc: "Numéro unique du message dans une partition" },
            ].map((row, index) => (
              <motion.tr
                key={row.element}
                className="border-b border-white/5 hover:bg-[#0073EC]/5 transition-colors"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <td className="py-4 px-6 font-mono text-[#0073EC] font-semibold">{row.element}</td>
                <td className="py-4 px-6 text-gray-300">{row.desc}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        className="bg-[#0a0e1a] p-6 rounded-xl border border-[#0073EC]/30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-[#0073EC]">📝 Exemple de message</h3>
        <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "key": "user-12345",
  "value": {
    "userId": 12345,
    "action": "login",
    "timestamp": "2024-11-01T10:30:00Z",
    "location": "Paris"
  },
  "timestamp": 1698835800000,
  "offset": 42,
  "partition": 2
}`}
        </pre>
      </motion.div>
    </div>
  );
}

function Slide6() {
  const useCases = [
    { icon: Database, title: "Collecte de logs", desc: "Agrégation centralisée des logs de milliers de serveurs", color: "bg-blue-500/20 border-blue-500/30" },
    { icon: Network, title: "IoT & Capteurs", desc: "Traitement de millions d'événements d'appareils connectés", color: "bg-purple-500/20 border-purple-500/30" },
    { icon: Zap, title: "Paiements temps réel", desc: "Transactions financières avec latence minimale", color: "bg-green-500/20 border-green-500/30" },
    { icon: TrendingUp, title: "Recommandations", desc: "Analyse comportementale (Netflix, Spotify)", color: "bg-orange-500/20 border-orange-500/30" },
    { icon: Shield, title: "Détection de fraude", desc: "Analyse en temps réel des patterns suspects", color: "bg-red-500/20 border-red-500/30" },
    { icon: Cloud, title: "Pipelines de données", desc: "ETL et flux entre systèmes hétérogènes", color: "bg-cyan-500/20 border-cyan-500/30" },
  ];

  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        💡 Cas d'utilisation
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon;
          return (
            <motion.div
              key={useCase.title}
              className={`${useCase.color} border rounded-xl p-6 hover:scale-105 transition-transform`}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="text-[#0073EC] mb-4" size={40} />
              <h3 className="font-semibold text-xl text-white mb-2">{useCase.title}</h3>
              <p className="text-gray-300 text-sm">{useCase.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-red-500/20 via-[#0073EC]/20 to-purple-500/20 p-8 rounded-xl border border-[#0073EC]/30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xl text-center text-white">
          🌐 Kafka est utilisé dans de <strong className="text-[#0073EC]">nombreux domaines</strong> pour le traitement 
          de <strong className="text-[#0073EC]">données en temps réel</strong>
        </p>
      </motion.div>
    </div>
  );
}

function Slide7() {
  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        ⚖️ Avantages et Inconvénients
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="space-y-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-green-400 flex items-center gap-3 mb-6">
            <CheckCircle size={32} />
            Avantages
          </h3>

          {[
            "Performance exceptionnelle (millions de msg/sec)",
            "Scalabilité horizontale illimitée",
            "Tolérance aux pannes et réplication",
            "Persistance des données sur disque",
            "Traitement en temps réel et batch",
            "Écosystème riche (Kafka Streams, Connect)",
          ].map((adv, index) => (
            <motion.div
              key={adv}
              className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded flex items-start gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-200">{adv}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-red-400 flex items-center gap-3 mb-6">
            <AlertCircle size={32} />
            Inconvénients
          </h3>

          {[
            "Configuration complexe au démarrage",
            "Nécessite un cluster pour la production",
            "Courbe d'apprentissage importante",
            "Ressources matérielles significatives",
            "Gestion opérationnelle exigeante",
          ].map((disadv, index) => (
            <motion.div
              key={disadv}
              className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded flex items-start gap-3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-gray-200">{disadv}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Slide8() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms = [
    { name: "LinkedIn", color: "bg-blue-600", desc: "pour suivre les activités des utilisateurs en temps réel." },
    { name: "Netflix", color: "bg-red-600", desc: "pour le streaming et la recommandation." },
    { name: "Uber", color: "bg-black border-2 border-white", desc: "pour suivre les trajets, paiements et géolocalisations." },
    { name: "Spotify", color: "bg-green-600", desc: "pour la gestion des playlists et suggestions en direct." },
    { name: "Airbnb", color: "bg-pink-600", desc: "pour le traitement d'événements massifs." },
    { name: "Twitter", color: "bg-sky-500", desc: "pour le traitement d'événements massifs." },
    { name: "Pinterest", color: "bg-red-500", desc: "pour le traitement d'événements massifs." },
    { name: "Yahoo", color: "bg-purple-700", desc: "pour le traitement d'événements massifs." },
    { name: "Shopify", color: "bg-green-700", desc: "pour le traitement d'événements massifs." },
  ];

  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🌍 Qui utilise Kafka
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {platforms.map((platform, index) => (
          <motion.button
            key={platform.name}
            onClick={() => setSelectedPlatform(selectedPlatform === platform.name ? null : platform.name)}
            className={`${platform.color} p-6 rounded-xl text-center font-bold text-white text-xl shadow-lg hover:scale-110 transition-all cursor-pointer ${selectedPlatform === platform.name ? 'ring-4 ring-[#0073EC]' : ''}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ rotate: 2 }}
          >
            <div>{platform.name}</div>
            <AnimatePresence>
              {selectedPlatform === platform.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 text-sm font-normal text-white/90"
                >
                  {platform.desc}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <motion.div
        className="bg-gradient-to-r from-[#0073EC]/30 via-[#00a8ff]/20 to-[#0073EC]/30 p-12 rounded-2xl border border-[#0073EC]/50 text-center"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-6xl font-bold text-[#0073EC] mb-4">80%</div>
        <p className="text-2xl text-white">
          des entreprises du <strong>Fortune 100</strong> utilisent Apache Kafka
        </p>
      </motion.div>
    </div>
  );
}

function Slide9() {
  return (
    <div className="max-w-6xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        ⚙️ Fonctionnement de Kafka
      </motion.h2>

      <div className="space-y-8">
        {[
          { 
            icon: Server, 
            title: "Cluster Kafka", 
            desc: "Un cluster Kafka est composé de plusieurs brokers (serveurs) qui travaillent ensemble pour assurer la haute disponibilité et la répartition de charge.",
            color: "from-blue-500/20 to-transparent"
          },
          { 
            icon: Users, 
            title: "Production de messages", 
            desc: "Les producers envoient des messages dans un topic spécifique. Kafka détermine automatiquement dans quelle partition stocker le message selon la clé fournie.",
            color: "from-green-500/20 to-transparent"
          },
          { 
            icon: Network, 
            title: "Consommation de messages", 
            desc: "Les consumers lisent les messages depuis les partitions en suivant leur offset. Chaque consumer group peut traiter les messages indépendamment.",
            color: "from-orange-500/20 to-transparent"
          },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className={`bg-gradient-to-r ${item.color} border border-white/10 rounded-xl p-6 flex gap-6 items-start hover:border-[#0073EC]/50 transition-all`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="bg-[#0073EC]/20 p-4 rounded-lg flex-shrink-0">
                <Icon className="text-[#0073EC]" size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#0073EC] mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-br from-[#0073EC]/20 to-transparent p-8 rounded-xl border border-[#0073EC]/30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-[#0073EC]">Caractéristiques clés</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Communication asynchrone", desc: "Les producers et consumers fonctionnent indépendamment" },
            { title: "Persistance garantie", desc: "Les données sont stockées sur disque avec réplication" },
            { title: "Ordre des messages", desc: "Garanti au niveau de chaque partition" },
            { title: "Scalabilité linéaire", desc: "Ajout de brokers pour augmenter la capacité" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <CheckCircle className="text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Slide10() {
  return (
    <div className="max-w-5xl w-full">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🔄 Exemple pratique
      </motion.h2>

      <motion.div
        className="bg-[#0a0e1a] p-8 rounded-xl border border-[#0073EC]/30 mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Flux de données</h3>
        
        <div className="space-y-6">
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 flex-1 text-center">
              <Server className="mx-auto text-green-400 mb-2" size={32} />
              <div className="text-white font-semibold">Application A</div>
            </div>
            <div className="text-[#0073EC] text-4xl">↓</div>
            <div className="bg-[#0073EC]/20 border-2 border-[#0073EC] rounded-lg p-4 flex-1 text-center">
              <Network className="mx-auto text-[#0073EC] mb-2" size={32} />
              <div className="text-[#0073EC] font-semibold">Producer</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 w-full max-w-md text-center">
              <Database className="mx-auto text-purple-400 mb-3" size={48} />
              <div className="text-white font-bold text-xl mb-1">Kafka Topic: transactions</div>
              <div className="text-gray-400 text-sm">Partitions: 3 | Réplication: 3</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-[#0073EC] text-4xl">↓</div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-4 text-center">
                <Database className="mx-auto text-orange-400 mb-2" size={28} />
                <div className="text-white font-semibold text-sm">Consumer 1</div>
                <div className="text-gray-400 text-xs mt-1">Sauvegarde en DB</div>
              </div>
              <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-4 text-center">
                <TrendingUp className="mx-auto text-orange-400 mb-2" size={28} />
                <div className="text-white font-semibold text-sm">Consumer 2</div>
                <div className="text-gray-400 text-xs mt-1">Analyse temps réel</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-[#0073EC]/20 to-transparent border-l-4 border-[#0073EC] p-6 rounded-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-xl text-gray-200 leading-relaxed">
          💡 Kafka agit comme un <strong className="text-[#0073EC]">hub central</strong> reliant plusieurs systèmes 
          tout en garantissant la <strong className="text-[#0073EC]">vitesse</strong>, la <strong className="text-[#0073EC]">fiabilité</strong> et 
          la <strong className="text-[#0073EC]">résilience</strong> des données transmises.
        </p>
      </motion.div>
    </div>
  );
}

function Slide11() {
  return (
    <div className="max-w-5xl w-full text-center">
      <motion.h2
        className="text-4xl md:text-6xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        ✅ Conclusion
      </motion.h2>

      <motion.div
        className="space-y-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-2xl text-gray-200 leading-relaxed">
          Apache Kafka est devenu la <strong className="text-[#0073EC]">référence mondiale</strong> pour le streaming 
          de données en temps réel
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: Zap, title: "Performance", desc: "Millions de messages/seconde" },
            { icon: Shield, title: "Fiabilité", desc: "Tolérance aux pannes" },
            { icon: TrendingUp, title: "Scalabilité", desc: "Croissance illimitée" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="bg-gradient-to-br from-[#0073EC]/20 to-transparent border border-[#0073EC]/30 rounded-xl p-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                <Icon className="mx-auto text-[#0073EC] mb-3" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function Slide12() {
  return (
    <div className="max-w-4xl w-full text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/kafka-logo.svg" alt="Kafka" className="h-24 w-24 mx-auto mb-8 opacity-80" />
      </motion.div>

      <motion.h2
        className="text-5xl md:text-6xl font-bold text-[#0073EC] mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Merci ! 🙏
      </motion.h2>

      <motion.div
        className="bg-[#151922]/60 backdrop-blur border border-[#0073EC]/30 rounded-2xl p-12 space-y-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-3xl font-bold text-white mb-4">Réalisé par :</h3>
        <div className="text-xl text-gray-300 space-y-2">
          <p>Elmaknassi Oussama</p>
          <p>Chalf Fatima Zahra</p>
          <p>Fourari Taha</p>
          <p>Fouta Mohamed Yasser</p>
        </div>
        <p className="text-lg text-gray-400 mt-6">Étudiants en Intelligence Artificielle - Spécialité Big Data</p>
      </motion.div>

      <motion.p
        className="text-gray-600 text-sm mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Apache Kafka® est une marque déposée de la Apache Software Foundation<br />
        Images provenant de sources libres (Unsplash, Pexels)
      </motion.p>
    </div>
  );
}
