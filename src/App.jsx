import { useState, useEffect, useReducer, createContext, useContext, useCallback, useMemo } from "react";
import { Search, Home, BookOpen, MessageSquare, CreditCard, Heart, User, Sun, Moon, Upload, ChevronRight, ArrowLeft, Bookmark, Copy, Share2, RotateCcw, Shuffle, X, BarChart2, Settings, Trash2, Eye, EyeOff, Target, TrendingUp, Clock, Award, Flame, Zap, CheckCircle, Database, FileText, Brain, SkipForward, SkipBack, Play, RefreshCw, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────
const VOCAB_DS = {
  id: "hsk1-vocab", name: "HSK 1 শব্দভান্ডার", type: "vocabulary",
  importDate: new Date().toISOString(),
  data: [
    { id:"v001", character:"爸爸", pinyin:"bàba", banglaMeaning:"বাবা", englishMeaning:"Father", category:"পরিবার", subtopic:"পরিবারের সদস্য", etymology:"爸 = 父 (fù - পিতা) + 巴 (bā - ধ্বনি সংকেত)\n\n🔤 父 = পিতার প্রতীক — অক্ষরটি একজন কর্তৃত্বশীল ব্যক্তিকে দৃশ্যমান করে।", mnemonic:"🏠 爸爸 শোনায় 'বাবা' এর মতো! সব ভাষায় বাবাকে 'বাবা' বলে।\n\n💡 父 চিহ্নটি দেখতে হাত প্রসারিত পিতার মতো।" },
    { id:"v002", character:"妈妈", pinyin:"māma", banglaMeaning:"মা", englishMeaning:"Mother", category:"পরিবার", subtopic:"পরিবারের সদস্য", etymology:"妈 = 女 (nǚ - নারী) + 马 (mǎ - ধ্বনি সংকেত)\n\n🔤 女 = নারী — মায়ের সংযোগ দেখায়।", mnemonic:"🤱 妈妈 শোনায় 'মামা' বা 'মা' এর মতো — সব ভাষায়!\n\n💡 অক্ষরের ভেতরে 女 (নারী) আছে।" },
    { id:"v003", character:"我", pinyin:"wǒ", banglaMeaning:"আমি / আমাকে", englishMeaning:"I / Me", category:"সর্বনাম", subtopic:"ব্যক্তিগত সর্বনাম", etymology:"আমি-আক্ষরিক অর্থে 'আমার অস্ত্র' থেকে 'আমি' হয়েছে।\n\n🏺 প্রাচীন চিত্রলিপি: হাত + অস্ত্র = আমার", mnemonic:"🤺 কল্পনা করুন কেউ অস্ত্র ধরে বলছে 'এটা আমার!' — সেটাই 我!\n\n💡 দেখতে হাত প্রসারিত মানুষের মতো।" },
    { id:"v004", character:"你", pinyin:"nǐ", banglaMeaning:"তুমি / আপনি", englishMeaning:"You", category:"সর্বনাম", subtopic:"ব্যক্তিগত সর্বনাম", etymology:"你 = 亻(মানুষ) + 尔 (প্রাচীন 'তুমি')\n\n🔤 亻= ব্যক্তির চিহ্ন", mnemonic:"👆 你 = তুমি! কাউকে দেখিয়ে বলুন 'নি'!\n\n💡 মানুষের চিহ্ন (亻) আছে — অন্য মানুষকে বোঝাচ্ছেন।" },
    { id:"v005", character:"你好", pinyin:"nǐhǎo", banglaMeaning:"হ্যালো / নমস্কার", englishMeaning:"Hello", category:"অভিবাদন", subtopic:"সাধারণ অভিবাদন", etymology:"你 = তুমি, 好 = ভালো\n\n💬 আক্ষরিক: 'তুমি ভালো?'\n好 = 女 (নারী) + 子 (শিশু) = সুখী", mnemonic:"👋 'তুমি ভালো!' — সবচেয়ে বিখ্যাত চীনা অভিবাদন!\n\n💡 好 তে মহিলা তার সন্তানকে নিয়ে আছেন — এর চেয়ে ভালো কী?" },
    { id:"v006", character:"谢谢", pinyin:"xièxiè", banglaMeaning:"ধন্যবাদ", englishMeaning:"Thank you", category:"অভিবাদন", subtopic:"সাধারণ প্রকাশ", etymology:"谢 = 讠(কথা) + 射 (লক্ষ্য)\n\n🙏 মূলত 'কথায় স্বীকার করা' — দ্বিগুণ = আরো বেশি কৃতজ্ঞতা", mnemonic:"🙏 谢谢 — দুবার বলুন বেশি ধন্যবাদের জন্য!\n\n💡 চীনা ভাষায় দ্বিগুণ শব্দ মানে 'আরো বেশি।'" },
    { id:"v007", character:"中国", pinyin:"Zhōngguó", banglaMeaning:"চীন", englishMeaning:"China", category:"স্থান", subtopic:"দেশসমূহ", etymology:"中 = মধ্য/কেন্দ্র, 国 = দেশ\n\n🌏 আক্ষরিক অর্থ: 'মধ্যরাজ্য'", mnemonic:"🏯 চীন নিজেকে বিশ্বের কেন্দ্র মনে করতো!\n\n💡 中 = বাক্সের CENTER-এ পতাকা।" },
    { id:"v008", character:"汉语", pinyin:"Hànyǔ", banglaMeaning:"চীনা ভাষা / মান্দারিন", englishMeaning:"Chinese language", category:"ভাষা ও শিক্ষা", subtopic:"ভাষাসমূহ", etymology:"汉 = হান রাজবংশ (206 BC–220 AD)\n语 = ভাষা", mnemonic:"📚 汉语 = হান ভাষা = চীনা!\n\n💡 语-এর বামে 讠চিহ্ন = কথা/ভাষার সংকেত।" },
    { id:"v009", character:"学习", pinyin:"xuéxí", banglaMeaning:"পড়াশোনা করা / শেখা", englishMeaning:"To study / To learn", category:"ভাষা ও শিক্ষা", subtopic:"শিক্ষা", etymology:"学 = শেখা, 习 = অনুশীলন\n\n📖 পাখির ডানা ঝাপটানো = বারবার অনুশীলন", mnemonic:"📚 学习 = শেখা + অনুশীলন!\n\n💡 শুধু শেখলে হবে না, অনুশীলনও করতে হবে।" },
    { id:"v010", character:"喜欢", pinyin:"xǐhuān", banglaMeaning:"পছন্দ করা / ভালোবাসা", englishMeaning:"To like / To enjoy", category:"অনুভূতি", subtopic:"আবেগ", etymology:"喜 = আনন্দ (ঢোল + মুখ)\n欢 = সুখী", mnemonic:"❤️ 喜 তে ঢোল বাজছে আনন্দে! 欢 হাসিখুশি অনুভূতি।\n\n💡 একসাথে = বিশুদ্ধ আনন্দ = পছন্দ!" },
    { id:"v011", character:"朋友", pinyin:"péngyou", banglaMeaning:"বন্ধু", englishMeaning:"Friend(s)", category:"পরিবার", subtopic:"সামাজিক সম্পর্ক", etymology:"朋 = একসাথে বাঁধা শামুকের খোলস (প্রাচীন মুদ্রা)\n友 = সাহায্য করা হাত", mnemonic:"🤝 朋 = দুটো চাঁদ (月月) পাশাপাশি — দুই বন্ধু!\n\n💡 友 = সাহায্যের হাত।" },
    { id:"v012", character:"老师", pinyin:"lǎoshī", banglaMeaning:"শিক্ষক / শিক্ষিকা", englishMeaning:"Teacher", category:"পরিবার", subtopic:"পেশা", etymology:"老 = বৃদ্ধ/অভিজ্ঞ\n师 = মাস্টার/বিশেষজ্ঞ", mnemonic:"🎓 老师 = 'অভিজ্ঞ মাস্টার' = শিক্ষক!\n\n💡 老 = বয়োজ্যেষ্ঠ, 师 = বিশেষজ্ঞ।" },
    { id:"v013", character:"学生", pinyin:"xuéshēng", banglaMeaning:"ছাত্র / ছাত্রী", englishMeaning:"Student", category:"পরিবার", subtopic:"পেশা", etymology:"学 = শেখা\n生 = জীবন/জন্ম", mnemonic:"📖 学生 = শিক্ষা + জীবন = ছাত্র!\n\n💡 তুমি 学生 — শিক্ষার জন্য জন্মেছ!" },
    { id:"v014", character:"再见", pinyin:"zàijiàn", banglaMeaning:"বিদায় / আবার দেখা হবে", englishMeaning:"Goodbye", category:"অভিবাদন", subtopic:"সাধারণ প্রকাশ", etymology:"再 = আবার\n见 = দেখা", mnemonic:"👋 再见 = 'আবার দেখা হবে!' — আশাবাদী বিদায়!\n\n💡 再 = আবার, 见 = দেখা।" },
    { id:"v015", character:"对不起", pinyin:"duìbuqǐ", banglaMeaning:"দুঃখিত / ক্ষমা করবেন", englishMeaning:"Sorry", category:"অভিবাদন", subtopic:"সাধারণ প্রকাশ", etymology:"对 = মুখোমুখি, 不 = না, 起 = উঠতে\n\n🙇 আক্ষরিক: 'আপনার সামনে মাথা তুলতে পারছি না'", mnemonic:"🙇 对不起 = 'আপনার সামনে উঠতে পারছি না' = দুঃখিত!\n\n💡 এত কাব্যিক ক্ষমাপ্রার্থনা!" }
  ]
};

const SENT_DS = {
  id: "hsk1-sentences", name: "HSK 1 বাক্য", type: "sentence",
  importDate: new Date().toISOString(),
  data: [
    { id:"sw001", word:"爸爸", category:"পরিবার", sentences: [
      { id:"s001", hanzi:"我爸爸是老师。", pinyin:"Wǒ bàba shì lǎoshī.", banglaMeaning:"আমার বাবা একজন শিক্ষক।", englishMeaning:"My father is a teacher." },
      { id:"s002", hanzi:"爸爸喜欢学习汉语。", pinyin:"Bàba xǐhuān xuéxí Hànyǔ.", banglaMeaning:"বাবা চীনা ভাষা শিখতে পছন্দ করেন।", englishMeaning:"Father likes to study Chinese." },
      { id:"s003", hanzi:"爸爸，谢谢你！", pinyin:"Bàba, xièxiè nǐ!", banglaMeaning:"বাবা, আপনাকে ধন্যবাদ!", englishMeaning:"Father, thank you!" },
      { id:"s004", hanzi:"我的爸爸很高。", pinyin:"Wǒ de bàba hěn gāo.", banglaMeaning:"আমার বাবা খুব লম্বা।", englishMeaning:"My father is very tall." },
      { id:"s005", hanzi:"我爸爸是中国人。", pinyin:"Wǒ bàba shì Zhōngguórén.", banglaMeaning:"আমার বাবা একজন চীনা।", englishMeaning:"My father is Chinese." }
    ]},
    { id:"sw002", word:"你好", category:"অভিবাদন", sentences: [
      { id:"s006", hanzi:"你好，我是学生。", pinyin:"Nǐ hǎo, wǒ shì xuéshēng.", banglaMeaning:"হ্যালো, আমি একজন ছাত্র।", englishMeaning:"Hello, I am a student." },
      { id:"s007", hanzi:"老师，你好！", pinyin:"Lǎoshī, nǐ hǎo!", banglaMeaning:"শিক্ষক, হ্যালো!", englishMeaning:"Teacher, hello!" },
      { id:"s008", hanzi:"朋友，你好！", pinyin:"Péngyou, nǐ hǎo!", banglaMeaning:"বন্ধু, হ্যালো!", englishMeaning:"Friend, hello!" },
      { id:"s009", hanzi:"你好，你是老师吗？", pinyin:"Nǐ hǎo, nǐ shì lǎoshī ma?", banglaMeaning:"হ্যালো, আপনি কি শিক্ষক?", englishMeaning:"Hello, are you a teacher?" },
      { id:"s010", hanzi:"你好，我喜欢中国！", pinyin:"Nǐ hǎo, wǒ xǐhuān Zhōngguó!", banglaMeaning:"হ্যালো, আমি চীনকে পছন্দ করি!", englishMeaning:"Hello, I like China!" }
    ]},
    { id:"sw003", word:"学习", category:"শিক্ষা", sentences: [
      { id:"s011", hanzi:"我喜欢学习汉语。", pinyin:"Wǒ xǐhuān xuéxí Hànyǔ.", banglaMeaning:"আমি চীনা ভাষা শিখতে পছন্দ করি।", englishMeaning:"I like to study Chinese." },
      { id:"s012", hanzi:"学生每天学习。", pinyin:"Xuéshēng měitiān xuéxí.", banglaMeaning:"ছাত্র প্রতিদিন পড়াশোনা করে।", englishMeaning:"Students study every day." },
      { id:"s013", hanzi:"学习汉语很有意思。", pinyin:"Xuéxí Hànyǔ hěn yǒu yìsi.", banglaMeaning:"চীনা ভাষা শেখা খুব মজার।", englishMeaning:"Studying Chinese is very interesting." },
      { id:"s014", hanzi:"我和朋友一起学习。", pinyin:"Wǒ hé péngyou yīqǐ xuéxí.", banglaMeaning:"আমি বন্ধুর সাথে একসাথে পড়াশোনা করি।", englishMeaning:"I study together with my friend." },
      { id:"s015", hanzi:"老师喜欢学习。", pinyin:"Lǎoshī xǐhuān xuéxí.", banglaMeaning:"শিক্ষক পড়াশোনা করতে পছন্দ করেন।", englishMeaning:"The teacher likes to study." }
    ]}
  ]
};

const STORY_DS = {
  id: "hsk1-stories", name: "HSK 1 গল্প", type: "story",
  importDate: new Date().toISOString(),
  data: [
    { id:"st001", title:"আমার পরিবার (我的家庭)", category:"পরিবার", story: { paragraphs: [
      { hanzi:"我有一个很幸福的家庭。", pinyin:"Wǒ yǒu yī gè hěn xìngfú de jiātíng.", banglaMeaning:"আমার একটি খুব সুখী পরিবার আছে।", englishMeaning:"I have a very happy family." },
      { hanzi:"我的爸爸是老师，他喜欢学习汉语。", pinyin:"Wǒ de bàba shì lǎoshī, tā xǐhuān xuéxí Hànyǔ.", banglaMeaning:"আমার বাবা একজন শিক্ষক, তিনি চীনা ভাষা শিখতে পছন্দ করেন।", englishMeaning:"My father is a teacher, he likes to study Chinese." },
      { hanzi:"我的妈妈也是老师。她喜欢学生们。", pinyin:"Wǒ de māma yě shì lǎoshī. Tā xǐhuān xuéshēngmen.", banglaMeaning:"আমার মাও একজন শিক্ষিকা। তিনি ছাত্রছাত্রীদের পছন্দ করেন।", englishMeaning:"My mother is also a teacher. She likes the students." },
      { hanzi:"我是学生。我喜欢学习汉语！", pinyin:"Wǒ shì xuéshēng. Wǒ xǐhuān xuéxí Hànyǔ!", banglaMeaning:"আমি একজন ছাত্র। আমি চীনা ভাষা শিখতে পছন্দ করি!", englishMeaning:"I am a student. I like to study Chinese!" },
      { hanzi:"我们是朋友！再见！", pinyin:"Wǒmen shì péngyou! Zàijiàn!", banglaMeaning:"আমরা বন্ধু! বিদায়!", englishMeaning:"We are friends! Goodbye!" }
    ]}},
    { id:"st002", title:"আমার স্কুল (我的学校)", category:"শিক্ষা", story: { paragraphs: [
      { hanzi:"我在中国学习汉语。", pinyin:"Wǒ zài Zhōngguó xuéxí Hànyǔ.", banglaMeaning:"আমি চীনে চীনা ভাষা শিখছি।", englishMeaning:"I study Chinese in China." },
      { hanzi:"我的老师很好，她喜欢教汉语。", pinyin:"Wǒ de lǎoshī hěn hǎo, tā xǐhuān jiāo Hànyǔ.", banglaMeaning:"আমার শিক্ষক খুব ভালো, তিনি চীনা ভাষা শেখাতে পছন্দ করেন।", englishMeaning:"My teacher is very good, she likes to teach Chinese." },
      { hanzi:"我说：我喜欢！谢谢老师！", pinyin:"Wǒ shuō: Wǒ xǐhuān! Xièxiè lǎoshī!", banglaMeaning:"আমি বলি: আমি পছন্দ করি! শিক্ষককে ধন্যবাদ!", englishMeaning:"I say: I like it! Thank you, teacher!" },
      { hanzi:"我的同学是我的好朋友。我们一起学习汉语。", pinyin:"Wǒ de tóngxué shì wǒ de hǎo péngyou.", banglaMeaning:"আমার সহপাঠীরা ভালো বন্ধু। আমরা একসাথে চীনা পড়ি।", englishMeaning:"My classmates are good friends. We study Chinese together." },
      { hanzi:"再见，老师！再见，朋友们！", pinyin:"Zàijiàn, lǎoshī! Zàijiàn, péngyoumen!", banglaMeaning:"বিদায়, শিক্ষক! বিদায়, বন্ধুরা!", englishMeaning:"Goodbye, teacher! Goodbye, friends!" }
    ]}}
  ]
};

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
const TH = {
  dark: { bg:"#0a0520", grad:"linear-gradient(135deg,#0a0520,#130b2e,#0d1533)", surface:"rgba(255,255,255,0.06)", border:"rgba(139,92,246,0.18)", text:"#f0eaff", muted:"#9b8db8", accent:"#7c3aed", accentL:"#a78bfa", gold:"#f59e0b", green:"#10b981", red:"#ef4444", glass:"rgba(255,255,255,0.07)", nav:"rgba(10,5,32,0.94)", input:"rgba(255,255,255,0.09)", chip:"rgba(124,58,237,0.15)", chipB:"rgba(139,92,246,0.3)" },
  light: { bg:"#f4f0fc", grad:"linear-gradient(135deg,#f4f0fc,#ede8f7,#e8f0fc)", surface:"rgba(255,255,255,0.78)", border:"rgba(124,58,237,0.13)", text:"#1a0533", muted:"#6b5a8a", accent:"#7c3aed", accentL:"#8b5cf6", gold:"#d97706", green:"#059669", red:"#dc2626", glass:"rgba(255,255,255,0.74)", nav:"rgba(244,240,252,0.95)", input:"rgba(255,255,255,0.9)", chip:"rgba(124,58,237,0.09)", chipB:"rgba(124,58,237,0.22)" }
};

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0,10);
const Ctx = createContext(null);

