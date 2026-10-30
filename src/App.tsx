import React, { useMemo, useState } from 'react';
import seed from '../data/seed-courses.json';
import catalog from '../data/ai-catalog.json';

type Course = {course_id:string;code:string;name:string;primary_category:string;tags:string[];level:string;target_roles:string[];plain_description:string;sales_description:string;prerequisites:string;needs_programming:string;needs_python:string;needs_ml_basics:string;hours:number|null;price:number|null;course_url:string;status:string;recommended_before:string[];recommended_after:string[];faq:string[]};
type Answer = Record<number,string>;
const questions = [
 {title:'你目前最想解決哪一類工作挑戰？', options:['提升日常工作效率','讓流程自動化','用 AI 協助寫程式或開發','打造 AI 應用或產品','分析資料、訓練模型','規劃組織導入 AI','不確定']},
 {title:'你目前的工作角色最接近？', options:['行政／營運／行銷','設計／內容／簡報','PM／主管／顧問','工程師／IT','資料分析／研究','學生／轉職者','不確定']},
 {title:'你使用 AI 工具的經驗？', options:['尚未使用','偶爾使用 ChatGPT／Gemini','常用生成式 AI','用過自動化工具','用過 API／Agent','做過資料分析或機器學習','不確定']},
 {title:'你的程式基礎？', options:['沒有程式經驗','看得懂少量程式','會寫 Python 或前端','能獨立開發','不確定']},
 {title:'你希望完成什麼成果？', options:['改善個人工作流程','建立自動化流程或 Agent','完成 AI 輔助開發作品','做出 AI 應用原型','建立資料／模型分析能力','規劃企業 AI 導入','做出 AI 視覺或互動作品','不確定']},
 {title:'目前最想補強的能力？', options:['AI 工具與提示技巧','流程自動化','程式與 API','Python／機器學習','資料與雲端平台','AI 導入策略','視覺設計與前端','不確定']},
 {title:'你每週可投入多少時間？', options:['1–2 小時','3–5 小時','6–10 小時','10 小時以上','不確定']},
 {title:'你希望多久開始應用？', options:['立即使用在工作','一個月內做出成果','三個月內轉型或求職','長期建立專業','不確定']},
 {title:'你目前的主要目標？', options:['先提升工作效率','成為流程自動化推動者','轉職 AI／軟體開發','成為 AI／資料工程人才','帶領公司導入 AI','發展 AI 設計作品','探索方向','不確定']},
 {title:'你偏好的學習方式？', options:['短課快速上手','一步步做實作','完整技術訓練','先理解策略再規劃','希望有人協助評估','不確定']}
];
const trackInfo:Record<string,{name:string;desc:string;role:string}>={
 'AI-01':{name:'AI 工具應用與工作效率',desc:'從生成式 AI 與常用工具開始，先把 AI 放進真實工作任務。',role:'AI 應用者／職場效率提升'},
 'AI-02':{name:'AI 流程自動化與 Agent',desc:'把重複工作串成流程，逐步建立可維護的自動化與 Agent。',role:'AI 自動化推動者'},
 'AI-03':{name:'AI 輔助軟體開發',desc:'以 AI 編碼工具加速開發，同時建立程式協作與驗證能力。',role:'AI 輔助開發者'},
 'AI-04':{name:'AI 應用開發與 API',desc:'從 Python、API 到生成式 AI 應用，往可運作的產品原型前進。',role:'生成式 AI 應用開發者'},
 'AI-05':{name:'資料分析與機器學習',desc:'補上 Python、資料處理與模型基礎，建立資料 AI 能力。',role:'資料／機器學習人才'},
 'AI-06':{name:'企業 AI 導入與策略',desc:'從組織需求與治理出發，規劃可落地的 AI 導入路徑。',role:'企業 AI 推動者'},
 'VISUAL':{name:'AI 影像設計與前端互動',desc:'結合生成式影像、設計工具與網頁互動，做出可展示的作品。',role:'AI 視覺設計／前端互動人才'}
};
const FAQ = ['我沒有程式基礎，適合從哪裡開始？','課程時數與費用可以在哪裡確認？','推薦結果代表保證就業嗎？','可以先只學會工作上用 AI 嗎？'];
const faqAnswer = ['若程式經驗有限，可先從 AI 工具與工作效率方向建立使用習慣；技術路線再逐步補程式基礎。','本頁不推估時數、費用或先備條件；標示「待確認」的資訊請以官網最新課程頁為準。','不代表就業保證。結果是依你的回答與可用課程資料產生的學習方向參考。','可以。AI 工具應用方向以日常任務為起點，無需先把目標設定為工程職涯。'];
const allCourses:Course[] = seed.courses as Course[];
const selectable = allCourses.filter(c=>c.status==='active' && /^https:\/\/www\.uuu\.com\.tw\//.test(c.course_url));
const directoryCount = catalog.courses.filter(c=>c.url?.startsWith('https://www.uuu.com.tw/')).length;
function chooseTrack(a:Answer){
 const all=Object.values(a).includes('不確定');
 if(a[4]==='做出 AI 視覺或互動作品'||a[5]==='視覺設計與前端'||a[8]==='發展 AI 設計作品')return 'VISUAL';
 if(a[0]==='分析資料、訓練模型'||a[4]==='建立資料／模型分析能力'||a[5]==='Python／機器學習'||a[8]==='成為 AI／資料工程人才')return 'AI-05';
 if(a[0]==='規劃組織導入 AI'||a[4]==='規劃企業 AI 導入'||a[5]==='AI 導入策略'||a[8]==='帶領公司導入 AI')return 'AI-06';
 if(a[0]==='用 AI 協助寫程式或開發'||a[8]==='轉職 AI／軟體開發')return a[3]==='沒有程式經驗'?'AI-01':'AI-03';
 if(a[0]==='打造 AI 應用或產品'||a[4]==='做出 AI 應用原型'||a[5]==='程式與 API')return 'AI-04';
 if(a[0]==='讓流程自動化'||a[4]==='建立自動化流程或 Agent'||a[5]==='流程自動化'||a[8]==='成為流程自動化推動者')return 'AI-02';
 if(all && a[0]==='不確定' && a[4]==='不確定')return 'AI-01';
 return 'AI-01';
}
function matchingCourses(track:string,a:Answer){
 const ids:Record<string,string[]>={'AI-01':['uuu-3400','uuu-3203','uuu-3225'],'AI-02':['uuu-3346'],'AI-03':['uuu-3547','uuu-2055'],'AI-04':['uuu-3211','uuu-3198','uuu-3362'],'AI-05':['uuu-3171','uuu-3172','uuu-2023'],'AI-06':['uuu-3196','uuu-3198','uuu-3362'],'VISUAL':['uuu-3225','uuu-3203']};
 let candidates=selectable.filter(c=>(ids[track]||[]).includes(c.course_id));
 if(a[3]==='沒有程式經驗' && ['AI-04','AI-05'].includes(track)) candidates=candidates.filter(c=>c.needs_programming==='否');
 return candidates;
}
function Flow({track}:{track:string}){const nodes=track==='AI-05'?['目標與基礎盤點','Python 與資料整理','機器學習實作','進階模型或作品']:track==='AI-02'?['盤點重複工作','設計自動化流程','建立 Agent 原型','測試與持續優化']:track==='AI-03'?['確認開發基礎','AI 協作與程式驗證','完成小型作品','整理作品集']:['確認工作目標','選定 AI 工具與場景','完成課程實作','回到工作／作品驗證'];return <svg className="flow" viewBox="0 0 760 120" role="img" aria-label="學習路線流程圖">{nodes.map((n,i)=><g key={n}><rect x={i*190+5} y="20" width="160" height="64" rx="15"/><text x={i*190+85} y="58" textAnchor="middle">{n}</text>{i<nodes.length-1&&<path d={`M ${i*190+168} 52 h 15`} markerEnd="url(#arrow)"/>}</g>)}<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8"/></marker></defs></svg>}
export default function App(){const [step,setStep]=useState(-1);const [answers,setAnswers]=useState<Answer>({});const [business,setBusiness]=useState(false);const [faq,setFaq]=useState<number|null>(null);const [sent,setSent]=useState(false);const [form,setForm]=useState({name:'',email:'',interest:'課程諮詢'});const [showDirectory,setShowDirectory]=useState(false);
 const track=useMemo(()=>chooseTrack(answers),[answers]);const picks=useMemo(()=>matchingCourses(track,answers),[track,answers]);const rejected=useMemo(()=>selectable.filter(c=>!picks.some(p=>p.course_id===c.course_id)).slice(0,4),[picks]);
 const done=step>=10;
 function answer(value:string){setAnswers({...answers,[step]:value});if(step<9)setStep(step+1);else setStep(10)}
 function download(){const svg=document.querySelector('.flow')?.outerHTML;if(!svg)return;const blob=new Blob([svg],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ai-learning-roadmap.svg';a.click();URL.revokeObjectURL(url)}
 function submit(e:React.FormEvent){e.preventDefault();const leads=JSON.parse(localStorage.getItem('navigator-leads')||'[]');leads.push({...form,track,createdAt:new Date().toISOString()});localStorage.setItem('navigator-leads',JSON.stringify(leads));setSent(true)}
 return <div className="app"><header className="top"><a className="brand" href="#top"><span className="brandmark">N</span> 職涯導航 <span className="brand-sub">AI CAREER COMPASS</span></a><div className="top-right"><span className="privacy">● 本地互動・不需 API</span><button className="outline small" onClick={()=>{setStep(-1);setAnswers({})}}>重新評估</button></div></header>
 <main id="top"><section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> YOUR NEXT MOVE STARTS HERE</div><h1>把 AI 學習，<br/><em>走成你的職涯方向。</em></h1><p>回答 10 個問題，找到適合你的 AI 發展路線與下一步課程。</p><div className="hero-stats"><div><b>10</b><span>題情境問卷</span></div><div><b>6 + 1</b><span>條發展方向</span></div><div><b>{selectable.length}</b><span>可推薦種子課</span></div></div></div><div className="hero-art"><div className="orb orb1"/><div className="orb orb2"/><div className="orbit"/><div className="art-card"><div className="mini-label">你的下一步</div><div className="mini-title">AI × 職涯<br/>新的可能性</div><div className="mini-line"/><div className="mini-badges"><span>探索</span><span>學習</span><span>成長</span></div></div><div className="floating f1">✳</div><div className="floating f2">↗</div></div></section>
 {!done?<section className="quiz-wrap"><div className="section-head"><div><div className="kicker">CAREER CHECK-IN</div><h2>{step<0?'先從你現在的狀態開始':'找到最適合你的學習起點'}</h2></div><span className="muted">約 2 分鐘完成</span></div><div className="quiz-card">{step<0?<><div className="quiz-index">YOUR PERSONALIZED PATH</div><h3>這不是考試，而是一次方向整理。</h3><p className="quiz-intro">不需要有 AI 或程式背景。選擇最接近你現況的答案，我們會依明確規則整理出學習建議。</p><div className="pill-row"><span>✓ 沒有標準答案</span><span>✓ 每題都能選不確定</span><span>✓ 推薦來自真實官網課程</span></div><button className="primary" onClick={()=>setStep(0)}>開始探索 <span>→</span></button></>:<><div className="progress-line"><span style={{width:`${(step+1)*10}%`}}/></div><div className="q-meta"><span>QUESTION {String(step+1).padStart(2,'0')} / 10</span><button onClick={()=>setStep(step-1)} disabled={step===0}>← 上一題</button></div><h3>{questions[step].title}</h3><div className="options">{questions[step].options.map((o,i)=><button className="option" key={o} onClick={()=>answer(o)}><span className="option-num">{String.fromCharCode(65+i)}</span>{o}<span className="chevron">↗</span></button>)}</div></>}</div><p className="under-note">你的回答只用於本次本機推薦，不會送到外部 AI 服務。</p></section>:<section className="results"><div className="result-banner"><div><div className="kicker">YOUR AI CAREER DIRECTION</div><h2>你的推薦方向：<em>{trackInfo[track].name}</em></h2><p>{trackInfo[track].desc}</p></div><div className="track-badge"><span>建議探索職涯</span><b>{trackInfo[track].role}</b></div></div><div className="result-tools"><span>依你的回答整理 · 規則式推薦</span><button className="outline small" onClick={()=>setBusiness(!business)}>{business?'切換一般版':'切換業務解說版'} ↗</button></div>{business&&<div className="business-note">解說重點｜本推薦依學員目標、背景與學習偏好整理；建議先確認課程先備、時數與費用，再安排諮詢或報名。</div>}
 <div className="result-grid"><div className="panel why"><div className="panel-head"><span className="number">01</span><div><div className="kicker">WHY THIS DIRECTION</div><h3>為什麼推薦這條路？</h3></div></div><ul>{[answers[0]&&`你的首要挑戰是「${answers[0]}」，因此優先選擇能直接對應目標的學習路線。`,answers[3]&&`目前程式基礎為「${answers[3]}」，推薦會避免超出目前起點的內容。`,answers[4]&&`你期待的成果是「${answers[4]}」，可作為選課與實作的驗收目標。`].filter(Boolean).map(x=><li key={x}>{x}</li>)}</ul><div className="gap-box"><b>程度／目前缺口</b><p>{answers[3]==='沒有程式經驗'?'建議先建立工具使用與問題拆解習慣；技術型課程需先確認程式先備。':'以問卷自述作為起點；正式先備條件請以課程官網為準。'}</p></div></div>
 <div className="panel course-panel"><div className="panel-head"><span className="number">02</span><div><div className="kicker">COURSE SHORTLIST</div><h3>從一門課開始</h3></div></div>{picks.length? <div className="course-list">{picks.slice(0,3).map((c,i)=><article className={`course-card ${i===0?'featured':''}`} key={c.course_id}><div className="course-label">{i===0?'首選':'備選 '+i}</div><h4>{c.name}</h4><p>{business?'適合作為本方向的起步課程，建議先確認目前開課資訊與條件。':(c.plain_description==='待確認'?'課程內容摘要待確認，請開啟官網查看最新介紹。':c.plain_description)}</p><div className="course-meta"><span>程度：{c.level==='待確認'?'待確認':c.level}</span><span>時數：{c.hours??'待確認'}</span><span>費用：{c.price??'待確認'}</span></div><div className="course-meta"><span>先備：{c.prerequisites==='待確認'?'待確認':c.prerequisites}</span><span>程式：{c.needs_programming==='待確認'?'待確認':c.needs_programming}</span></div><a className="course-link" href={c.course_url} target="_blank" rel="noreferrer">前往官方課程頁 <span>↗</span></a></article>)}</div>:<div className="empty">目前種子資料中沒有符合推薦條件的課程。可先參考方向說明，或前往課程目錄查詢。</div>}<small className="source-note">只推薦狀態 active 且具 uuu.com.tw 官網連結的種子課。目錄骨架 {directoryCount} 門課待逐筆審核，暫不進入推薦。</small></div></div>
 <div className="panel roadmap"><div className="panel-head"><span className="number">03</span><div><div className="kicker">YOUR LEARNING ROADMAP</div><h3>建議學習路線</h3></div><button className="outline small download" onClick={download}>下載 SVG 流程圖 ↓</button></div><Flow track={track}/><div className="roadmap-steps"><span>01 釐清目標與基礎</span><span>02 選課並完成實作</span><span>03 回到工作情境驗證</span></div></div>
 <div className="panel lower-grid"><div><div className="panel-head"><span className="number">04</span><div><div className="kicker">NOT A FIT RIGHT NOW</div><h3>目前不優先建議</h3></div></div><p className="subcopy">以下課程與目前方向不同，先把時間投入更直接的學習目標。</p><div className="not-list">{rejected.map(c=><span key={c.course_id}>{c.name}</span>)}</div></div><div className="faq-box"><div className="panel-head"><span className="number">05</span><div><div className="kicker">QUICK ANSWERS</div><h3>常見問題</h3></div></div>{FAQ.map((q,i)=><button className="faq-item" onClick={()=>setFaq(faq===i?null:i)} key={q}><span>{q}</span><b>{faq===i?'−':'+'}</b>{faq===i&&<small>{faqAnswer[i]}</small>}</button>)}</div></div>
 <div className="panel lead"><div><div className="kicker">KEEP MOVING FORWARD</div><h3>想和顧問一起整理下一步？</h3><p>留下聯絡方式，將本次方向一併存到這台裝置。</p></div>{sent?<div className="success">已儲存於此裝置，感謝你！</div>:<form onSubmit={submit}><input required placeholder="稱呼" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}><option>課程諮詢</option><option>職涯方向</option><option>企業培訓</option></select><button className="primary">儲存名單 →</button></form>}<small>資料只存在瀏覽器 localStorage，不會送出。</small></div>
 <button className="retake" onClick={()=>{setStep(-1);setAnswers({});window.scrollTo({top:0,behavior:'smooth'})}}>← 重新填寫問卷</button></section>}
 <footer><span>AI CAREER COMPASS</span><span>資料來源：種子課程資料與 AI 課程目錄 · 課程資訊以官網公告為準</span></footer></main></div>
}
