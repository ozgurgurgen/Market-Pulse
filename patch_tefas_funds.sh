#!/bin/bash
sed -i -e '/import { TefasFund, /a \
import { TefasAiRadarModal } from "./TefasAiRadarModal";\
' src/components/TefasFundsSection.tsx

sed -i -e '/const \[searchQuery/a \
  const [isRadarOpen, setIsRadarOpen] = useState(false);\
' src/components/TefasFundsSection.tsx

sed -i -e '/<div className="flex items-center gap-2 self-start md:self-auto">/a \
            <button\
              type="button"\
              onClick={() => setIsRadarOpen(true)}\
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-400/50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"\
            >\
              <Flame size={14} />\
              <span>AI Fırsat Avcısı</span>\
            </button>\
' src/components/TefasFundsSection.tsx

sed -i -e '/return (/a \
    <>\
' src/components/TefasFundsSection.tsx

sed -i -e '/<\/div>$/c \
    </div>\
    <TefasAiRadarModal isOpen={isRadarOpen} onClose={() => setIsRadarOpen(false)} onSelectFund={onSelectFund} />\
    </>\
' src/components/TefasFundsSection.tsx