const INIT = {
  theme:"dark", page:"home", params:{}, hist:[],
  vDS:[VOCAB_DS], sDS:[SENT_DS], stDS:[STORY_DS],
  favs:[], books:[], ws:{}, log:{}, goal:20, streak:0, lastDay:null,
  viewed:0, recent:[], cont:{v:null,s:null,st:null,fc:null},
  settings:{ fs:"medium", rw:"medium", lh:"normal" },
  popup:null, focus:false
};

function red(st, a) {
  switch(a.t) {
    case "LOAD": return { ...st, ...a.d };
    case "GO": return { ...st, page:a.p, params:a.ps||{}, hist:[...st.hist,{page:st.page,params:st.params}] };
    case "BACK": { if(!st.hist.length) return st; const prev=st.hist[st.hist.length-1]; return { ...st, page:prev.page, params:prev.params, hist:st.hist.slice(0,-1) }; }
    case "THEME": return { ...st, theme:a.v };
    case "POPUP": return { ...st, popup:a.v };
    case "FOCUS": return { ...st, focus:a.v };
    case "SET": return { ...st, settings:{ ...st.settings, ...a.v } };
    case "GOAL": return { ...st, goal:a.v };
    case "FAV": { const k=`${a.k}:${a.id}`; return { ...st, favs: st.favs.includes(k) ? st.favs.filter(f=>f!==k) : [...st.favs,k] }; }
    case "BOOK": { const k=`${a.k}:${a.id}`; return { ...st, books: st.books.includes(k) ? st.books.filter(b=>b!==b!==k) : [...st.books,k] }; }
    case "WS": { const w={...st.ws}; if(w[a.id]===a.s) delete w[a.id]; else w[a.id]=a.s; return { ...st, ws:w }; }
    case "LOG": { const d=todayStr(); const lg={...st.log,[d]:(st.log[d]||0)+1}; const y=new Date(); y.setDate(y.getDate()-1); const ys=y.toISOString().slice(0,10); const ns=st.lastDay===ys||st.lastDay===d?(st.lastDay===d?st.streak:st.streak+1):1; return { ...st, log:lg, lastDay:d, streak:ns, viewed:st.viewed+(a.v||0) }; }
    case "CONT": return { ...st, cont:{ ...st.cont, [a.k]:a.d } };
    case "RECENT": { const u=[a.d,...st.recent.filter(r=>r.id!==a.d.id)].slice(0,8); return { ...st, recent:u }; }
    case "IMPORT": { const ds=a.ds; if(ds.type==="vocabulary") return { ...st, vDS:[...st.vDS.filter(d=>d.id!==ds.id), ds] }; if(ds.type==="sentence") return { ...st, sDS:[...st.sDS.filter(d=>d.id!==ds.id), ds] }; return { ...st, stDS:[...st.stDS.filter(d=>d.id!==ds.id), ds] }; }
    case "DEL": { if(a.type==="vocabulary") return { ...st, vDS:st.vDS.filter(d=>d.id!==a.id) }; if(a.type==="sentence") return { ...st, sDS:st.sDS.filter(d=>d.id!==a.id) }; return { ...st, stDS:st.stDS.filter(d=>d.id!==a.id) }; }
    default: return st;
  }
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
const TM = {"ā":"a","á":"a","ǎ":"a","à":"a","ē":"e","é":"e","ě":"e","è":"e","ī":"i","í":"i","ǐ":"i","ì":"i","ō":"o","ó":"o","ǒ":"o","ò":"o","ū":"u","ú":"u","ǔ":"u","ù":"u","ü":"u"};
const normP = t => t.toLowerCase().replace(/[āáǎàēéěèīíǐìōóǒòūúǔùü]/g, c => TM[c]||c);
const isCJ = c => /[\u4e00-\u9fff]/.test(c);
const fmtD = d => new Date(d).toLocaleDateString("bn-BD",{day:"numeric",month:"short"});
const useApp = () => useContext(Ctx);

function search(q, vocab) {
  if (!q.trim()) return [];
  const ql = q.trim().toLowerCase(), qp = normP(ql);
  return vocab.filter(w =>
    w.character.includes(ql) ||
    normP(w.pinyin.toLowerCase()).includes(qp) ||
    w.banglaMeaning.toLowerCase().includes(ql) ||
    w.englishMeaning.toLowerCase().includes(ql)
  );
}

function tokenize(text, vocab) {
  const chars = [...text], tokens = [];
  let i = 0;
  while (i < chars.length) {
    if (!isCJ(chars[i])) { tokens.push({ text:chars[i], isW:false }); i++; continue; }
    let matched = false;
    for (let len = Math.min(6, chars.length-i); len >= 2; len--) {
      const sub = chars.slice(i, i+len).join("");
      if (vocab.some(v => v.character === sub)) { tokens.push({ text:sub, isW:true }); i+=len; matched=true; break; }
    }
    if (!matched) { tokens.push({ text:chars[i], isW:true }); i++; }
  }
  return tokens;
}

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
function Styles({ theme }) {
  const t = TH[theme];
  const css = [
    "*{margin:0;padding:0;box-sizing:border-box;}",
    "body{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;}",
    "::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:" + t.accent + "55;border-radius:9px}",
    ".glass{background:" + t.glass + ";backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid " + t.border + ";}",
    ".ch{transition:all 0.22s}.ch:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(124,58,237,0.16)}",
    ".bh{transition:all 0.17s;cursor:pointer}.bh:hover{filter:brightness(1.12);transform:translateY(-1px)}.bh:active{transform:translateY(0)}",
    ".fi{animation:fi 0.28s ease}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
    ".su{animation:su 0.32s ease}@keyframes su{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}",
    ".fcard{perspective:1000px}",
    ".fi2{transition:transform 0.52s;transform-style:preserve-3d}",
    ".fi2.flip{transform:rotateY(180deg)}",
    ".ff,.fb{backface-visibility:hidden;-webkit-backface-visibility:hidden;position:absolute;inset:0;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px}",
    ".fb{transform:rotateY(180deg)}",
    "ruby{ruby-align:center}rt{font-size:0.56em;color:" + t.accentL + ";letter-spacing:0.01em}",
    ".htok{cursor:pointer;border-radius:3px;padding:0 2px;transition:background 0.14s}.htok:hover{background:" + t.accent + "28}",
    "input,textarea{outline:none;font-family:inherit}",
    "@keyframes spin{to{transform:rotate(360deg)}}"
  ].join("");
  return <style>{css}</style>;
}

// ─────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────
function GCard({ children, style, onClick, className="" }) {
  const { st } = useApp();
  return (
    <div className={"glass ch " + className} onClick={onClick}
      style={{ borderRadius:16, padding:16, cursor:onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, v="primary", sz="md", icon, disabled, style }) {
  const { st } = useApp(); const t = TH[st.theme];
  const sizes = { sm:{padding:"6px 12px",fontSize:12,gap:5}, md:{padding:"9px 18px",fontSize:14,gap:6}, lg:{padding:"12px 24px",fontSize:15,gap:7} };
  const vars = {
    primary: { background:t.accent, color:"#fff", border:"none", boxShadow:"0 3px 12px "+t.accent+"44" },
    secondary: { background:t.surface, color:t.text, border:"1px solid "+t.border },
    ghost: { background:"transparent", color:t.muted, border:"1px solid "+t.border },
    danger: { background:t.red+"1e", color:t.red, border:"1px solid "+t.red+"44" },
    gold: { background:t.gold+"1e", color:t.gold, border:"1px solid "+t.gold+"44" },
    green: { background:t.green+"1e", color:t.green, border:"1px solid "+t.green+"44" }
  };
  const s = sizes[sz] || sizes.md;
  const vr = vars[v] || vars.primary;
  return (
    <button className="bh" disabled={disabled} onClick={!disabled?onClick:undefined}
      style={{ display:"inline-flex", alignItems:"center", gap:s.gap, borderRadius:10, fontWeight:600, opacity:disabled?0.5:1, ...s, ...vr, ...style }}>
      {icon}{children}
    </button>
  );
}

function Badge({ label, color="accent" }) {
  const { st } = useApp(); const t = TH[st.theme];
  const cols = {
    accent: { bg:t.chip, bd:t.chipB, tx:t.accentL },
    gold: { bg:t.gold+"1a", bd:t.gold+"44", tx:t.gold },
    green: { bg:t.green+"1a", bd:t.green+"44", tx:t.green },
    red: { bg:t.red+"1a", bd:t.red+"44", tx:t.red },
    muted: { bg:t.surface, bd:t.border, tx:t.muted }
  };
  const c = cols[color] || cols.accent;
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:c.bg, border:"1px solid "+c.bd, color:c.tx }}>{label}</span>;
}

function SBadge({ status }) {
  if (!status) return <Badge label="পড়া হয়নি" color="muted" />;
  const m = { known:["🟢 জানি","green"], learning:["🟡 শিখছি","gold"], difficult:["🔴 কঠিন","red"] };
  const [l, c] = m[status] || ["?","muted"];
  return <Badge label={l} color={c} />;
}

function PBar({ value, max=100, color }) {
  const { st } = useApp(); const t = TH[st.theme];
  const pct = Math.min(100, Math.round((value/max)*100));
  const c = color || t.accent;
  return (
    <div style={{ background:t.border, borderRadius:99, height:6, overflow:"hidden" }}>
      <div style={{ width:pct+"%", height:"100%", background:c, borderRadius:99, transition:"width 0.4s", boxShadow:"0 0 8px "+c+"66" }} />
    </div>
  );
}

function StatCard({ Icon, label, value, color, sub }) {
  const { st } = useApp(); const t = TH[st.theme]; const c = color || t.accent;
  return (
    <GCard style={{ textAlign:"center", padding:"13px 8px" }}>
      <div style={{ width:34, height:34, borderRadius:10, background:c+"22", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 7px" }}>
        <Icon size={17} color={c} />
      </div>
      <div style={{ fontSize:21, fontWeight:800, color:c }}>{value}</div>
      <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:t.muted }}>{sub}</div>}
    </GCard>
  );
}

