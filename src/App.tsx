/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Trophy, 
  User, 
  Settings, 
  Search, 
  Volume2, 
  Star, 
  Baby, 
  MessageCircle,
  PlayCircle,
  Menu,
  X,
  ChevronRight,
  Heart
} from 'lucide-react';

// --- Types ---
interface Verse {
  reference: string;
  text: string;
}

interface Devotional {
  verse: string;
  reference: string;
  reflection: string;
  prayer: string;
}

// --- Components ---

const Navigation = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'bible', icon: BookOpen, label: 'Bible' },
    { id: 'devotions', icon: Star, label: 'Daily' },
    { id: 'quizzes', icon: Trophy, label: 'Quests' },
    { id: 'profile', icon: User, label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-bible-gold/20 px-4 py-3 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-bible-accent' : 'text-gray-400'
          }`}
        >
          <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'fill-current opacity-20' : ''}`} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="nav-active" className="w-1 h-1 rounded-full bg-bible-accent mt-0.5" />
          )}
        </button>
      ))}
    </nav>
  );
};

const Header = ({ isKidMode, setIsKidMode }: { isKidMode: boolean, setIsKidMode: (b: boolean) => void }) => {
  return (
    <header className="fixed top-0 left-0 right-0 px-6 py-4 flex justify-between items-center bg-bible-old/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-bible-gold rounded-xl flex items-center justify-center text-white font-serif text-2xl font-bold shadow-lg">IB</div>
        <h1 className="text-xl font-serif font-bold tracking-tight">IllumiBible</h1>
      </div>
      <button 
        onClick={() => setIsKidMode(!isKidMode)}
        className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all ${
          isKidMode 
          ? 'bg-blue-500 text-white shadow-blue-200' 
          : 'bg-white border border-bible-gold/30 text-bible-gold'
        } shadow-lg`}
      >
        <Baby className="w-4 h-4" />
        <span className="text-sm">{isKidMode ? "Kid's Mode" : "Adult Mode"}</span>
      </button>
    </header>
  );
};

const DevotionalCard = () => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bible/devotional')
      .then(res => res.json())
      .then(data => {
        setDevotional(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse bg-white p-6 rounded-3xl h-64 border border-bible-gold/20" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl border border-bible-gold/20 shadow-xl overflow-hidden relative"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-bible-gold opacity-5 rounded-full" />
      <div className="relative z-10">
        <span className="text-bible-gold font-serif italic text-sm mb-2 block">Daily Devotional</span>
        <h2 className="text-2xl font-serif font-bold mb-4">"{devotional?.verse}"</h2>
        <p className="text-bible-accent font-medium mb-6">— {devotional?.reference}</p>
        <div className="space-y-4 text-bible-ink/70 leading-relaxed">
          <p>{devotional?.reflection}</p>
          <div className="pt-4 border-t border-bible-gold/10">
            <p className="italic font-serif">Prayer: {devotional?.prayer}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KidMode = () => {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative h-64 rounded-[2rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://picsum.photos/seed/bible-kids/800/600" 
          alt="Bible Story Illustration" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent p-8 flex flex-col justify-end">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded w-fit mb-2">FEATURED STORY</span>
          <h2 className="text-white text-3xl font-bold">Noah's Ark Adventure</h2>
          <p className="text-blue-100 text-sm">Discover the story of animals and a big boat!</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: PlayCircle, label: 'Story Time', color: 'bg-orange-400' },
          { icon: Trophy, label: 'Quests', color: 'bg-green-400' },
          { icon: Volume2, label: 'Listen', color: 'bg-purple-400' },
          { icon: Heart, label: 'Memory Verses', color: 'bg-pink-400' },
        ].map((item, i) => (
          <button key={i} className={`${item.color} p-6 rounded-3xl flex flex-col items-center gap-3 text-white shadow-lg active:scale-95 transition-all text-center`}>
            <div className="bg-white/20 p-3 rounded-2xl">
              <item.icon className="w-8 h-8" />
            </div>
            <span className="font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-500 fill-current" />
          Today's Quiz
        </h3>
        <div className="bg-white p-6 rounded-[2rem] border-4 border-blue-100 shadow-lg">
          <p className="text-lg font-bold mb-4 text-gray-700">How many days did it rain for Noah?</p>
          <div className="space-y-2">
            {['7 days', '40 days', '100 days'].map((ans, i) => (
              <button key={i} className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all font-bold">
                {ans}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const BibleTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search verses, topics..." 
            className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border border-bible-gold/20 focus:outline-none focus:ring-2 focus:ring-bible-gold/50 shadow-sm"
          />
        </div>
        <button className="bg-white p-3 rounded-2xl border border-bible-gold/20 shadow-sm text-bible-gold">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl">Continue Reading</h3>
        <div className="bg-white p-6 rounded-3xl border border-bible-gold/10 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-bible-gold text-xs font-bold tracking-widest uppercase">PSALMS 23:1</p>
              <h4 className="text-sm text-gray-400">Current Chapter</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-bible-gold/10 flex items-center justify-center text-bible-gold group-hover:bg-bible-gold group-hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
          <p className="text-lg font-serif italic text-bible-ink/80">"The Lord is my shepherd; I shall not want..."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'].map((book) => (
          <div key={book} className="bg-white px-6 py-5 rounded-2xl border border-bible-gold/5 flex justify-between items-center shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-bible-gold/30 rounded-full" />
              <span className="font-serif font-bold text-lg">{book}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">50 Chapters</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('bible');
  const [isKidMode, setIsKidMode] = useState(false);

  return (
    <div className="min-h-screen pb-24">
      <Header isKidMode={isKidMode} setIsKidMode={setIsKidMode} />
      
      <main className="pt-24 px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {isKidMode ? (
            <motion.div
              key="kids"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <KidMode />
            </motion.div>
          ) : (
            <motion.div
              key="adults"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {activeTab === 'bible' && <BibleTab />}
              {activeTab === 'devotions' && <DevotionalCard />}
              {activeTab === 'quizzes' && (
                <div className="text-center py-20">
                  <Trophy className="w-16 h-16 text-bible-gold mx-auto mb-4 opacity-20" />
                  <p className="text-gray-400 font-serif italic">Quest modules coming soon...</p>
                </div>
              )}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-24 h-24 rounded-full bg-bible-gold/10 border-4 border-bible-gold flex items-center justify-center relative">
                      <User className="w-12 h-12 text-bible-gold" />
                      <div className="absolute -bottom-2 -right-2 bg-bible-accent text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white">LVL 12</div>
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-serif font-bold italic">Pilgrim</h2>
                      <p className="text-gray-400 text-sm">Joined May 2024</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Verses', val: '124' },
                      { label: 'Streak', val: '12d' },
                      { label: 'Badges', val: '8' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white p-4 rounded-2xl text-center border border-bible-gold/10">
                        <p className="text-2xl font-serif font-bold text-bible-accent">{stat.val}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Floating Action Button for AI Chat */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-bible-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
