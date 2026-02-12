import Link from 'next/link'
import { FaDiscord, FaRedditAlien, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-slate-950/95 to-slate-900/95 backdrop-blur-sm">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-400">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            {/* Otaku Bhaskar Presents badge */}
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-xs font-medium text-orange-300 mb-3">
              Otaku Bhaskar presents
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-3">
              r/AnimeIndian Awards
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              The biggest community-driven anime awards. 
              One person, one vote. Celebrating the best of Indian anime fandom.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a 
                href="https://discord.com/invite/jZ85M2GgXS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white rounded-lg transition-all"
                aria-label="Discord"
              >
                <FaDiscord size={20} />
              </a>
              <a 
                href="https://reddit.com/r/animeindian" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white rounded-lg transition-all"
                aria-label="Subreddit"
              >
                <FaRedditAlien size={20} />
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-white transition-colors">
                  Rules & Info
                </Link>
              </li>
              <li>
                <a 
                  href="https://reddit.com/r/animeindian" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Subreddit
                </a>
              </li>
            </ul>
          </div>

          {/* Copyright & Credit */}
          <div className="flex flex-col items-start md:items-end justify-end">
            <p className="text-xs text-gray-500">
              © 2026 r/AnimeIndian. All rights reserved.
            </p>
            {/* 💜 Made with love – now below copyright */}
            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
              <span>💜 Made with love by</span>
              <a 
                href="https://www.reddit.com/r/animeindian/s/RGJidGAzub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                Otaku Bhaskar Team
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
            }