// ─────────────────────────────────────────────
// POPUP DICTIONARY
// ─────────────────────────────────────────────
function Popup() {
  const { st, dp } = useApp(); const t = TH[st.theme]; const w = st.popup;
  if (!w) return null;
  const isFav = w.id && st.favs.includes("vocab:"+w.id);
  const status = w.id && st.ws[w.id];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16, paddingBottom:90 }}
      onClick={e => e.target===e.currentTarget && dp({ t:"POPUP", v:null })}>
      <div className="glass su" style={{ width:"100%", maxWidth:430, borderRadius:22, padding:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:52, fontWeight:900, color:t.text, lineHeight:1.1 }}>{w.character}</div>
            <div style={{ fontSize:17, color:t.accentL, marginTop:4 }}>{w.pinyin}</div>
          </div>
          <button onClick={() => dp({ t:"POPUP", v:null })}
            style={{ background:t.surface, border:"1px solid "+t.border, borderRadius:9, padding:"5px 8px", cursor:"pointer", color:t.muted }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ background:t.surface, borderRadius:12, padding:"10px 14px", marginBottom:10 }}>
          <div style={{ fontSize:14, color:t.text, marginBottom:4 }}>🇧🇩 {w.banglaMeaning}</div>
          <div style={{ fontSize:13, color:t.muted }}>🇬🇧 {w.englishMeaning}</div>
        </div>
        {w.id && <SBadge status={status} />}
        <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
          {w.id && (
            <Btn sz="sm" v={isFav?"gold":"secondary"} icon={<Heart size={13} />}
              onClick={() => dp({ t:"FAV", k:"vocab", id:w.id })}>
              {isFav?"সংরক্ষিত":"পছন্দ"}
            </Btn>
          )}
          {w.id && w.did && (
            <Btn sz="sm" v="primary" icon={<Eye size={13} />}
              onClick={() => { dp({ t:"POPUP", v:null }); dp({ t:"GO", p:"vd", ps:{ wid:w.id, did:w.did } }); }}>
              বিস্তারিত
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
const NAV = [
  { p:"home", I:Home, l:"হোম" }, { p:"vh", I:BookOpen, l:"শব্দ" },
  { p:"seh", I:MessageSquare, l:"বাক্য" }, { p:"sth", I:FileText, l:"গল্প" },
  { p:"fch", I:CreditCard, l:"কার্ড" }, { p:"favs", I:Heart, l:"পছন্দ" },
  { p:"prof", I:User, l:"প্রোফাইল" }
];
const TITLES = { home:"🏠 হোম", vh:"শব্দভান্ডার", vs:"শব্দ বিভাগ", vc:"শ্রেণী", vd:"শব্দ বিবরণ", seh:"বাক্য শিক্ষা", ses:"বাক্য বিভাগ", ser:"বাক্য পাঠ", sth:"গল্প শিক্ষা", sts:"গল্প বিভাগ", str:"গল্প পাঠ", fch:"ফ্লাশকার্ড", fcs:"ফ্লাশকার্ড সেশন", rev:"পর্যালোচনা", favs:"পছন্দ ও বুকমার্ক", prof:"প্রোফাইল", stats:"পরিসংখ্যান", admin:"অ্যাডমিন", cfg:"সেটিংস", srch:"অনুসন্ধান" };

function TopNav() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const isHome = st.page === "home";
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:500, background:t.nav, backdropFilter:"blur(20px)", borderBottom:"1px solid "+t.border, height:56, display:"flex", alignItems:"center", padding:"0 12px", gap:10 }}>
      {!isHome && (
        <button onClick={() => dp({ t:"BACK" })}
          style={{ background:"none", border:"1px solid "+t.border, borderRadius:9, padding:"6px 8px", cursor:"pointer", color:t.muted, display:"flex" }}>
          <ArrowLeft size={15} />
        </button>
      )}
      <span style={{ fontWeight:800, fontSize:15, color:t.text, flex:1 }}>
        {isHome ? "📖 HSK Smart Learning" : (TITLES[st.page] || "HSK")}
      </span>
      <button onClick={() => dp({ t:"THEME", v:st.theme==="dark"?"light":"dark" })}
        style={{ background:t.surface, border:"1px solid "+t.border, borderRadius:9, padding:"6px 8px", cursor:"pointer", color:t.muted, display:"flex" }}>
        {st.theme==="dark" ? <Sun size={14}/> : <Moon size={14}/>}
      </button>
      <button onClick={() => dp({ t:"GO", p:"admin" })}
        style={{ background:t.surface, border:"1px solid "+t.border, borderRadius:9, padding:"6px 8px", cursor:"pointer", color:t.muted, display:"flex" }}>
        <Database size={14} />
      </button>
      <button onClick={() => dp({ t:"GO", p:"cfg" })}
        style={{ background:t.surface, border:"1px solid "+t.border, borderRadius:9, padding:"6px 8px", cursor:"pointer", color:t.muted, display:"flex" }}>
        <Settings size={14} />
      </button>
    </nav>
  );
}

