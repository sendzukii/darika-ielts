"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import allQuestions from "./questions.json";

export default function ReadingTest() {
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("readingHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Ошибка чтения истории", e);
      }
    }
    generateRandomTest();
  }, []);

  const generateRandomTest = () => {
    const textsMap: Record<string, any[]> = {};
    allQuestions.forEach((q) => {
      if (!textsMap[q.text_title]) textsMap[q.text_title] = [];
      textsMap[q.text_title].push(q);
    });

    const titles = Object.keys(textsMap);
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomQuestions = textsMap[randomTitle];

    setCurrentTest({
      title: randomTitle,
      text: randomQuestions[0].text,
      questions: randomQuestions,
    });
    setAnswers({});
    setShowResults(false);
  };

  const handleOptionSelect = (qId: number, option: string) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    currentTest.questions.forEach((q: any) => {
      if (answers[q.id] === q.correct) correctCount++;
    });
    
    const percentage = Math.round((correctCount / currentTest.questions.length) * 100);
    setScore(percentage);
    setShowResults(true);

    const newHistory = [...history, percentage].slice(-5);
    setHistory(newHistory);
    localStorage.setItem("readingHistory", JSON.stringify(newHistory));
  };

  if (!currentTest) return <div className="min-h-screen bg-[#fffaf8] flex items-center justify-center text-[#d6567c]">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-[#fffaf8] text-[#4a2433] p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex justify-between items-start mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#d6567c] hover:text-[#a67f8c] transition-colors mt-2">
            <ArrowLeft size={20} /> Назад
          </Link>
          
          <div className="flex items-center gap-6 bg-white/80 px-6 py-4 rounded-3xl border border-[#f1c4d2] shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8a6672] uppercase tracking-wider mb-1">Средний балл</span>
              <span className="text-2xl font-bold text-[#d6567c]">
                {history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0}%
              </span>
            </div>
            
            <div className="w-[1px] h-10 bg-[#f1c4d2]"></div>

            <div className="flex gap-3 items-end h-14 pt-4">
              {history.length > 0 ? history.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 relative group">
                  <span className="text-[10px] font-bold text-[#d6567c] absolute -top-5">{h}%</span>
                  <div 
                    className={`w-3 rounded-t-sm transition-all ${h >= 70 ? 'bg-green-400' : h >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                    style={{ height: `${Math.max(h, 15)}%` }} 
                  ></div>
                </div>
              )) : <span className="text-xs text-[#8a6672] mb-2">Нет данных</span>}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-medium mb-2" style={{ fontFamily: "'Shippori Mincho', serif" }}>Reading Practice</h1>
          <p className="text-[#8a6672] mb-8">Прочитайте текст и ответьте на вопросы.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Блок с текстом: крупный шрифт, разбивка на абзацы, независимая прокрутка */}
            <div className="bg-white/60 p-8 rounded-3xl border border-[#f1c4d2] shadow-sm max-h-[85vh] overflow-y-auto sticky top-6">
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif" }}>{currentTest.title}</h2>
              <div className="text-lg md:text-xl leading-relaxed text-[#3a1b28] space-y-6">
                {currentTest.text.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Вопросы */}
            <div className="space-y-6">
              {currentTest.questions.map((q: any, idx: number) => (
                <div key={q.id} className="bg-white/80 p-6 rounded-2xl border border-[#f1c4d2]">
                  <h3 className="font-medium mb-4 text-lg">Question {idx + 1}</h3>
                  <p className="mb-4 text-lg text-[#4a2433]">{q.question}</p>
                  <div className="flex flex-col gap-3">
                    {q.options.map((opt: string) => {
                      const isSelected = answers[q.id] === opt;
                      const isCorrect = q.correct === opt;
                      let bgClass = "bg-white border-[#ecc3d1] hover:border-[#d6567c]";
                      
                      if (showResults) {
                        if (isCorrect) bgClass = "bg-green-100 border-green-500 text-green-800";
                        else if (isSelected && !isCorrect) bgClass = "bg-red-100 border-red-500 text-red-800";
                      } else if (isSelected) {
                        bgClass = "bg-[#ffe4ec] border-[#d6567c]";
                      }

                      return (
                        <button
                          key={opt}
                          onClick={() => !showResults && handleOptionSelect(q.id, opt)}
                          disabled={showResults}
                          className={`p-4 rounded-xl border text-left text-base md:text-lg transition-all ${bgClass} flex justify-between items-center`}
                        >
                          {opt}
                          {showResults && isCorrect && <CheckCircle size={20} className="text-green-600 shrink-0" />}
                          {showResults && isSelected && !isCorrect && <XCircle size={20} className="text-red-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && answers[q.id] !== q.correct && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 p-4 bg-[#fff0f4] border-l-4 border-[#d6567c] rounded-r-xl text-base text-[#5e3a48]">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-[#d6567c] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-1">Почему не так:</strong> {q.explanation}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {!showResults ? (
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(answers).length < currentTest.questions.length}
                  className="w-full py-4 bg-[#d6567c] hover:bg-[#c44a6d] text-white text-lg rounded-2xl font-medium transition-colors disabled:opacity-50"
                >
                  Проверить ответы
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#ffe4ec] p-8 rounded-2xl text-center">
                  <h3 className="text-3xl font-bold text-[#d6567c] mb-2">Результат: {score}%</h3>
                  <p className="text-[#8a6672] mb-6 text-lg">Твой прогресс сохранен.</p>
                  <button
                    onClick={generateRandomTest}
                    className="w-full py-4 bg-white text-[#d6567c] text-lg rounded-xl font-medium border border-[#f1c4d2] hover:bg-[#fffaf8] transition-colors"
                  >
                    Следующий тест
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