function BotNav() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:500, background:t.nav, backdropFilter:"blur(20px)", borderTop:"1px solid "+t.border, display:"flex", justifyContent:"space-around", padding:"6px 0 8px" }}>
      {NAV.map(({ p, I, l }) => {
        const active = st.page===p || (p==="vh"&&st.page.startsWith("v")) || (p==="seh"&&st.page.startsWith("se")) || (p==="sth"&&st.page.startsWith("st")) || (p==="fch"&&st.page.startsWith("fc"));
        return (
          <button key={p} onClick={() => dp({ t:"GO", p })}
            style={{ background:active?t.accent+"15":"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 8px", borderRadius:10, transition:"all 0.18s" }}>
            <I size={17} color={active?t.accent:t.muted} strokeWidth={active?2.2:1.8} />
            <span style={{ fontSize:9.5, color:active?t.accent:t.muted, fontWeight:active?700:500 }}>{l}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function Home() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [q, setQ] = useState("");
  const allV = st.vDS.flatMap(d => d.data);
  const known = Object.values(st.ws).filter(s=>s==="known").length;
  const learning = Object.values(st.ws).filter(s=>s==="learning").length;
  const diff = Object.values(st.ws).filter(s=>s==="difficult").length;
  const td = st.log[todayStr()] || 0;
  const gp = Math.min(100, Math.round((td/st.goal)*100));

  return (
    <div className="fi" style={{ paddingBottom:80, color:t.text }}>
      <div style={{ background:"linear-gradient(135deg,"+t.accent+"22,"+t.gold+"0a)", borderBottom:"1px solid "+t.border, padding:"22px 16px 16px", textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:4 }}>📖</div>
        <h1 style={{ fontSize:20, fontWeight:800, color:t.text, marginBottom:4 }}>HSK Smart Learning</h1>
        <p style={{ fontSize:12, color:t.muted, marginBottom:10 }}>চীনা ভাষা শেখার প্রিমিয়াম প্ল্যাটফর্ম</p>
        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          <Badge label={"🔥 "+st.streak+" দিন"} color="gold" />
          <Badge label={"🎯 "+gp+"% লক্ষ্য"} color={gp>=100?"green":"accent"} />
          <Badge label={"📚 "+allV.length+" শব্দ"} color="muted" />
        </div>
      </div>
      <div style={{ padding:16 }}>
        {/* Search */}
        <div style={{ position:"relative", marginBottom:14 }}>
          <Search size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.muted }} />
          <input value={q} onChange={e=>setQ(e.target.value)}
            onKeyDown={e => e.key==="Enter" && q.trim() && dp({ t:"GO", p:"srch", ps:{ q } })}
            placeholder="Chinese • Pinyin • বাংলা • English"
            style={{ width:"100%", padding:"13px 13px 13px 40px", borderRadius:14, border:"1px solid "+t.border, background:t.input, color:t.text, fontSize:15 }} />
          {q && <button onClick={() => dp({ t:"GO", p:"srch", ps:{ q } })}
            style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:t.accent, border:"none", borderRadius:8, padding:"5px 10px", cursor:"pointer", color:"#fff", fontSize:12 }}>খুঁজুন</button>}
        </div>

        {/* Continue Learning */}
        {(st.cont.st || st.cont.fc) && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>▶ চালিয়ে যান</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {st.cont.st && (
                <GCard onClick={() => dp({ t:"GO", p:"str", ps:st.cont.st })}
                  style={{ flex:1, minWidth:140, cursor:"pointer", background:t.green+"0f", borderColor:t.green+"33" }}>
                  <div style={{ fontSize:11, color:t.green, marginBottom:4 }}>📖 গল্প</div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{st.cont.st.title}</div>
                  <PBar value={st.cont.st.prog||0} color={t.green} />
                </GCard>
              )}
              {st.cont.fc && (
                <GCard onClick={() => dp({ t:"GO", p:"fcs", ps:st.cont.fc })}
                  style={{ flex:1, minWidth:140, cursor:"pointer", background:t.accent+"0f", borderColor:t.accent+"33" }}>
                  <div style={{ fontSize:11, color:t.accentL, marginBottom:4 }}>🎴 ফ্লাশকার্ড</div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{st.cont.fc.name||"শেষ সেশন"}</div>
                  <div style={{ fontSize:11, color:t.muted }}>কার্ড {(st.cont.fc.idx||0)+1}+</div>
                </GCard>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.05em" }}>📊 পরিসংখ্যান</div>
            <Btn sz="sm" v="ghost" onClick={() => dp({ t:"GO", p:"stats" })}>বিস্তারিত</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            <StatCard Icon={BookOpen} label="মোট" value={allV.length} color={t.accent} />
            <StatCard Icon={CheckCircle} label="জানি" value={known} color={t.green} />
            <StatCard Icon={Brain} label="শিখছি" value={learning} color={t.gold} />
            <StatCard Icon={Zap} label="কঠিন" value={diff} color={t.red} />
          </div>
        </div>

        {/* Daily Goal */}
        <GCard style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Target size={15} color={t.accent} />
              <span style={{ fontWeight:700, color:t.text, fontSize:14 }}>আজকের লক্ষ্য</span>
            </div>
            <span style={{ fontSize:12, color:t.muted }}>{td}/{st.goal}</span>
          </div>
          <PBar value={td} max={st.goal} color={gp>=100?t.green:t.accent} />
          {gp>=100 && <div style={{ fontSize:12, color:t.green, marginTop:6, textAlign:"center" }}>🎉 লক্ষ্য সম্পন্ন!</div>}
        </GCard>

        {/* Vocab */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.05em" }}>📚 শব্দভান্ডার</div>
            <Btn sz="sm" v="ghost" onClick={() => dp({ t:"GO", p:"vh" })}>সব দেখুন</Btn>
          </div>
          {st.vDS.map(d => (
            <GCard key={d.id} onClick={() => dp({ t:"GO", p:"vs", ps:{ did:d.id } })}
              style={{ marginBottom:8, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:t.accent+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <BookOpen size={19} color={t.accent} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
                  <div style={{ fontSize:11, color:t.muted }}>{d.data.length} টি শব্দ • {fmtD(d.importDate)}</div>
                </div>
                <ChevronRight size={15} color={t.muted} />
              </div>
            </GCard>
          ))}
        </div>

        {/* Sentences */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.05em" }}>💬 বাক্য শিক্ষা</div>
            <Btn sz="sm" v="ghost" onClick={() => dp({ t:"GO", p:"seh" })}>সব দেখুন</Btn>
          </div>
          {st.sDS.map(d => (
            <GCard key={d.id} onClick={() => dp({ t:"GO", p:"ses", ps:{ did:d.id } })}
              style={{ marginBottom:8, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:t.gold+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <MessageSquare size={19} color={t.gold} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
                  <div style={{ fontSize:11, color:t.muted }}>{d.data.length} টি শব্দ</div>
                </div>
                <ChevronRight size={15} color={t.muted} />
              </div>
            </GCard>
          ))}
        </div>

        {/* Stories */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, textTransform:"uppercase", letterSpacing:"0.05em" }}>📖 গল্প শিক্ষা</div>
            <Btn sz="sm" v="ghost" onClick={() => dp({ t:"GO", p:"sth" })}>সব দেখুন</Btn>
          </div>
          {st.stDS.map(d => (
            <GCard key={d.id} onClick={() => dp({ t:"GO", p:"sts", ps:{ did:d.id } })}
              style={{ marginBottom:8, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:t.green+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <FileText size={19} color={t.green} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
                  <div style={{ fontSize:11, color:t.muted }}>{d.data.length} টি গল্প</div>
                </div>
                <ChevronRight size={15} color={t.muted} />
              </div>
            </GCard>
          ))}
        </div>

        {/* Recent */}
        {st.recent.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>🕐 সাম্প্রতিক কার্যক্রম</div>
            {st.recent.slice(0,4).map((item,i) => (
              <GCard key={i} style={{ marginBottom:8, padding:"10px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{item.icon||"📝"}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{item.title}</div>
                    <div style={{ fontSize:11, color:t.muted }}>{item.sub}</div>
                  </div>
                </div>
              </GCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────
function SrchPage() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [q, setQ] = useState(st.params.q || "");
  const allV = useMemo(() => st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id }))), [st.vDS]);
  const res = useMemo(() => search(q, allV), [q, allV]);
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <div style={{ position:"relative", marginBottom:12 }}>
        <Search size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:t.muted }} />
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Chinese • Pinyin • বাংলা • English"
          style={{ width:"100%", padding:"12px 12px 12px 40px", borderRadius:12, border:"1px solid "+t.border, background:t.input, color:t.text, fontSize:14 }} />
      </div>
      {q && <div style={{ marginBottom:10, fontSize:12, color:t.muted }}>পাওয়া গেছে: <strong style={{ color:t.accent }}>{res.length}</strong> টি</div>}
      {res.map(w => (
        <GCard key={w.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"vd", ps:{ wid:w.id, did:w.did } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ minWidth:50, textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:t.text }}>{w.character}</div>
              <div style={{ fontSize:10, color:t.accentL }}>{w.pinyin}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:t.text, fontWeight:600 }}>{w.banglaMeaning}</div>
              <div style={{ fontSize:12, color:t.muted }}>{w.englishMeaning}</div>
              <div style={{ marginTop:4 }}><SBadge status={st.ws[w.id]} /></div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
      {q && res.length===0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:t.muted }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
          <div style={{ fontSize:14 }}>কোনো ফলাফল পাওয়া যায়নি</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// VOCABULARY
// ─────────────────────────────────────────────
function VH() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      {st.vDS.map(d => (
        <GCard key={d.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"vs", ps:{ did:d.id } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:t.accent+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <BookOpen size={20} color={t.accent} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
              <div style={{ fontSize:11, color:t.muted }}>{d.data.length} শব্দ • {fmtD(d.importDate)}</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function VS() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.vDS.find(d => d.id===st.params.did);
  if (!ds) return null;
  const cats = useMemo(() => { const m={}; ds.data.forEach(w => { if(!m[w.category]) m[w.category]=[]; m[w.category].push(w); }); return m; }, [ds]);
  const ck = Object.keys(cats);
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:14, background:t.accent+"0f" }}>
        <div style={{ fontWeight:700, color:t.accent }}>{ds.name}</div>
        <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>{ds.data.length} শব্দ • {ck.length} শ্রেণী • {fmtD(ds.importDate)}</div>
      </GCard>
      {ck.length>1 ? ck.map(c => (
        <GCard key={c} style={{ marginBottom:8, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"vc", ps:{ did:ds.id, cat:c } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:22 }}>📂</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:t.text }}>{c}</div>
              <div style={{ fontSize:11, color:t.muted }}>{cats[c].length} টি শব্দ</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      )) : <WList words={ds.data} did={ds.id} />}
    </div>
  );
}

function VC() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.vDS.find(d => d.id===st.params.did);
  if (!ds) return null;
  const words = ds.data.filter(w => w.category===st.params.cat);
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:12 }}>
        <div style={{ fontWeight:700, color:t.text }}>{st.params.cat}</div>
        <div style={{ fontSize:12, color:t.muted }}>{words.length} টি শব্দ</div>
      </GCard>
      <WList words={words} did={ds.id} />
    </div>
  );
}

function WList({ words, did }) {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [flt, setFlt] = useState("all");
  const fw = words.filter(w => {
    if (flt==="all") return true;
    if (flt==="known") return st.ws[w.id]==="known";
    if (flt==="learning") return st.ws[w.id]==="learning";
    if (flt==="difficult") return st.ws[w.id]==="difficult";
    if (flt==="fav") return st.favs.includes("vocab:"+w.id);
    if (flt==="new") return !st.ws[w.id];
    return true;
  });
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:10, overflowX:"auto", paddingBottom:4 }}>
        {[["all","সব"],["known","🟢জানি"],["learning","🟡শিখছি"],["difficult","🔴কঠিন"],["fav","❤️পছন্দ"],["new","নতুন"]].map(([v,l]) => (
          <Btn key={v} sz="sm" v={flt===v?"primary":"ghost"} onClick={() => setFlt(v)}>{l}</Btn>
        ))}
      </div>
      {fw.map((w,i) => (
        <GCard key={w.id} style={{ marginBottom:8, cursor:"pointer" }}
          onClick={() => { dp({ t:"LOG", v:1 }); dp({ t:"GO", p:"vd", ps:{ wid:w.id, did } }); }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, minWidth:22 }}>{i+1}</div>
            <div style={{ minWidth:48, textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:t.text }}>{w.character}</div>
              <div style={{ fontSize:10, color:t.accentL }}>{w.pinyin}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13, color:t.text }}>{w.banglaMeaning}</div>
              <div style={{ fontSize:12, color:t.muted }}>{w.englishMeaning}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <SBadge status={st.ws[w.id]} />
              {st.favs.includes("vocab:"+w.id) && <span style={{ color:t.gold, fontSize:12 }}>♥</span>}
            </div>
          </div>
        </GCard>
      ))}
      {fw.length===0 && <div style={{ textAlign:"center", padding:20, color:t.muted, fontSize:13 }}>এই ফিল্টারে কোনো শব্দ নেই।</div>}
    </div>
  );
}

function VD() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.vDS.find(d => d.id===st.params.did);
  const w = ds?.data.find(x => x.id===st.params.wid);
  if (!w) return <div style={{ padding:20, color:t.muted, textAlign:"center" }}><AlertCircle size={24} style={{ margin:"0 auto 8px" }} /><div>শব্দটি পাওয়া যায়নি।</div></div>;
  const isFav = st.favs.includes("vocab:"+w.id);
  const isBook = st.books.includes("vocab:"+w.id);
  const status = st.ws[w.id];
  const FS = { small:14, medium:16, large:18, xlarge:20 }[st.settings.fs||"medium"];
  const cp = txt => navigator.clipboard && navigator.clipboard.writeText(txt);
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text, fontSize:FS }}>
      <GCard style={{ textAlign:"center", padding:22, marginBottom:12, background:"linear-gradient(135deg,"+t.accent+"15,"+t.gold+"0a)" }}>
        <div style={{ fontSize:66, fontWeight:900, color:t.text, marginBottom:6 }}>{w.character}</div>
        <div style={{ fontSize:20, color:t.accentL, marginBottom:6 }}>{w.pinyin}</div>
        <div style={{ fontSize:17, color:t.text, marginBottom:4 }}>🇧🇩 {w.banglaMeaning}</div>
        <div style={{ fontSize:15, color:t.muted, marginBottom:12 }}>🇬🇧 {w.englishMeaning}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          <Badge label={w.category} color="accent" />
          {w.subtopic && <Badge label={w.subtopic} color="muted" />}
          <SBadge status={status} />
        </div>
      </GCard>

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <Btn sz="sm" v={isFav?"gold":"secondary"} icon={<Heart size={13}/>} onClick={() => dp({ t:"FAV", k:"vocab", id:w.id })}>{isFav?"সংরক্ষিত":"পছন্দ"}</Btn>
        <Btn sz="sm" v={isBook?"gold":"secondary"} icon={<Bookmark size={13}/>} onClick={() => dp({ t:"BOOK", k:"vocab", id:w.id })}>{isBook?"বুকমার্কড":"বুকমার্ক"}</Btn>
        <Btn sz="sm" v="ghost" icon={<Copy size={13}/>} onClick={() => cp(w.character)}>হান্জি</Btn>
        <Btn sz="sm" v="ghost" icon={<Copy size={13}/>} onClick={() => cp(w.pinyin)}>Pinyin</Btn>
      </div>

      <GCard style={{ marginBottom:12 }}>
        <div style={{ fontWeight:700, marginBottom:10, color:t.text }}>📊 শব্দের অবস্থা</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[["known","🟢 জানি",t.green],["learning","🟡 শিখছি",t.gold],["difficult","🔴 কঠিন",t.red]].map(([s,l,c]) => (
            <button key={s} onClick={() => dp({ t:"WS", id:w.id, s })}
              style={{ padding:"8px 14px", borderRadius:10, border:"2px solid "+(status===s?c:t.border), background:status===s?c+"22":"transparent", cursor:"pointer", color:status===s?c:t.muted, fontWeight:status===s?700:500, fontSize:13, transition:"all 0.2s" }}>
              {l}
            </button>
          ))}
        </div>
      </GCard>

      <GCard style={{ marginBottom:12 }}>
        <div style={{ fontWeight:700, marginBottom:8, color:t.text }}>📋 মূল তথ্য</div>
        {[["অক্ষর",w.character],["উচ্চারণ",w.pinyin],["বাংলা",w.banglaMeaning],["ইংরেজি",w.englishMeaning],["শ্রেণী",w.category],["উপবিভাগ",w.subtopic]].filter(([,v])=>v).map(([k,v]) => (
          <div key={k} style={{ display:"flex", gap:10, marginBottom:5, borderBottom:"1px solid "+t.border, paddingBottom:5 }}>
            <span style={{ color:t.muted, fontSize:12, minWidth:75 }}>{k}</span>
            <span style={{ color:t.text, fontSize:13, flex:1 }}>{v}</span>
          </div>
        ))}
      </GCard>

      {w.etymology && (
        <GCard style={{ marginBottom:12, borderLeft:"3px solid "+t.accent }}>
          <div style={{ fontWeight:700, marginBottom:8, color:t.accent }}>🔍 ব্যুৎপত্তি</div>
          <div style={{ fontSize:13, color:t.text, whiteSpace:"pre-wrap", lineHeight:1.8 }}>{w.etymology}</div>
        </GCard>
      )}

      {w.mnemonic && (
        <GCard style={{ marginBottom:12, borderLeft:"3px solid "+t.gold, background:t.gold+"07" }}>
          <div style={{ fontWeight:700, marginBottom:8, color:t.gold }}>🧠 স্মৃতিসহায়ক কৌশল</div>
          <div style={{ fontSize:13, color:t.text, whiteSpace:"pre-wrap", lineHeight:1.8 }}>{w.mnemonic}</div>
        </GCard>
      )}

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Btn v="primary" icon={<CreditCard size={14}/>}
          onClick={() => dp({ t:"GO", p:"fcs", ps:{ words:[{...w,did:st.params.did}], name:w.character, idx:0 } })}>
          ফ্লাশকার্ড
        </Btn>
        <Btn v="secondary" icon={<MessageSquare size={14}/>} onClick={() => dp({ t:"GO", p:"seh" })}>বাক্য দেখুন</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SENTENCE LEARNING
// ─────────────────────────────────────────────
function SeH() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      {st.cont.s && (
        <GCard style={{ marginBottom:14, background:t.gold+"0f", borderColor:t.gold+"33", cursor:"pointer" }}
          onClick={() => dp({ t:"GO", p:"ser", ps:st.cont.s })}>
          <div style={{ fontSize:11, color:t.gold, marginBottom:4 }}>▶ চালিয়ে যান</div>
          <div style={{ fontWeight:700, color:t.text }}>{st.cont.s.word}</div>
          <PBar value={st.cont.s.prog||0} color={t.gold} />
        </GCard>
      )}
      {st.sDS.map(d => (
        <GCard key={d.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"ses", ps:{ did:d.id } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:t.gold+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <MessageSquare size={20} color={t.gold} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
              <div style={{ fontSize:11, color:t.muted }}>{d.data.length} টি শব্দ</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function SeS() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.sDS.find(d => d.id===st.params.did);
  if (!ds) return null;
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text }}>{ds.name}</div>
        <div style={{ fontSize:12, color:t.muted }}>{ds.data.length} টি শব্দ</div>
      </GCard>
      {ds.data.map(we => (
        <GCard key={we.id} style={{ marginBottom:8, cursor:"pointer" }}
          onClick={() => { dp({ t:"CONT", k:"s", d:{ did:ds.id, wid:we.id, word:we.word, prog:0 } }); dp({ t:"GO", p:"ser", ps:{ did:ds.id, wid:we.id } }); }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:24, fontWeight:800, color:t.text, minWidth:50, textAlign:"center" }}>{we.word}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, color:t.text, fontSize:13 }}>{we.word}</div>
              <div style={{ fontSize:12, color:t.muted }}>{we.sentences?.length||0} টি বাক্য</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function SeR() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.sDS.find(d => d.id===st.params.did);
  const we = ds?.data.find(w => w.id===st.params.wid);
  const [cs, setCS] = useState({});
  const allV = st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id })));
  const FS = { small:15, medium:17, large:21, xlarge:25 }[st.settings.fs||"medium"];
  const toggle = (id, f) => setCS(p => ({ ...p, [id]:{ ...p[id], [f]:!p[id]?.[f] } }));
  const onClick = txt => {
    const f = allV.find(v => v.character===txt);
    dp({ t:"POPUP", v: f ? { ...f, did:f.did } : { character:txt, pinyin:"", banglaMeaning:"Vocabulary-এ নেই।", englishMeaning:"Not in vocabulary.", id:null } });
  };
  if (!we) return <div style={{ padding:20, color:t.muted, textAlign:"center" }}>ডেটা পাওয়া যায়নি।</div>;
  return (
    <div className="fi" style={{ paddingBottom:80, color:t.text }}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:t.gold+"0a", borderBottom:"1px solid "+t.border }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:t.text }}>{we.word}</div>
          <div style={{ fontSize:11, color:t.muted }}>{we.sentences?.length} টি বাক্য</div>
        </div>
        <Btn sz="sm" v="ghost" icon={st.focus?<EyeOff size={12}/>:<Eye size={12}/>} onClick={() => dp({ t:"FOCUS", v:!st.focus })}>{st.focus?"সাধারণ":"ফোকাস"}</Btn>
      </div>
      <div style={{ padding:"12px 16px" }}>
        {(we.sentences||[]).map((s, i) => {
          const id = s.id||i; const c = cs[id]||{};
          const toks = tokenize(s.hanzi, allV);
          return (
            <GCard key={id} style={{ marginBottom:12 }}>
              <div style={{ marginBottom:8, fontSize:FS, lineHeight:1.9, fontWeight:500 }}>
                {toks.map((tok, ti) => {
                  if (!tok.isW) return <span key={ti} style={{ color:t.muted }}>{tok.text}</span>;
                  if (c.pin) {
                    const voc = allV.find(v => v.character===tok.text);
                    return <ruby key={ti} className="htok" onClick={() => onClick(tok.text)}>{tok.text}<rt>{voc?.pinyin||""}</rt></ruby>;
                  }
                  return <span key={ti} className="htok" onClick={() => onClick(tok.text)} style={{ color:t.text }}>{tok.text}</span>;
                })}
              </div>
              {c.mean && (
                <div style={{ marginBottom:8, padding:"8px 10px", background:t.surface, borderRadius:10, borderLeft:"3px solid "+t.accent }}>
                  <div style={{ fontSize:13, color:t.text, marginBottom:3 }}>🇧🇩 {s.banglaMeaning}</div>
                  <div style={{ fontSize:12, color:t.muted }}>🇬🇧 {s.englishMeaning}</div>
                </div>
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Btn sz="sm" v={c.pin?"primary":"ghost"} onClick={() => toggle(id,"pin")}>{c.pin?"Pinyin লুকান":"Pinyin দেখান"}</Btn>
                <Btn sz="sm" v={c.mean?"primary":"ghost"} onClick={() => toggle(id,"mean")}>{c.mean?"অর্থ লুকান":"অর্থ দেখান"}</Btn>
                <Btn sz="sm" v="ghost" icon={<Heart size={12}/>} onClick={() => dp({ t:"FAV", k:"sent", id })} />
              </div>
            </GCard>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STORY LEARNING
// ─────────────────────────────────────────────
function StH() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      {st.cont.st && (
        <GCard style={{ marginBottom:14, background:t.green+"0f", borderColor:t.green+"33", cursor:"pointer" }}
          onClick={() => dp({ t:"GO", p:"str", ps:st.cont.st })}>
          <div style={{ fontSize:11, color:t.green, marginBottom:4 }}>▶ চালিয়ে যান</div>
          <div style={{ fontWeight:700, color:t.text }}>{st.cont.st.title}</div>
          <PBar value={st.cont.st.prog||0} color={t.green} />
        </GCard>
      )}
      {st.stDS.map(d => (
        <GCard key={d.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"sts", ps:{ did:d.id } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:t.green+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <FileText size={20} color={t.green} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:t.text }}>{d.name}</div>
              <div style={{ fontSize:11, color:t.muted }}>{d.data.length} টি গল্প</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function StS() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.stDS.find(d => d.id===st.params.did);
  if (!ds) return null;
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text }}>{ds.name}</div>
        <div style={{ fontSize:12, color:t.muted }}>{ds.data.length} টি গল্প • {fmtD(ds.importDate)}</div>
      </GCard>
      {ds.data.map(story => (
        <GCard key={story.id} style={{ marginBottom:10, cursor:"pointer" }}
          onClick={() => {
            dp({ t:"CONT", k:"st", d:{ did:ds.id, sid:story.id, title:story.title, prog:0 } });
            dp({ t:"RECENT", d:{ id:story.id, icon:"📖", title:story.title, sub:ds.name } });
            dp({ t:"LOG" });
            dp({ t:"GO", p:"str", ps:{ did:ds.id, sid:story.id } });
          }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:t.green+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:t.text, fontSize:14 }}>{story.title}</div>
              <div style={{ fontSize:12, color:t.muted }}>{story.category||"সাধারণ"} • {story.story?.paragraphs?.length||0} অনুচ্ছেদ</div>
            </div>
            {st.favs.includes("story:"+story.id) && <span style={{ color:t.gold }}>♥</span>}
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function StR() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const ds = st.stDS.find(d => d.id===st.params.did);
  const story = ds?.data.find(s => s.id===st.params.sid);
  const [showPin, setShowPin] = useState(false);
  const [showMean, setShowMean] = useState(false);
  const allV = st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id })));
  if (!story) return <div style={{ padding:20, color:t.muted, textAlign:"center" }}>গল্পটি পাওয়া যায়নি।</div>;
  const isFav = st.favs.includes("story:"+story.id);
  const FS = { small:16, medium:19, large:23, xlarge:27 }[st.settings.fs||"medium"];
  const LH = { compact:1.7, normal:2.1, comfortable:2.4, extra:2.8 }[st.settings.lh||"normal"];
  const maxW = { compact:480, medium:660, wide:"100%" }[st.settings.rw||"medium"];
  const onClick = txt => {
    const f = allV.find(v => v.character===txt);
    dp({ t:"POPUP", v: f ? { ...f, did:f.did } : { character:txt, pinyin:"", banglaMeaning:"Vocabulary-এ নেই।", englishMeaning:"Not in vocabulary.", id:null } });
  };
  return (
    <div className="fi" style={{ paddingBottom:80, color:t.text }}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid "+t.border, background:t.green+"08" }}>
        <div style={{ fontWeight:800, fontSize:15, color:t.text, marginBottom:8 }}>{story.title}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn sz="sm" v={showPin?"primary":"ghost"} onClick={() => setShowPin(!showPin)}>{showPin?"Pinyin লুকান":"Pinyin দেখান"}</Btn>
          <Btn sz="sm" v={showMean?"primary":"ghost"} onClick={() => setShowMean(!showMean)}>{showMean?"অর্থ লুকান":"অর্থ দেখান"}</Btn>
          <Btn sz="sm" v={isFav?"gold":"ghost"} icon={<Heart size={12}/>} onClick={() => dp({ t:"FAV", k:"story", id:story.id })} />
          <Btn sz="sm" v={st.focus?"primary":"ghost"} icon={<Eye size={12}/>} onClick={() => dp({ t:"FOCUS", v:!st.focus })}>{st.focus?"সাধারণ":"ফোকাস"}</Btn>
        </div>
      </div>
      <div style={{ padding:"16px", maxWidth:maxW, margin:"0 auto" }}>
        {story.story?.paragraphs?.map((para, i) => (
          <div key={i} style={{ marginBottom:28 }}>
            <div style={{ fontSize:FS, lineHeight:LH, marginBottom:showMean?8:0, fontWeight:500 }}>
              {tokenize(para.hanzi, allV).map((tok, ti) => {
                if (!tok.isW) return <span key={ti} style={{ color:t.muted, fontSize:FS }}>{tok.text}</span>;
                if (showPin) {
                  const voc = allV.find(v => v.character===tok.text);
                  return <ruby key={ti} className="htok" onClick={() => onClick(tok.text)} style={{ fontSize:FS }}>{tok.text}<rt style={{ fontSize:FS*0.55+"px" }}>{voc?.pinyin||""}</rt></ruby>;
                }
                return <span key={ti} className="htok" onClick={() => onClick(tok.text)} style={{ color:t.text, fontSize:FS }}>{tok.text}</span>;
              })}
            </div>
            {showMean && (
              <div style={{ padding:"8px 12px", background:t.surface, borderRadius:10, borderLeft:"3px solid "+t.green }}>
                <div style={{ fontSize:14, color:t.text, marginBottom:3 }}>🇧🇩 {para.banglaMeaning}</div>
                <div style={{ fontSize:13, color:t.muted }}>🇬🇧 {para.englishMeaning}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FLASHCARDS
// ─────────────────────────────────────────────
function FcH() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const allV = st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id })));
  const go = (words, name) => {
    if (!words.length) { alert("এই ডেকে কোনো শব্দ নেই।"); return; }
    dp({ t:"GO", p:"fcs", ps:{ words, name, idx:0 } });
  };
  const DECKS = [
    { n:"সব শব্দ 📚", w:allV, c:t.accent },
    { n:"শিখছি 🟡", w:allV.filter(w=>st.ws[w.id]==="learning"), c:t.gold },
    { n:"কঠিন 🔴", w:allV.filter(w=>st.ws[w.id]==="difficult"), c:t.red },
    { n:"জানি ✅", w:allV.filter(w=>st.ws[w.id]==="known"), c:t.green },
    { n:"পছন্দের ❤️", w:allV.filter(w=>st.favs.includes("vocab:"+w.id)), c:t.gold }
  ];
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      {st.cont.fc && (
        <GCard style={{ marginBottom:14, cursor:"pointer", background:t.accent+"0f", borderColor:t.accent+"33" }}
          onClick={() => dp({ t:"GO", p:"fcs", ps:st.cont.fc })}>
          <div style={{ fontSize:11, color:t.accentL, marginBottom:4 }}>▶ শেষ সেশন চালিয়ে যান</div>
          <div style={{ fontWeight:700, color:t.text }}>{st.cont.fc.name||"ফ্লাশকার্ড"}</div>
          <div style={{ fontSize:11, color:t.muted }}>কার্ড {(st.cont.fc.idx||0)+1} থেকে শুরু</div>
        </GCard>
      )}
      <div style={{ fontSize:12, fontWeight:700, color:t.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.05em" }}>ডেক নির্বাচন করুন</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {DECKS.map(d => (
          <GCard key={d.n} onClick={() => go(d.w, d.n)} style={{ cursor:"pointer", textAlign:"center", padding:16 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🎴</div>
            <div style={{ fontWeight:700, fontSize:13, color:t.text, marginBottom:4 }}>{d.n}</div>
            <div style={{ fontSize:11, color:t.muted }}>{d.w.length} কার্ড</div>
          </GCard>
        ))}
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:t.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.05em" }}>বিভাগ অনুযায়ী</div>
      {st.vDS.map(d => (
        <GCard key={d.id} style={{ marginBottom:8, cursor:"pointer" }}
          onClick={() => go(d.data.map(w=>({...w,did:d.id})), d.name)}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:20 }}>📚</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:t.text, fontSize:13 }}>{d.name}</div>
              <div style={{ fontSize:11, color:t.muted }}>{d.data.length} কার্ড</div>
            </div>
            <ChevronRight size={15} color={t.muted} />
          </div>
        </GCard>
      ))}
    </div>
  );
}

function FcS() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [words, setWords] = useState(() => st.params.words || []);
  const [idx, setIdx] = useState(st.params.idx || 0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const w = words[idx];
  const isFav = w && st.favs.includes("vocab:"+w.id);
  const status = w && st.ws[w.id];
  const save = useCallback(ni => dp({ t:"CONT", k:"fc", d:{ ...st.params, words, idx:ni } }), [words, st.params, dp]);
  const next = () => { if(idx>=words.length-1){setDone(true);return;} const ni=idx+1; setIdx(ni); setFlipped(false); save(ni); dp({ t:"LOG" }); };
  const prev = () => { if(idx>0){const ni=idx-1; setIdx(ni); setFlipped(false); save(ni);} };
  const shuffle = () => { setWords([...words].sort(()=>Math.random()-0.5)); setIdx(0); setFlipped(false); };
  if (!w) return <div style={{ padding:20, color:t.muted, textAlign:"center" }}>কোনো কার্ড নেই।</div>;
  if (done) return (
    <div className="fi" style={{ padding:32, paddingBottom:80, textAlign:"center", color:t.text }}>
      <div style={{ fontSize:60, marginBottom:14 }}>🎉</div>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>অভিনন্দন!</div>
      <div style={{ color:t.muted, marginBottom:24 }}>{words.length} টি কার্ড সম্পন্ন</div>
      <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
        <Btn v="primary" icon={<RotateCcw size={14}/>} onClick={() => { setIdx(0); setFlipped(false); setDone(false); }}>আবার শুরু</Btn>
        <Btn v="secondary" icon={<Shuffle size={14}/>} onClick={() => { shuffle(); setDone(false); }}>শাফল</Btn>
        <Btn v="ghost" onClick={() => dp({ t:"BACK" })}>ফিরে যান</Btn>
      </div>
    </div>
  );
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:13, color:t.muted, fontWeight:600 }}>{st.params.name}</div>
        <div style={{ fontSize:13, color:t.accentL, fontWeight:700 }}>{idx+1} / {words.length}</div>
      </div>
      <PBar value={idx+1} max={words.length} />
      <div style={{ marginTop:14, marginBottom:14 }}>
        <div className="fcard" style={{ height:280, position:"relative" }} onClick={() => setFlipped(!flipped)}>
          <div className={"fi2"+(flipped?" flip":"")} style={{ width:"100%", height:"100%", position:"relative" }}>
            <div className="ff glass" style={{ background:"linear-gradient(135deg,"+t.accent+"18,"+t.gold+"0a)" }}>
              <div style={{ fontSize:74, fontWeight:900, color:t.text, marginBottom:10, textAlign:"center" }}>{w.character}</div>
              <div style={{ fontSize:13, color:t.muted }}>ট্যাপ করুন উল্টাতে 🔄</div>
            </div>
            <div className="fb glass" style={{ background:"linear-gradient(135deg,"+t.gold+"10,"+t.accent+"0a)" }}>
              <div style={{ fontSize:38, fontWeight:800, color:t.text, marginBottom:4 }}>{w.character}</div>
              <div style={{ fontSize:18, color:t.accentL, marginBottom:8 }}>{w.pinyin}</div>
              <div style={{ fontSize:15, color:t.text, marginBottom:4 }}>🇧🇩 {w.banglaMeaning}</div>
              <div style={{ fontSize:13, color:t.muted, marginBottom:12 }}>🇬🇧 {w.englishMeaning}</div>
              <SBadge status={status} />
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                {[["difficult","🔴",t.red],["learning","🟡",t.gold],["known","🟢",t.green]].map(([s,l,c]) => (
                  <button key={s} onClick={e => { e.stopPropagation(); dp({ t:"WS", id:w.id, s }); }}
                    style={{ padding:"6px 11px", borderRadius:9, border:"1px solid "+c+"44", background:status===s?c+"22":"transparent", color:c, cursor:"pointer", fontSize:12, fontWeight:600 }}>
                    {l} {s==="known"?"জানি":s==="learning"?"শিখছি":"কঠিন"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:10 }}>
        <Btn v="ghost" icon={<SkipBack size={15}/>} onClick={prev} disabled={idx===0} />
        <Btn v="ghost" icon={<RotateCcw size={14}/>} onClick={() => setFlipped(!flipped)}>উল্টান</Btn>
        <Btn v="ghost" icon={<Shuffle size={14}/>} onClick={shuffle}>শাফল</Btn>
        <Btn v="ghost" icon={<Heart size={14} fill={isFav?t.gold:"none"} color={isFav?t.gold:t.muted}/>}
          onClick={() => w.id && dp({ t:"FAV", k:"vocab", id:w.id })} />
        <Btn v={flipped?"primary":"secondary"} icon={<SkipForward size={15}/>} onClick={next}>পরবর্তী</Btn>
      </div>
      {flipped && w.did && (
        <div style={{ textAlign:"center" }}>
          <Btn sz="sm" v="ghost" onClick={() => dp({ t:"GO", p:"vd", ps:{ wid:w.id, did:w.did } })}>বিস্তারিত দেখুন →</Btn>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────────
function Rev() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const allV = st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id })));
  const lists = [
    { l:"🟡 শিখছি", w:allV.filter(x=>st.ws[x.id]==="learning"), c:t.gold },
    { l:"🔴 কঠিন", w:allV.filter(x=>st.ws[x.id]==="difficult"), c:t.red },
    { l:"❤️ পছন্দের", w:allV.filter(x=>st.favs.includes("vocab:"+x.id)), c:t.gold },
    { l:"🔖 বুকমার্ক", w:allV.filter(x=>st.books.includes("vocab:"+x.id)), c:t.accentL },
    { l:"📝 নতুন (20)", w:allV.filter(x=>!st.ws[x.id]).slice(0,20), c:t.muted }
  ].filter(l => l.w.length > 0);
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:14, background:t.accent+"0f" }}>
        <div style={{ fontWeight:700, color:t.accent, fontSize:15 }}>📋 পর্যালোচনা তালিকা</div>
        <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>শেখার অবস্থা অনুযায়ী স্বয়ংক্রিয় তালিকা</div>
      </GCard>
      {lists.map(l => (
        <GCard key={l.l} style={{ marginBottom:10, cursor:"pointer" }}
          onClick={() => dp({ t:"GO", p:"fcs", ps:{ words:l.w, name:l.l, idx:0 } })}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:l.c+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎴</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:t.text, fontSize:14 }}>{l.l}</div>
              <div style={{ fontSize:12, color:t.muted }}>{l.w.length} টি শব্দ</div>
            </div>
            <Btn sz="sm" v="primary" icon={<Play size={12}/>}>শুরু</Btn>
          </div>
        </GCard>
      ))}
      {lists.length===0 && (
        <div style={{ textAlign:"center", padding:40, color:t.muted }}>
          <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
          <div>কোনো পর্যালোচনা তালিকা নেই</div>
          <div style={{ fontSize:12, marginTop:4 }}>শব্দের অবস্থা নির্ধারণ করলে এখানে দেখাবে</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// FAVORITES
// ─────────────────────────────────────────────
function Favs() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [tab, setTab] = useState("vocab");
  const allV = st.vDS.flatMap(d => d.data.map(w => ({ ...w, did:d.id })));
  const allSt = st.stDS.flatMap(d => d.data.map(s => ({ ...s, did:d.id, dsN:d.name })));
  const favV = allV.filter(w => st.favs.includes("vocab:"+w.id));
  const favSt = allSt.filter(s => st.favs.includes("story:"+s.id));
  const bookV = allV.filter(w => st.books.includes("vocab:"+w.id));
  return (
    <div className="fi" style={{ paddingBottom:80, color:t.text }}>
      <div style={{ display:"flex", borderBottom:"1px solid "+t.border }}>
        {[["vocab","❤️ শব্দ ("+favV.length+")"],["story","📖 গল্প ("+favSt.length+")"],["book","🔖 বুকমার্ক ("+bookV.length+")"]].map(([tb,l]) => (
          <button key={tb} onClick={() => setTab(tb)}
            style={{ flex:1, padding:"12px 8px", border:"none", background:"transparent", cursor:"pointer", color:tab===tb?t.accent:t.muted, fontWeight:tab===tb?700:500, fontSize:12, borderBottom:"2px solid "+(tab===tb?t.accent:"transparent"), transition:"all 0.2s" }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ padding:16 }}>
        {tab==="vocab" && (
          favV.length===0
            ? <div style={{ textAlign:"center", padding:40, color:t.muted }}><Heart size={40} color={t.border} style={{ margin:"0 auto 12px" }}/><div>কোনো পছন্দের শব্দ নেই</div></div>
            : favV.map(w => (
              <GCard key={w.id} style={{ marginBottom:8, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"vd", ps:{ wid:w.id, did:w.did } })}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ minWidth:48, textAlign:"center" }}>
                    <div style={{ fontSize:26, fontWeight:800, color:t.text }}>{w.character}</div>
                    <div style={{ fontSize:10, color:t.accentL }}>{w.pinyin}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13, color:t.text }}>{w.banglaMeaning}</div>
                    <div style={{ fontSize:12, color:t.muted }}>{w.englishMeaning}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); dp({ t:"FAV", k:"vocab", id:w.id }); }}
                    style={{ background:"none", border:"none", cursor:"pointer", color:t.red, fontSize:18 }}>♥</button>
                </div>
              </GCard>
            ))
        )}
        {tab==="story" && (
          favSt.length===0
            ? <div style={{ textAlign:"center", padding:40, color:t.muted }}><FileText size={40} color={t.border} style={{ margin:"0 auto 12px" }}/><div>কোনো পছন্দের গল্প নেই</div></div>
            : favSt.map(s => (
              <GCard key={s.id} style={{ marginBottom:8, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"str", ps:{ did:s.did, sid:s.id } })}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:20 }}>📖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:t.text, fontSize:13 }}>{s.title}</div>
                    <div style={{ fontSize:11, color:t.muted }}>{s.dsN}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); dp({ t:"FAV", k:"story", id:s.id }); }}
                    style={{ background:"none", border:"none", cursor:"pointer", color:t.red, fontSize:18 }}>♥</button>
                </div>
              </GCard>
            ))
        )}
        {tab==="book" && (
          bookV.length===0
            ? <div style={{ textAlign:"center", padding:40, color:t.muted }}><Bookmark size={40} color={t.border} style={{ margin:"0 auto 12px" }}/><div>কোনো বুকমার্ক নেই</div></div>
            : bookV.map(w => (
              <GCard key={w.id} style={{ marginBottom:8, cursor:"pointer" }} onClick={() => dp({ t:"GO", p:"vd", ps:{ wid:w.id, did:w.did } })}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ minWidth:48, textAlign:"center" }}>
                    <div style={{ fontSize:26, fontWeight:800, color:t.text }}>{w.character}</div>
                    <div style={{ fontSize:10, color:t.accentL }}>{w.pinyin}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13, color:t.text }}>{w.banglaMeaning}</div>
                    <div style={{ fontSize:12, color:t.muted }}>{w.englishMeaning}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); dp({ t:"BOOK", k:"vocab", id:w.id }); }}
                    style={{ background:"none", border:"none", cursor:"pointer", color:t.accentL, fontSize:18 }}>🔖</button>
                </div>
              </GCard>
            ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────
function Prof() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const allV = st.vDS.flatMap(d => d.data);
  const known = Object.values(st.ws).filter(s=>s==="known").length;
  const learning = Object.values(st.ws).filter(s=>s==="learning").length;
  const diff = Object.values(st.ws).filter(s=>s==="difficult").length;
  const total = Object.values(st.log).reduce((a,b)=>a+b,0);
  const td = st.log[todayStr()]||0;
  const last7 = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); const k=d.toISOString().slice(0,10); return { d:d.toLocaleDateString("bn-BD",{weekday:"short"}), v:st.log[k]||0 }; });
  const maxV = Math.max(...last7.map(d=>d.v),1);
  const lvl = known<5?"শিক্ষানবিশ":known<15?"মধ্যবর্তী":known<allV.length?"উন্নত":"মাস্টার";
  const BADGES = [
    { i:"🔥", l:"ধারাবাহিকতা", v:st.streak+" দিন", e:st.streak>=1 },
    { i:"📚", l:"প্রথম শব্দ", v:"সম্পন্ন", e:st.viewed>=1 },
    { i:"✅", l:"১০টি জানি", v:"অর্জিত", e:known>=10 },
    { i:"🏆", l:"মাস্টার", v:"সব শব্দ", e:known>=allV.length&&allV.length>0 },
    { i:"❤️", l:"সংগ্রাহক", v:"পছন্দ তালিকা", e:st.favs.length>=5 },
    { i:"🎴", l:"ফ্লাশকার্ড", v:"খেলেছেন", e:total>=10 }
  ];
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ textAlign:"center", padding:24, marginBottom:14, background:"linear-gradient(135deg,"+t.accent+"15,"+t.gold+"0a)" }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🧑‍🎓</div>
        <div style={{ fontSize:18, fontWeight:800, color:t.text, marginBottom:4 }}>চীনা শিক্ষার্থী</div>
        <div style={{ fontSize:13, color:t.muted, marginBottom:10 }}>লেভেল: {lvl}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          <Badge label={"🔥 "+st.streak+" দিন"} color="gold" />
          <Badge label={"📚 "+allV.length+" শব্দ"} color="accent" />
        </div>
      </GCard>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
        <StatCard Icon={CheckCircle} label="জানি" value={known} color={t.green} />
        <StatCard Icon={Brain} label="শিখছি" value={learning} color={t.gold} />
        <StatCard Icon={Zap} label="কঠিন" value={diff} color={t.red} />
        <StatCard Icon={Flame} label="স্ট্রিক" value={st.streak+"🔥"} color={t.gold} />
        <StatCard Icon={Target} label="আজ" value={td} color={t.accent} />
        <StatCard Icon={Heart} label="পছন্দ" value={st.favs.filter(f=>f.startsWith("vocab:")).length} color={t.red} />
      </div>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12 }}>📈 শেষ ৭ দিনের অগ্রগতি</div>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80 }}>
          {last7.map((d,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", background:d.v>0?t.accent:t.border, borderRadius:6, height:((d.v/maxV)*58+4)+"px", minHeight:4, transition:"height 0.4s" }} />
              <div style={{ fontSize:9, color:t.muted }}>{d.d}</div>
              {d.v>0 && <div style={{ fontSize:9, color:t.accentL, fontWeight:700 }}>{d.v}</div>}
            </div>
          ))}
        </div>
      </GCard>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12 }}>🏆 অর্জনসমূহ</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {BADGES.map(b => (
            <div key={b.l} style={{ textAlign:"center", padding:"10px 6px", borderRadius:10, background:b.e?t.gold+"18":t.surface, border:"1px solid "+(b.e?t.gold:t.border), opacity:b.e?1:0.45 }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{b.i}</div>
              <div style={{ fontSize:10, fontWeight:700, color:b.e?t.gold:t.muted }}>{b.l}</div>
              <div style={{ fontSize:9, color:t.muted, marginTop:2 }}>{b.e?b.v:"লক"}</div>
            </div>
          ))}
        </div>
      </GCard>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Btn v="secondary" icon={<BarChart2 size={14}/>} onClick={() => dp({ t:"GO", p:"stats" })}>পরিসংখ্যান</Btn>
        <Btn v="secondary" icon={<CreditCard size={14}/>} onClick={() => dp({ t:"GO", p:"fch" })}>ফ্লাশকার্ড</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
function Stats() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const allV = st.vDS.flatMap(d => d.data);
  const known = Object.values(st.ws).filter(s=>s==="known").length;
  const learning = Object.values(st.ws).filter(s=>s==="learning").length;
  const diff = Object.values(st.ws).filter(s=>s==="difficult").length;
  const unl = allV.length - known - learning - diff;
  const days = Object.keys(st.log).length;
  const total = Object.values(st.log).reduce((a,b)=>a+b,0);
  const avg = days>0?Math.round(total/days):0;
  const pct = v => allV.length>0?Math.round((v/allV.length)*100):0;
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <StatCard Icon={BookOpen} label="মোট শব্দ" value={allV.length} color={t.accent} />
        <StatCard Icon={CheckCircle} label="জানি" value={known} color={t.green} sub={pct(known)+"%"} />
        <StatCard Icon={Brain} label="শিখছি" value={learning} color={t.gold} sub={pct(learning)+"%"} />
        <StatCard Icon={Zap} label="কঠিন" value={diff} color={t.red} sub={pct(diff)+"%"} />
        <StatCard Icon={Flame} label="স্ট্রিক" value={st.streak+"🔥"} color={t.gold} />
        <StatCard Icon={TrendingUp} label="মোট সেশন" value={total} color={t.accentL} />
        <StatCard Icon={Clock} label="গড় দৈনিক" value={avg} color={t.green} />
        <StatCard Icon={Target} label="পছন্দ" value={st.favs.length} color={t.red} />
      </div>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12 }}>📊 শব্দের অবস্থা বিতরণ</div>
        {[["✅ জানি",known,t.green],["🟡 শিখছি",learning,t.gold],["🔴 কঠিন",diff,t.red],["📝 নতুন",unl,t.muted]].map(([l,v,c]) => (
          <div key={l} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:13, color:t.text }}>{l}</span>
              <span style={{ fontSize:12, color:c, fontWeight:700 }}>{v} ({pct(v)}%)</span>
            </div>
            <PBar value={v} max={allV.length||1} color={c} />
          </div>
        ))}
      </GCard>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12 }}>📅 দৈনিক লক্ষ্য পরিবর্তন</div>
        <div style={{ fontSize:13, color:t.muted, marginBottom:10 }}>বর্তমান: <strong style={{ color:t.accent }}>{st.goal}</strong> টি</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[5,10,20,30,50].map(g => (
            <button key={g} onClick={() => dp({ t:"GOAL", v:g })}
              style={{ padding:"8px 14px", borderRadius:9, border:"2px solid "+(st.goal===g?t.accent:t.border), background:st.goal===g?t.accent+"22":"transparent", cursor:"pointer", color:st.goal===g?t.accent:t.muted, fontWeight:st.goal===g?700:500, fontSize:13 }}>
              {g}
            </button>
          ))}
        </div>
      </GCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────
function Admin() {
  const { st, dp } = useApp(); const t = TH[st.theme];
  const [tab, setTab] = useState("datasets");
  const [jsonTxt, setJsonTxt] = useState("");
  const [dsName, setDsName] = useState("");
  const [dsType, setDsType] = useState("vocabulary");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const allDS = [
    ...st.vDS.map(d => ({ ...d, icon:"📚", label:d.data.length+" শব্দ" })),
    ...st.sDS.map(d => ({ ...d, icon:"💬", label:d.data.length+" শব্দ সেট" })),
    ...st.stDS.map(d => ({ ...d, icon:"📖", label:d.data.length+" গল্প" }))
  ];

  const doImport = () => {
    if (!jsonTxt.trim()) { setMsg("❌ JSON খালি আছে।"); return; }
    if (!dsName.trim()) { setMsg("❌ ডেটাসেটের নাম দিন।"); return; }
    setLoading(true);
    try {
      const raw = JSON.parse(jsonTxt);
      const arr = Array.isArray(raw) ? raw : (raw.data || raw.words || raw.sentences || raw.stories || []);
      if (!arr.length) { setMsg("❌ ডেটা অ্যারে পাওয়া যায়নি।"); setLoading(false); return; }
      const ds = {
        id: "ds_"+Date.now(), name:dsName, type:dsType,
        importDate: new Date().toISOString(),
        data: arr.map((item,i) => ({
          id: item.id || "a"+i,
          character: item.character||item.hanzi||item.word||"",
          pinyin: item.pinyin||"", banglaMeaning: item.banglaMeaning||item.bangla||"",
          englishMeaning: item.englishMeaning||item.english||"",
          category: item.category||"সাধারণ", subtopic: item.subtopic||"",
          etymology: item.etymology||"", mnemonic: item.mnemonic||"",
          ...(dsType==="sentence" ? { sentences:item.sentences||[] } : {}),
          ...(dsType==="story" ? { title:item.title||"", story:item.story||{ paragraphs:[] } } : {})
        }))
      };
      dp({ t:"IMPORT", ds });
      setMsg("✅ সফলভাবে আমদানি! "+ds.data.length+" টি আইটেম।");
      setJsonTxt(""); setDsName("");
    } catch(e) { setMsg("❌ JSON Error: "+e.message); }
    setLoading(false);
  };

  const readFile = e => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ev => { setJsonTxt(ev.target.result); if(!dsName) setDsName(file.name.replace(".json","")); };
    r.readAsText(file);
  };

  const SAMPLE_FMT = {
    vocabulary: '[{\n  "character": "你好",\n  "pinyin": "nǐhǎo",\n  "banglaMeaning": "হ্যালো",\n  "englishMeaning": "Hello",\n  "category": "অভিবাদন",\n  "subtopic": "সাধারণ",\n  "etymology": "ব্যাখ্যা...",\n  "mnemonic": "মনে রাখার কৌশল..."\n}]',
    sentence: '[{\n  "word": "你好",\n  "category": "অভিবাদন",\n  "sentences": [{\n    "hanzi": "你好，我是学生。",\n    "pinyin": "Nǐ hǎo, wǒ shì xuéshēng.",\n    "banglaMeaning": "হ্যালো, আমি ছাত্র।",\n    "englishMeaning": "Hello, I am a student."\n  }]\n}]',
    story: '[{\n  "title": "আমার পরিবার",\n  "category": "পরিবার",\n  "story": {\n    "paragraphs": [{\n      "hanzi": "我有一个家庭。",\n      "pinyin": "Wǒ yǒu yī gè jiātíng.",\n      "banglaMeaning": "আমার একটি পরিবার আছে।",\n      "englishMeaning": "I have a family."\n    }]\n  }\n}]'
  };

  return (
    <div className="fi" style={{ paddingBottom:80, color:t.text }}>
      <div style={{ padding:"12px 16px", background:t.accent+"0f", borderBottom:"1px solid "+t.border }}>
        <div style={{ fontWeight:800, color:t.accent, fontSize:15 }}>🗄️ অ্যাডমিন ড্যাশবোর্ড</div>
        <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>ডেটাসেট ম্যানেজ ও JSON আমদানি</div>
      </div>
      <div style={{ display:"flex", borderBottom:"1px solid "+t.border }}>
        {[["datasets","📂 ডেটাসেট"],["import","📤 আমদানি"],["fmt","📋 ফরম্যাট"]].map(([tb,l]) => (
          <button key={tb} onClick={() => setTab(tb)}
            style={{ flex:1, padding:"10px 6px", border:"none", background:"transparent", cursor:"pointer", color:tab===tb?t.accent:t.muted, fontWeight:tab===tb?700:500, fontSize:11, borderBottom:"2px solid "+(tab===tb?t.accent:"transparent"), transition:"all 0.2s" }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ padding:16 }}>
        {tab==="datasets" && (
          <div>
            <div style={{ fontSize:12, color:t.muted, marginBottom:12 }}>মোট: {allDS.length} টি ডেটাসেট</div>
            {allDS.map(d => (
              <GCard key={d.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{d.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:t.text, fontSize:13 }}>{d.name}</div>
                    <div style={{ fontSize:11, color:t.muted }}>{d.label} • {fmtD(d.importDate)}</div>
                    <Badge label={d.type==="vocabulary"?"শব্দভান্ডার":d.type==="sentence"?"বাক্য":"গল্প"} color="accent" />
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn sz="sm" v="ghost" icon={<Eye size={12}/>}
                      onClick={() => dp({ t:"GO", p:d.type==="vocabulary"?"vs":d.type==="sentence"?"ses":"sts", ps:{ did:d.id } })} />
                    {!["hsk1-vocab","hsk1-sentences","hsk1-stories"].includes(d.id) && (
                      <Btn sz="sm" v="danger" icon={<Trash2 size={12}/>}
                        onClick={() => { if(window.confirm(d.name+" মুছে দেবেন?")) dp({ t:"DEL", id:d.id, type:d.type }); }} />
                    )}
                  </div>
                </div>
              </GCard>
            ))}
          </div>
        )}
        {tab==="import" && (
          <GCard style={{ background:t.gold+"0a" }}>
            <div style={{ fontWeight:700, color:t.gold, marginBottom:14 }}>📤 JSON ফাইল আমদানি</div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, color:t.muted, marginBottom:6 }}>ডেটা ধরন:</div>
              <div style={{ display:"flex", gap:8 }}>
                {[["vocabulary","📚 শব্দ"],["sentence","💬 বাক্য"],["story","📖 গল্প"]].map(([v,l]) => (
                  <button key={v} onClick={() => setDsType(v)}
                    style={{ padding:"8px 12px", borderRadius:9, border:"2px solid "+(dsType===v?t.accent:t.border), background:dsType===v?t.accent+"22":"transparent", cursor:"pointer", color:dsType===v?t.accent:t.muted, fontWeight:dsType===v?700:500, fontSize:12 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, color:t.muted, marginBottom:4 }}>ডেটাসেটের নাম:</div>
              <input value={dsName} onChange={e=>setDsName(e.target.value)} placeholder="যেমন: HSK 2 শব্দভান্ডার"
                style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid "+t.border, background:t.input, color:t.text, fontSize:13 }} />
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, color:t.muted, marginBottom:6 }}>ফাইল আপলোড:</div>
              <label style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:10, border:"2px dashed "+t.border, cursor:"pointer", color:t.muted, fontSize:13 }}>
                <Upload size={16} /> JSON ফাইল বেছে নিন
                <input type="file" accept=".json" onChange={readFile} style={{ display:"none" }} />
              </label>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, color:t.muted, marginBottom:4 }}>অথবা JSON পেস্ট করুন:</div>
              <textarea value={jsonTxt} onChange={e=>setJsonTxt(e.target.value)} rows={5}
                placeholder="[ { ... } ]"
                style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid "+t.border, background:t.input, color:t.text, fontSize:12, resize:"vertical", lineHeight:1.5 }} />
            </div>
            {msg && (
              <div style={{ padding:"8px 12px", borderRadius:8, background:msg.startsWith("✅")?t.green+"18":t.red+"18", border:"1px solid "+(msg.startsWith("✅")?t.green:t.red)+"44", color:msg.startsWith("✅")?t.green:t.red, fontSize:13, marginBottom:10 }}>
                {msg}
              </div>
            )}
            <Btn v="primary" icon={loading?<RefreshCw size={14} style={{ animation:"spin 1s linear infinite" }}/>:<Upload size={14}/>}
              onClick={doImport} disabled={loading}>
              {loading?"আমদানি হচ্ছে...":"আমদানি করুন"}
            </Btn>
          </GCard>
        )}
        {tab==="fmt" && (
          <div>
            {[["vocabulary","📚 শব্দভান্ডার"],["sentence","💬 বাক্য"],["story","📖 গল্প"]].map(([tp,l]) => (
              <GCard key={tp} style={{ marginBottom:12 }}>
                <div style={{ fontWeight:700, color:t.text, marginBottom:8 }}>{l} ফরম্যাট</div>
                <div style={{ fontSize:12, color:t.muted, fontFamily:"monospace", background:t.surface, padding:12, borderRadius:8, lineHeight:1.8, whiteSpace:"pre-wrap", overflowX:"auto" }}>
                  {SAMPLE_FMT[tp]}
                </div>
              </GCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
function Cfg() {
  const { st, dp } = useApp(); const t = TH[st.theme]; const s = st.settings;
  const Row = ({ label, desc, children }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid "+t.border }}>
      <div>
        <div style={{ fontSize:14, color:t.text, fontWeight:600 }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
  const Opts = ({ field, opts, curr }) => (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {opts.map(([v,l]) => (
        <button key={v} onClick={() => dp({ t:"SET", v:{ [field]:v } })}
          style={{ padding:"5px 10px", borderRadius:8, border:"1px solid "+(curr===v?t.accent:t.border), background:curr===v?t.accent+"22":"transparent", cursor:"pointer", color:curr===v?t.accent:t.muted, fontSize:12, fontWeight:curr===v?700:500 }}>
          {l}
        </button>
      ))}
    </div>
  );
  return (
    <div className="fi" style={{ padding:16, paddingBottom:80, color:t.text }}>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12, fontSize:15 }}>🎨 চেহারা</div>
        <Row label="থিম" desc="ডার্ক বা লাইট মোড">
          <div style={{ display:"flex", gap:8 }}>
            {[["dark","🌙 ডার্ক"],["light","☀️ লাইট"]].map(([v,l]) => (
              <button key={v} onClick={() => dp({ t:"THEME", v })}
                style={{ padding:"7px 14px", borderRadius:9, border:"2px solid "+(st.theme===v?t.accent:t.border), background:st.theme===v?t.accent+"22":"transparent", cursor:"pointer", color:st.theme===v?t.accent:t.muted, fontSize:12, fontWeight:600 }}>
                {l}
              </button>
            ))}
          </div>
        </Row>
      </GCard>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12, fontSize:15 }}>📖 পাঠ সেটিংস</div>
        <Row label="ফন্ট সাইজ" desc="হান্জি ও পাঠ্যের আকার">
          <Opts field="fs" opts={[["small","ছোট"],["medium","মাঝারি"],["large","বড়"],["xlarge","অনেক বড়"]]} curr={s.fs||"medium"} />
        </Row>
        <Row label="পড়ার প্রস্থ" desc="গল্প পাঠের কলাম প্রস্থ">
          <Opts field="rw" opts={[["compact","সংকীর্ণ"],["medium","মাঝারি"],["wide","প্রশস্ত"]]} curr={s.rw||"medium"} />
        </Row>
        <Row label="লাইন উচ্চতা" desc="পাঠ্যের মধ্যে ব্যবধান">
          <Opts field="lh" opts={[["compact","ঘন"],["normal","স্বাভাবিক"],["comfortable","আরামদায়ক"],["extra","বেশি"]]} curr={s.lh||"normal"} />
        </Row>
      </GCard>
      <GCard style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:12, fontSize:15 }}>🎯 দৈনিক লক্ষ্য</div>
        <div style={{ fontSize:13, color:t.muted, marginBottom:10 }}>বর্তমান লক্ষ্য: <strong style={{ color:t.accent }}>{st.goal}</strong> টি</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[5,10,20,30,50].map(g => (
            <button key={g} onClick={() => dp({ t:"GOAL", v:g })}
              style={{ padding:"8px 14px", borderRadius:9, border:"2px solid "+(st.goal===g?t.accent:t.border), background:st.goal===g?t.accent+"22":"transparent", cursor:"pointer", color:st.goal===g?t.accent:t.muted, fontWeight:st.goal===g?700:500, fontSize:13 }}>
              {g}
            </button>
          ))}
        </div>
      </GCard>
      <GCard>
        <div style={{ fontWeight:700, color:t.text, marginBottom:10, fontSize:15 }}>🗄️ ডেটা ব্যবস্থাপনা</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn v="secondary" icon={<Database size={13}/>} onClick={() => dp({ t:"GO", p:"admin" })}>ডেটাসেট ম্যানেজ</Btn>
          <Btn v="danger" icon={<RefreshCw size={13}/>}
            onClick={() => {
              if(window.confirm("সমস্ত অগ্রগতি রিসেট করবেন?")) {
                dp({ t:"LOAD", d:{ ws:{}, favs:[], books:[], log:{}, streak:0, recent:[], cont:{v:null,s:null,st:null,fc:null}, viewed:0 } });
              }
            }}>
            প্রগতি রিসেট
          </Btn>
        </div>
      </GCard>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
function Router() {
  const { st } = useApp(); const p = st.page;
  if (p==="home") return <Home />;
  if (p==="srch") return <SrchPage />;
  if (p==="vh") return <VH />;
  if (p==="vs") return <VS />;
  if (p==="vc") return <VC />;
  if (p==="vd") return <VD />;
  if (p==="seh") return <SeH />;
  if (p==="ses") return <SeS />;
  if (p==="ser") return <SeR />;
  if (p==="sth") return <StH />;
  if (p==="sts") return <StS />;
  if (p==="str") return <StR />;
  if (p==="fch") return <FcH />;
  if (p==="fcs") return <FcS />;
  if (p==="rev") return <Rev />;
  if (p==="favs") return <Favs />;
  if (p==="prof") return <Prof />;
  if (p==="stats") return <Stats />;
  if (p==="admin") return <Admin />;
  if (p==="cfg") return <Cfg />;
  return <Home />;
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [st, dispatch] = useReducer(red, INIT);
  const [ready, setReady] = useState(false);
  const dp = useCallback(a => dispatch(a), []);
  const t = TH[st.theme];

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("hsk-v3");
        if (raw) {
          const d = JSON.parse(raw);
          dp({ t:"LOAD", d:{
            theme: d.theme||"dark",
            vDS: d.vDS?.length ? d.vDS : [VOCAB_DS],
            sDS: d.sDS?.length ? d.sDS : [SENT_DS],
            stDS: d.stDS?.length ? d.stDS : [STORY_DS],
            favs: d.favs||[], books: d.books||[], ws: d.ws||{},
            log: d.log||{}, goal: d.goal||20, streak: d.streak||0,
            lastDay: d.lastDay||null, viewed: d.viewed||0,
            recent: d.recent||[], cont: d.cont||{v:null,s:null,st:null,fc:null},
            settings: d.settings||{ fs:"medium", rw:"medium", lh:"normal" }
          }});
        }
      } catch(_) {}
      setReady(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem("hsk-v3", JSON.stringify({
          theme:st.theme, vDS:st.vDS, sDS:st.sDS, stDS:st.stDS,
          favs:st.favs, books:st.books, ws:st.ws, log:st.log,
          goal:st.goal, streak:st.streak, lastDay:st.lastDay,
          viewed:st.viewed, recent:st.recent, cont:st.cont, settings:st.settings
        }));
      } catch(_) {}
    }, 700);
    return () => clearTimeout(timer);
  }, [st, ready]);

  if (!ready) return (
    <div style={{ minHeight:"100vh", background:TH.dark.grad, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:50, marginBottom:14 }}>📖</div>
      <div style={{ color:"#a78bfa", fontSize:16, fontWeight:700, marginBottom:6 }}>HSK Smart Learning</div>
      <div style={{ color:"#9b8db8", fontSize:13, marginBottom:14 }}>লোড হচ্ছে...</div>
      <div style={{ width:44, height:44, border:"3px solid #7c3aed33", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );

  return (
    <Ctx.Provider value={{ st, dp }}>
      <Styles theme={st.theme} />
      <div style={{ minHeight:"100vh", background:t.grad, color:t.text }}>
        <TopNav />
        <div style={{ paddingTop:56, minHeight:"100vh" }}>
          <Router />
        </div>
        <BotNav />
        <Popup />
      </div>
    </Ctx.Provider>
  );
}
