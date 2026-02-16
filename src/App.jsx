import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Activity, 
  TrendingUp, 
  Check, 
  Lock, 
  ArrowRight,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Loader2, 
  AlertCircle 
} from 'lucide-react';

// --- 設定區 ---
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || ''; 

// --- 多語言字典 ---
const translations = {
  'zh-TW': {
    brand: 'POSTURE.AI',
    nav_btn: '分析我的結構風險',
    hero_badge: '僅限 Beta 體驗',
    hero_headline: '別讓你的辦公桌毀了你的訓練。',
    hero_subtitle: '久坐與編程正在摧毀你的活動度與力量傳導。\n別等拱腰變成髖與臀痛才後悔。\n用 AI 看見代償、修復底盤，無痛挑戰 PR。',
    hero_cta: '分析我的結構風險',
    hero_limit: '僅限 50 位早期體驗申請人。',
    chart_title: '結構代償趨勢圖',
    chart_subtitle: 'AI 結構分析',
    chart_metric_1: '肩線水平差',
    chart_metric_2: '軀幹對稱度',
    chart_metric_3: '頭前傾幅度',
    problem_title: '你正在崩壞的基礎上訓練。',
    problem_1_title: '辦公桌懲罰',
    problem_1_desc: '緊繃的胸椎和失能的髖部，讓你無法在深蹲時保持中立。',
    problem_2_title: '危險代償',
    problem_2_desc: '為了突破重量盲目代償，最終換來的是下背痛和隨時會爆掉的關節。',
    problem_3_title: '盲目猜測',
    problem_3_desc: '盲目看 YouTube 找復健影片，卻根本不知道自己身體真正的結構歪斜趨勢在哪裡。',
    how_title: '專為高績效者打造的 AI 防禦性校準。',
    how_subtitle: '每週 3 分鐘手機鏡頭 · 結構代償趨勢 · 微量修復任務',
    step_1: '捕捉',
    step_1_desc: '每週 3 分鐘，只需手機鏡頭。AI 視覺精準捕捉你的肩線水平差、軀幹對稱度與頭前傾幅度。',
    step_2: '分析',
    step_2_desc: '不給無效的健康分數。我們給你清晰的「結構代償趨勢圖」，讓數據說話。',
    step_3: '校準',
    step_3_bullet_1: '精準的訓練前校準：5 分鐘動態防禦性熱身，針對每週結構弱點。釋放特定緊繃、喚醒神經系統，安全挑戰極限。',
    step_3_bullet_2: '每日微量活動度修復：根據即時結構偏移，每日 3-5 分鐘修復任務。在辦公桌代償毀了下一次訓練前，每天逆轉它。',
    form_title: '申請早期體驗',
    form_subtitle: '早期體驗',
    form_desc: '填寫以下資訊，我們將審核並通知符合資格的申請人。',
    label_name: '姓名',
    label_email: '電子信箱',
    label_desk_hours: '你每天坐在辦公桌/螢幕前多少小時？',
    label_lifts_stuck: '你主要練哪些複合動作？目前卡在哪裡？',
    label_lifts_placeholder: '例：深蹲 115kg，但我不敢再往上加了；臥推 165lb 卡了三個月',
    label_pain: '目前是哪種具體的代償或疼痛在阻礙你的進步？',
    label_paid_fix: '你之前是否花過錢或時間試圖解決這個問題？',
    btn_submit: '提交申請',
    btn_submitting: '處理中...',
    footer_rights: '版權所有。',
    footer_privacy: '隱私權政策',
    footer_terms: '服務條款',
    footer_login: '僅限會員登入',
    footer_encrypted: '端對端加密',
    success_title: '申請已送出',
    success_follow: '我們會盡快與您聯繫。',
    success_desc: '感謝您對 POSTURE.AI 的興趣。我們將審核您的資料並與您聯繫。',
    error_duplicate: '此 Email 已經申請過了，請勿重複提交。',
    error_general: '發生錯誤，請稍後再試或聯繫客服。',
    error_script_url: '系統設定錯誤：尚未設定 Google Sheet 串接網址。',
    other_placeholder: '請說明...',
    // Form options - desk hours
    desk_opt_1: '< 4 小時',
    desk_opt_2: '4-8 小時',
    desk_opt_3: '8-12 小時',
    desk_opt_4: '12+ 小時',
    // Pain/compensation options
    pain_opt_1: '下背痛 / 骨盆前傾導致核心不穩',
    pain_opt_2: '臥推時過度拱腰導致髖關節/臀部壓迫',
    pain_opt_3: '深蹲底部的屁股眨眼與緊繃',
    pain_opt_4: '胸椎/肩膀活動度喪失',
    pain_opt_other: '其他',
    // Paid to fix options
    paid_opt_1: '有，看過物理治療/整骨',
    paid_opt_2: '有，買過按摩槍/放鬆工具或線上課程',
    paid_opt_3: '只有在 YouTube 上盲目找免費影片跟著做',
    paid_opt_4: '沒有，我選擇忽視它',
    // Learning Module (kept for existing section)
    module_preview_title: '學習模組預覽',
    module_preview_subtitle: '週期建議 · 個人化動作指引',
    module_mobile: '行動模組',
    module_progress: '進度',
    module_tier: 'Tier 3 · 64%',
    module_thoracic_title: '胸椎伸展',
    module_thoracic_desc: '增強脊椎活動度與後側鏈參與，促進功能延續。',
    module_live_analysis: '即時分析',
    module_technical_cues: '技術要點',
    module_cue_1_title: '骨盆穩定',
    module_cue_1_desc: '將骨盆錨定於表面，使伸展集中在胸椎，避免下背代償。',
    module_cue_1_focus: '重點：脊椎活動度。',
    module_cue_1_protection: '保護：維持腰椎中立。',
    module_cue_2_title: '核心收緊',
    module_cue_2_desc: '吸氣時肋骨向兩側擴張並啟動核心，為伸展弧線提供內在支撐。',
    module_cue_2_focus: '重點：腹內壓。',
    module_cue_3_title: '肩胛鎖定',
    module_cue_3_desc: '肩胛後收下壓，用中斜方肌穩定，避免頸部緊張。',
    module_cue_3_focus: '重點：菱形肌與斜方肌啟動。',
    module_intensity: '強度',
    module_moderate: '中等',
    module_frequency: '頻率',
    module_daily_routine: '每日常規',
    module_finish_btn: '完成模組',
  },
  'zh-CN': {
    brand: 'POSTURE.AI',
    nav_btn: '分析我的结构风险',
    hero_badge: '仅限 Beta 体验',
    hero_headline: '别让你的办公桌毁了你的训练。',
    hero_subtitle: '久坐与编程正在摧毁你的活动度与力量传导。\n别等拱腰变成髋与臀痛才后悔。\n用 AI 看见代偿、修复底盘，无痛挑战 PR。',
    hero_cta: '分析我的结构风险',
    hero_limit: '仅限 50 位早期体验申请人。',
    chart_title: '结构代偿趋势图',
    chart_subtitle: 'AI 结构分析',
    chart_metric_1: '肩线水平差',
    chart_metric_2: '躯干对称度',
    chart_metric_3: '头前倾幅度',
    problem_title: '你正在崩坏的基础上训练。',
    problem_1_title: '办公桌惩罚',
    problem_1_desc: '紧绷的胸椎和失能的髋部，让你无法在深蹲时保持中立。',
    problem_2_title: '危险代偿',
    problem_2_desc: '为了突破重量盲目代偿，最终换来的是下背痛和随时会爆掉的关节。',
    problem_3_title: '盲目猜测',
    problem_3_desc: '盲目看 YouTube 找复健影片，却根本不知道自己身体真正的结构歪斜趋势在哪里。',
    how_title: '专为高绩效者打造的 AI 防御性校准。',
    how_subtitle: '每周 3 分钟手机镜头 · 结构代偿趋势 · 微量修复任务',
    step_1: '捕捉',
    step_1_desc: '每周 3 分钟，只需手机镜头。AI 视觉精准捕捉你的肩线水平差、躯干对称度与头前倾幅度。',
    step_2: '分析',
    step_2_desc: '不给无效的健康分数。我们给你清晰的「结构代偿趋势图」，让数据说话。',
    step_3: '校准',
    step_3_bullet_1: '精准的训练前校准：5 分钟动态防御性热身，针对每周结构弱点。释放特定紧绷、唤醒神经系统，安全挑战极限。',
    step_3_bullet_2: '每日微量活动度修复：根据即时结构偏移，每日 3-5 分钟修复任务。在办公桌代偿毁了下一次训练前，每天逆转它。',
    form_title: '申请早期体验',
    form_subtitle: '早期体验',
    form_desc: '填写以下信息，我们将审核并通知符合资格的申请人。',
    label_name: '姓名',
    label_email: '电子信箱',
    label_desk_hours: '你每天坐在办公桌/屏幕前多少小时？',
    label_lifts_stuck: '你主要练哪些复合动作？目前卡在哪里？',
    label_lifts_placeholder: '例：深蹲 115kg，但我不敢再往上加了；卧推 165lb 卡了三个月',
    label_pain: '目前是哪种具体的代偿或疼痛在阻碍你的进步？',
    label_paid_fix: '你之前是否花过钱或时间试图解决这个问题？',
    btn_submit: '提交申请',
    btn_submitting: '处理中...',
    footer_rights: '版权所有。',
    footer_privacy: '隐私权政策',
    footer_terms: '服务条款',
    footer_login: '仅限会员登录',
    footer_encrypted: '端对端加密',
    success_title: '申请已送出',
    success_follow: '我们会尽快与您联系。',
    success_desc: '感谢您对 POSTURE.AI 的兴趣。我们将审核您的资料并与您联系。',
    error_duplicate: '此 Email 已经申请过了，请勿重复提交。',
    error_general: '发生错误，请稍后再试或联系客服。',
    error_script_url: '系统设定错误：尚未设定 Google Sheet 串接网址。',
    other_placeholder: '请说明...',
    desk_opt_1: '< 4 小时',
    desk_opt_2: '4-8 小时',
    desk_opt_3: '8-12 小时',
    desk_opt_4: '12+ 小时',
    pain_opt_1: '下背痛 / 骨盆前倾导致核心不稳',
    pain_opt_2: '卧推时过度拱腰导致髋关节/臀部压迫',
    pain_opt_3: '深蹲底部的屁股眨眼与紧绷',
    pain_opt_4: '胸椎/肩膀活动度丧失',
    pain_opt_other: '其他',
    paid_opt_1: '有，看过物理治疗/整骨',
    paid_opt_2: '有，买过按摩枪/放松工具或在线课程',
    paid_opt_3: '只有在 YouTube 上盲目找免费影片跟着做',
    paid_opt_4: '没有，我选择忽视它',
    module_preview_title: '学习模块预览',
    module_preview_subtitle: '周期建议 · 个性化动作指引',
    module_mobile: '行动模块',
    module_progress: '进度',
    module_tier: 'Tier 3 · 64%',
    module_thoracic_title: '胸椎伸展',
    module_thoracic_desc: '增强脊椎活动度与后侧链参与，促进功能延续。',
    module_live_analysis: '即时分析',
    module_technical_cues: '技术要点',
    module_cue_1_title: '骨盆稳定',
    module_cue_1_desc: '将骨盆锚定于表面，使伸展集中在胸椎，避免下背代偿。',
    module_cue_1_focus: '重点：脊椎活动度。',
    module_cue_1_protection: '保护：维持腰椎中立。',
    module_cue_2_title: '核心收紧',
    module_cue_2_desc: '吸气时肋骨向两侧扩张并启动核心，为伸展弧线提供内在支撑。',
    module_cue_2_focus: '重点：腹内压。',
    module_cue_3_title: '肩胛锁定',
    module_cue_3_desc: '肩胛后收下压，用中斜方肌稳定，避免颈部紧张。',
    module_cue_3_focus: '重点：菱形肌与斜方肌启动。',
    module_intensity: '强度',
    module_moderate: '中等',
    module_frequency: '频率',
    module_daily_routine: '每日常规',
    module_finish_btn: '完成模块',
  },
  'en': {
    brand: 'POSTURE.AI',
    nav_btn: 'Scan My Structural Baseline',
    hero_badge: 'Beta Access Only',
    hero_headline: 'Stop Letting Your Desk Job Kill Your Lifts.',
    hero_subtitle: 'Desk life is killing your mobility and force transfer.\nDon\'t wait for that arch to become hip pain.\nUse AI to see your compensations, fix your foundation, and lift pain-free.',
    hero_cta: 'Scan My Structural Baseline',
    hero_limit: 'Only taking 50 early access applicants.',
    chart_title: 'Structural Compensation Trend',
    chart_subtitle: 'AI Structural Analysis',
    chart_metric_1: 'Shoulder Level',
    chart_metric_2: 'Torso Symmetry',
    chart_metric_3: 'Forward Head',
    problem_title: 'You Are Lifting on a Broken Foundation.',
    problem_1_title: 'The Desk Penalty',
    problem_1_desc: 'Tight thoracic spine and dysfunctional hips keep you from staying neutral in the squat.',
    problem_2_title: 'Dangerous Compensations',
    problem_2_desc: 'Blind compensation to push weight leads to lower back pain and joints ready to blow.',
    problem_3_title: 'Blind Guessing',
    problem_3_desc: 'You chase random YouTube rehab videos without knowing your body\'s actual structural bias.',
    how_title: 'AI-Powered Pre-hab for High-Performers.',
    how_subtitle: '3 min/week with your phone · Structural trend · Micro calibration tasks',
    step_1: 'Capture',
    step_1_desc: '3 minutes per week, phone camera only. AI vision captures shoulder level, torso symmetry, and forward head posture.',
    step_2: 'Analyze',
    step_2_desc: 'No useless wellness scores. You get a clear "structural compensation trend" so the data speaks.',
    step_3: 'Calibrate',
    step_3_bullet_1: 'Targeted Pre-Workout Calibration: 5-min dynamic pre-hab tailored to your weekly structural weak links. Release targeted tension, prime your nervous system, lift safely.',
    step_3_bullet_2: 'Daily Micro-Dose Mobility: 3-5 min daily repair tasks based on your live structural bias. Reverse the desk penalty every day before it ruins your next lift.',
    form_title: 'Apply for Early Access',
    form_subtitle: 'Early Access',
    form_desc: 'Fill in the form below. We\'ll review and notify qualifying applicants.',
    label_name: 'Name',
    label_email: 'Email',
    label_desk_hours: 'How many hours a day do you spend sitting at a desk/screen?',
    label_lifts_stuck: 'What are your primary compound lifts, and where are you currently stuck?',
    label_lifts_placeholder: 'e.g. Squat 115kg but afraid to go heavier; Bench 165lb stuck for 3 months',
    label_pain: 'What specific pain or compensation is currently killing your progress?',
    label_paid_fix: 'Have you actively spent money or time trying to fix this issue?',
    btn_submit: 'Submit',
    btn_submitting: 'Processing...',
    footer_rights: 'All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_login: 'Member Login',
    footer_encrypted: 'End-to-end encrypted',
    success_title: 'Application Sent',
    success_follow: 'We will get back to you soon!',
    success_desc: 'Thank you for your interest. We will review your profile and get in touch.',
    error_duplicate: 'This email has already been registered.',
    error_general: 'An error occurred. Please try again later.',
    error_script_url: 'System Error: Google Sheet URL not configured.',
    other_placeholder: 'Please specify...',
    desk_opt_1: '< 4 hours',
    desk_opt_2: '4-8 hours',
    desk_opt_3: '8-12 hours',
    desk_opt_4: '12+ hours',
    pain_opt_1: 'Lower back pain / Anterior pelvic tilt',
    pain_opt_2: 'Hip/glute impingement from excessive arching during bench',
    pain_opt_3: 'Butt wink & tightness at the bottom of the squat',
    pain_opt_4: 'Loss of thoracic/shoulder mobility',
    pain_opt_other: 'Other',
    paid_opt_1: 'Yes, PT / Chiropractor',
    paid_opt_2: 'Yes, Massage guns / Mobility programs',
    paid_opt_3: 'Only watching free YouTube videos',
    paid_opt_4: 'No, I just ignore it',
    module_preview_title: 'Learning Module Preview',
    module_preview_subtitle: 'Weekly suggestions · Personalized movement cues',
    module_mobile: 'Mobile Module',
    module_progress: 'Progress',
    module_tier: 'Tier 3 · 64%',
    module_thoracic_title: 'Thoracic Extension',
    module_thoracic_desc: 'Enhance spinal mobility and optimize posterior chain engagement for functional longevity.',
    module_live_analysis: 'Live Analysis',
    module_technical_cues: 'Technical Cues',
    module_cue_1_title: 'Pelvic Stability',
    module_cue_1_desc: 'Anchor your hips to the surface. This isolates extension to the thoracic spine, preventing lower back compensation.',
    module_cue_1_focus: 'Focus: Spine mobility.',
    module_cue_1_protection: 'Protection: Maintain neutral Lumbar spine.',
    module_cue_2_title: 'Core Compression',
    module_cue_2_desc: 'Inhale laterally into the ribs and engage the core. This creates internal support for the spine during the arc.',
    module_cue_2_focus: 'Focus: Intra-abdominal pressure.',
    module_cue_3_title: 'Scapular Lock',
    module_cue_3_desc: 'Retract and depress shoulders. Use middle traps to stabilize, avoiding any tension in the neck area.',
    module_cue_3_focus: 'Focus: Rhomboid and Trapezius activation.',
    module_intensity: 'Intensity',
    module_moderate: 'Moderate',
    module_frequency: 'Frequency',
    module_daily_routine: 'Daily Routine',
    module_finish_btn: 'Finish Module',
  }
};

// 偵測瀏覽器語言
const detectBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return 'zh-TW';
  const lang = navigator.language || navigator.userLanguage;
  if (/^zh-(CN|SG)$/i.test(lang)) return 'zh-CN';
  if (/^zh/i.test(lang)) return 'zh-TW';
  return 'en';
};

const MockDataChart = () => (
  <div className="w-full h-48 flex items-end justify-between gap-2 px-4 py-4 bg-slate-50 dark:bg-black/40 rounded-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-500">
    <div className="absolute inset-0 grid grid-rows-4 w-full h-full opacity-10 pointer-events-none">
      <div className="border-t border-slate-400 w-full border-dashed"></div>
      <div className="border-t border-slate-400 w-full border-dashed"></div>
      <div className="border-t border-slate-400 w-full border-dashed"></div>
      <div className="border-t border-slate-400 w-full border-dashed"></div>
    </div>
    {[30, 45, 40, 60, 55, 75, 85].map((height, i) => (
      <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
        <div className="w-1 bg-slate-400 dark:bg-slate-600 transition-all duration-1000 group-hover:bg-blue-500 relative"
          style={{ height: `${height}%` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-600 group-hover:border-blue-500 transition-colors"></div>
        </div>
      </div>
    ))}
  </div>
);

const App = () => {
  const [lang, setLang] = useState(detectBrowserLanguage()); 
  const [theme, setTheme] = useState('dark'); 
  const [scrolled, setScrolled] = useState(false);
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [ipData, setIpData] = useState(null); // 儲存完整的 IP 資料以供追蹤使用
  const [showLangMenu, setShowLangMenu] = useState(false); // 控制語言選單顯示
  const hasTracked = useRef(false); // 避免重複發送追蹤請求
  const langMenuRef = useRef(null); // 語言選單的 ref

  const t = (key) => translations[lang][key] || key;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    deskHours: '',
    liftsStuck: '',
    painCompensation: [],
    painOther: '',
    paidToFix: ''
  });

  // 1. 獲取使用者位置與 IP
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        setIpData(data);
        if (data.country_name) {
          setUserCountry(`${data.country_name} (${data.country_code})`);
        }
      })
      .catch(error => {
        console.log('Location detection failed:', error);
        // 即使 IP 抓取失敗，我們稍後還是會發送基本的追蹤數據
        setIpData({ error: 'Failed to fetch IP' });
      });
  }, []);

  // 2. 當 IP 資料準備好 (或失敗) 且 Script URL 存在時，發送流量追蹤
  useEffect(() => {
    if (GOOGLE_SCRIPT_URL && ipData && !hasTracked.current) {
      hasTracked.current = true;
      
      const trackVisit = async () => {
        try {
          const payload = {
            action: 'track', // 告訴後端這是流量紀錄
            ip: ipData.ip || 'Unknown',
            city: ipData.city || 'Unknown',
            country: ipData.country_name || 'Unknown',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            screenWidth: window.screen.width
          };

          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          // 流量追蹤默默在背景執行，不需要顯示成功/失敗給用戶
        } catch (e) {
          console.error('Tracking failed', e);
        }
      };
      
      trackVisit();
    }
  }, [ipData]);

  // 主題切換 Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 滾動監聽
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 點擊外部關閉語言選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };

    if (showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangMenu]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentList = prev[field];
      if (checked) {
        return { ...prev, [field]: [...currentList, value] };
      } else {
        return { ...prev, [field]: currentList.filter(item => item !== value) };
      }
    });
  };

  // 3. 表單提交處理 (新增 action: 'submit')
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setServerError('');

    if (!GOOGLE_SCRIPT_URL) {
      setServerError(t('error_script_url'));
      setStatus('error');
      return;
    }

    try {
      const payload = {
        action: 'submit',
        ...formData,
        painCompensation: formData.painCompensation.join('; '),
        submittedAt: new Date().toISOString(),
        userCountry: userCountry 
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setStatus('success');
      } else if (result.status === 'error' && result.code === 'DUPLICATE_EMAIL') {
        setStatus('error');
        setServerError(t('error_duplicate'));
      } else {
        throw new Error(result.message || 'Unknown error');
      }

    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
      if (!serverError) {
        setServerError(t('error_general'));
      }
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('apply-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const deskHourOptions = [
    { val: '<4', labelKey: 'desk_opt_1' },
    { val: '4-8', labelKey: 'desk_opt_2' },
    { val: '8-12', labelKey: 'desk_opt_3' },
    { val: '12+', labelKey: 'desk_opt_4' },
  ];
  const painOptionKeys = ['pain_opt_1', 'pain_opt_2', 'pain_opt_3', 'pain_opt_4'];
  const paidOptions = [
    { val: 'pt_chiro', labelKey: 'paid_opt_1' },
    { val: 'massage_programs', labelKey: 'paid_opt_2' },
    { val: 'youtube_only', labelKey: 'paid_opt_3' },
    { val: 'ignore', labelKey: 'paid_opt_4' },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] text-slate-300 selection:bg-blue-500/30 selection:text-white' : 'bg-[#f5f5f7] text-slate-700 selection:bg-slate-200 selection:text-black'}`}>
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled 
        ? (theme === 'dark' ? 'bg-[#0a0a0a]/90 border-b border-white/5' : 'bg-white/90 border-b border-slate-200') 
        : 'bg-transparent'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className={`text-xl font-bold tracking-widest font-mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {t('brand')}<span className="text-blue-600">.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 transition-colors ${theme === 'dark' ? 'hover:text-white text-slate-500' : 'hover:text-black text-slate-400'}`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wider p-2 ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}
              >
                <Globe size={14} />
                {lang === 'zh-TW' ? '繁體中文' : lang === 'zh-CN' ? '简体中文' : 'English'}
              </button>
              {showLangMenu && (
                <div className={`absolute right-0 top-full mt-2 w-28 py-1 rounded-sm shadow-xl border overflow-hidden z-50 ${theme === 'dark' ? 'bg-[#111] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <button 
                    onClick={() => { setLang('zh-TW'); setShowLangMenu(false); }} 
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 hover:text-white transition-colors ${lang === 'zh-TW' ? 'text-blue-500' : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    繁體中文
                  </button>
                  <button 
                    onClick={() => { setLang('zh-CN'); setShowLangMenu(false); }} 
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 hover:text-white transition-colors ${lang === 'zh-CN' ? 'text-blue-500' : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    简体中文
                  </button>
                  <button 
                    onClick={() => { setLang('en'); setShowLangMenu(false); }} 
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 hover:text-white transition-colors ${lang === 'en' ? 'text-blue-500' : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={scrollToForm}
              className={`hidden md:block px-6 py-2 text-xs font-medium border transition-all duration-300 rounded-sm uppercase tracking-widest ${
                theme === 'dark' 
                ? 'text-white border-white/20 hover:border-white hover:bg-white hover:text-black' 
                : 'text-black border-black/20 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              {t('nav_btn')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200/40'}`}></div>
        
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 border text-[10px] tracking-[0.2em] uppercase font-mono ${
              theme === 'dark' ? 'bg-transparent border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-black'}`}></div>
              {t('hero_badge')}
            </div>
            
            <h1 className={`text-4xl lg:text-6xl font-bold leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {t('hero_headline')}
            </h1>
            
            <p className={`text-base lg:text-lg max-w-xl leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('hero_subtitle')}
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={scrollToForm}
                className={`group w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-sm border transition-all ${
                  theme === 'dark' 
                  ? 'bg-white text-black border-white hover:bg-transparent hover:text-white' 
                  : 'bg-black text-white border-black hover:bg-transparent hover:text-black'
                }`}
              >
                <span className="flex items-center justify-center gap-3">
                  {t('hero_cta')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <p className={`text-[11px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                {t('hero_limit')}
              </p>
            </div>
          </div>

          <div className="relative">
             <div className={`relative z-10 rounded-sm p-6 backdrop-blur-sm border transition-colors duration-500 ${
               theme === 'dark' ? 'bg-[#111]/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-xl'
             }`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`font-medium tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('chart_title')}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mt-1">{t('chart_subtitle')}</p>
                  </div>
                  <Activity className="text-slate-400" size={20} />
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end text-xs text-slate-500 mb-1 font-mono">
                    <span className="uppercase tracking-wider">{t('chart_metric_1')}</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>+12.5%</span>
                  </div>
                  <MockDataChart />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className={`p-4 rounded-sm border ${theme === 'dark' ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{t('chart_metric_2')}</div>
                      <div className={`text-xl font-mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Low</div>
                      <div className={`w-full h-0.5 mt-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div className="bg-emerald-500 h-full w-1/4"></div>
                      </div>
                    </div>
                    <div className={`p-4 rounded-sm border ${theme === 'dark' ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{t('chart_metric_3')}</div>
                      <div className={`text-xl font-mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>98.2</div>
                      <div className={`w-full h-0.5 mt-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div className="bg-blue-600 h-full w-[98%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      

      {/* The Problem */}
      <section className={`py-24 border-t transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] border-slate-900' : 'bg-[#f5f5f7] border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-12 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {t('problem_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Activity size={20} />, title: t('problem_1_title'), desc: t('problem_1_desc') },
              { icon: <AlertCircle size={20} />, title: t('problem_2_title'), desc: t('problem_2_desc') },
              { icon: <TrendingUp size={20} />, title: t('problem_3_title'), desc: t('problem_3_desc') }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-sm border transition-all duration-300 group ${
                theme === 'dark' 
                ? 'border-slate-900 bg-transparent hover:border-blue-900' 
                : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
              }`}>
                <div className={`w-10 h-10 flex items-center justify-center mb-6 transition-colors ${
                  theme === 'dark' ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`text-base font-bold mb-3 tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('how_title')}</h2>
            <p className="text-slate-500">{t('how_subtitle')}</p>
          </div>

          {/* Step Numbers - 3 steps */}
          <div className="grid md:grid-cols-3 gap-8 relative mb-16">
            <div className={`hidden md:block absolute top-8 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent z-0 ${
              theme === 'dark' ? 'via-slate-800' : 'via-slate-200'
            }`}></div>

            {[
              { step: "01", title: t('step_1') },
              { step: "02", title: t('step_2') },
              { step: "03", title: t('step_3') }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-mono mb-6 ring-8 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-black border border-slate-800 text-slate-300 ring-[#050505] group-hover:border-blue-800 group-hover:text-blue-400' 
                  : 'bg-white border border-slate-200 text-slate-600 ring-white group-hover:border-blue-400 group-hover:text-black'
                }`}>
                  {item.step}
                </div>
                <h3 className={`text-sm font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Visual Demonstrations - Steps 1 & 2 (photos preserved) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 mb-16">
            {/* Step 1: Capture - Mobile Scanner */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-[280px] h-[580px] bg-[#101822] rounded-[2.5rem] border-[6px] border-[#1e293b] shadow-2xl overflow-hidden select-none font-sans transform hover:scale-[1.02] transition-transform duration-500">
                {/* Style for animation */}
                <style>{`
                  @keyframes scan {
                    0%, 100% { top: 20%; opacity: 0; }
                    50% { top: 80%; opacity: 1; }
                  }
                  .scan-line {
                    animation: scan 3s ease-in-out infinite;
                  }
                `}</style>
                
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img alt="Professional man standing" className="w-full h-full object-cover opacity-90 contrast-125 brightness-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6UISFUA1QnUD1GnlGCFF_B2CIqBKuZc3uFDXxoEoow94AtU6Ny9c5JhzJz4F22i8MFvUGmBlYGwNZHOC-V-pBRLQeYdYBzi0k4uVciAclZOaZKnEAjgxf70dHPmuanDnh0ABkMH18pqPRjPoacxjJcU5scDlf4eQwRRx6KHPzpYgA2Q6ljn-g18zhHWwuj8ugn7cPIHGzvwXHT4s8jpnz5IMDITulwFnPOz5kPQjsYnNPU9vaB_OW4f7_Q_phBOHDH9QjlvSEMe4S"/>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#101822]/40 via-transparent to-[#101822]/90"></div>
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
                </div>

                {/* UI Layer */}
                <div className="relative z-10 flex flex-col h-full justify-between p-4">
                  {/* Header */}
                  <header className="flex flex-col w-full space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                       <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70">
                          <Scan size={14} />
                       </div>
                       <div className="flex flex-col items-center">
                          <div className="flex items-center space-x-1">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                            </span>
                            <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-cyan-400/90 whitespace-nowrap">AI SCANNING</span>
                          </div>
                       </div>
                       <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70">
                         <div className="w-1 h-1 bg-white rounded-full"></div>
                         <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                       </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/30 flex items-center space-x-1 shadow-xl">
                        <Lock size={10} className="text-cyan-400" />
                        <span className="text-[8px] tracking-wider text-cyan-400 font-bold uppercase">PRIVACY MODE</span>
                      </div>
                    </div>
                  </header>

                  {/* Main Scanner Frame */}
                  <main className="flex-1 relative flex items-center justify-center my-2">
                    {/* Animated Scan Line */}
                    <div className="scan-line absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_10px_#22d3ee]"></div>
                    
                    {/* Frame Brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 rounded-br-xl"></div>

                    {/* Center Guide */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                      <div className="w-[1px] h-full bg-cyan-400/50 border-dashed border-l border-cyan-400"></div>
                    </div>

                    {/* Floating Tag: Spine */}
                    <div className="absolute top-[20%] right-2 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-md border border-cyan-400/40 shadow-lg flex items-center space-x-1.5">
                      <Activity size={10} className="text-cyan-400" />
                        <span className="text-[8px] font-bold text-white uppercase tracking-wider">Spine</span>
                    </div>

                    {/* Floating Tag: Tilt */}
                    <div className="absolute bottom-[30%] left-2 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-md border border-white/20 shadow-lg flex flex-col items-center justify-center min-w-[40px]">
                      <span className="text-[7px] text-cyan-400 tracking-widest uppercase mb-0.5 font-bold">Tilt</span>
                      <span className="text-[10px] font-bold text-white font-mono"></span>
                    </div>
                  </main>

                  {/* Footer Controls */}
                  <footer className="flex flex-col space-y-4 pb-6 w-full z-20">
                     <div className="flex items-center justify-center space-x-2">
                       <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
                       <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest">Quality: Excellent</span>
                       <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-400/50"></div>
                     </div>
                     
                     <div className="flex items-center justify-center">
                        <button className="relative group">
                          <div className="absolute -inset-2 rounded-full border border-cyan-400/30 scale-110 animate-pulse"></div>
                          <div className="w-16 h-16 rounded-full border-2 border-cyan-400/60 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md hover:scale-105 transition-all duration-300">
                            <Check size={20} className="text-cyan-400 mb-0.5" />
                            <span className="text-[7px] font-bold text-white uppercase tracking-tight">Proceed</span>
                          </div>
                        </button>
                     </div>
                  </footer>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 ${
                  theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  <span>01</span>
                  <span className="w-1 h-1 rounded-full bg-current"></span>
                  <span>{t('step_1')}</span>
                </div>
                <p className={`text-sm max-w-[280px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('step_1_desc')}
                </p>
              </div>
            </div>

            {/* Step 2: Analyze - Structural Analysis */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-[#101822] rounded-xl p-6 border border-slate-800 overflow-hidden shadow-2xl w-full max-w-sm font-sans">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Structural Alignment</h3>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-mono">POSTURE SCAN</span>
                </div>
                
                <div className="relative h-64 w-full flex items-center justify-center bg-[#0a0f16] rounded-lg overflow-hidden mb-6 border border-slate-800/50">
                  <div className="absolute inset-0 flex items-center justify-center py-2">
                    <img alt="Side profile posture scan" className="h-full w-auto object-contain grayscale mix-blend-screen opacity-50 scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1f99nTXsEPryLjGWezhMKen3K9hIaXUaeWKC21GEkqZBfVytqoqkg3PXDjU3SN9HoUqK8yj4B65UqL7RnQJotAulqfxX4JXBROJB-SliDCjMIKhbIzzt9Tv3bkC0Fs1JguHRWAdExaRGmVFtOTHVaA7NubflKxXZHIFSoUADjCS1f3-roEnE51JmjG-nz-66DbZuYj_wP9xjtCdVb5jtU2Xj5vE3586z7DCRwzilFCuNhDApN4vTeG3-VS-TLkZH-2Af74-PsY_4P"/>
                  </div>
                  
                  {/* Grid Lines */}
                  <div className="absolute w-full h-[1px] bg-blue-500/10 top-[20%]"></div>
                  <div className="absolute w-full h-[1px] bg-blue-500/10 top-[40%]"></div>
                  <div className="absolute w-full h-[1px] bg-blue-500/10 top-[60%]"></div>
                  <div className="absolute w-full h-[1px] bg-blue-500/10 top-[80%]"></div>
                  
                  {/* Markers */}
                  <div className="absolute top-[22%] left-[55%] flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-cyan-400 flex items-center justify-center text-[6px] font-bold text-cyan-400 bg-black/80">1</div>
                    <div className="bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-slate-700/50">
                      <p className="text-[8px] text-white font-medium">Cervical</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-[58%] left-[25%] flex items-center gap-2">
                    <div className="bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-blue-500/50 text-right">
                      <p className="text-[8px] text-white font-medium leading-none">Pelvic<br/><span className="text-[7px] text-blue-400">Focus</span></p>
                    </div>
                    <div className="w-3 h-3 rounded-full border border-blue-400 flex items-center justify-center text-[6px] font-bold text-blue-400 bg-black/80 animate-pulse">2</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1 bg-[#0a0f16] p-3 rounded-md border border-slate-800 transition-colors">
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Observation</p>
                    <p className="text-[10px] text-slate-300 leading-snug">Spine aligned. </p>
                  </div>
                  <div className="flex-1 bg-[#0a0f16] p-3 rounded-md border border-slate-800 transition-colors">
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Impact</p>
                    <p className="text-[10px] text-slate-300 leading-snug">Core strengthening advised.</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 ${
                  theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  <span>02</span>
                  <span className="w-1 h-1 rounded-full bg-current"></span>
                  <span>{t('step_2')}</span>
                </div>
                <p className={`text-sm max-w-[320px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('step_2_desc')}
                </p>
              </div>
            </div>

            {/* Step 3: Calibrate - text card (no photo) */}
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-full max-w-sm p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#111] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold mb-4 ${
                  theme === 'dark' ? 'bg-blue-900/20 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  03 · {t('step_3')}
                </div>
                <ul className={`text-sm leading-relaxed space-y-3 list-disc list-outside pl-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>{t('step_3_bullet_1')}</li>
                  <li>{t('step_3_bullet_2')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Module Preview */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f7]'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {t('module_preview_title')}
            </h2>
            <p className="text-slate-500 text-sm">
              {t('module_preview_subtitle')}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-[280px] h-[620px] bg-[#0f1214] rounded-[2.5rem] border-[6px] border-[#1a1e21] shadow-2xl overflow-hidden select-none flex flex-col font-display antialiased">
              <header className="flex-none px-4 pt-8 pb-3 flex items-center justify-between z-30 bg-[#0f1214]/90 backdrop-blur-xl border-b border-white/5">
                <button type="button" className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
                  <span className="material-icons-outlined text-[#f0f2f0]/60 text-lg">arrow_back_ios_new</span>
                </button>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3e7a63]">{t('module_mobile')}</span>
                <button type="button" className="p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors">
                  <span className="material-icons-outlined text-[#f0f2f0]/60 text-lg">share</span>
                </button>
              </header>
              <main className="flex-1 overflow-y-auto no-scrollbar min-h-0">
                <section className="px-4 py-3 border-b border-white/5 bg-[#0f1214]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#f0f2f0]/40">{t('module_progress')}</span>
                      <span className="h-[2px] w-20 bg-white/10 relative rounded-full overflow-hidden">
                        <span className="absolute inset-y-0 left-0 w-[64%] bg-[#3e7a63] rounded-full" />
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#3e7a63] uppercase tracking-tighter">{t('module_tier')}</span>
                  </div>
                </section>
                <section className="px-4 py-5">
                  <h1 className="text-xl font-bold tracking-tight text-[#f0f2f0] mb-1">{t('module_thoracic_title')}</h1>
                  <p className="text-xs text-[#f0f2f0]/40 leading-relaxed">
                    {t('module_thoracic_desc')}
                  </p>
                </section>
                <div className="flex flex-col border-t border-white/5">
                  <section className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                    <img alt="Posture demonstration" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvCOpuUwuO4t3AZO_uZGAbONJKzuFilBJQ45nscDeM9xSkAHu7Bw32aZgkHgGlu-0neE8397p8CC9085reNQ6MKqR2KR2_HN0BSfAW-V_T6aMzkVHKP9rGErBwa0tqppgvQi-6d_mvJJCPu0oiXyv3M1ofpSwKnVpV5_aVLM6ORKLgKRctI_Fw-CwYAz9aH6FZ8C3jFW_uYgUxmGC-IoITaNJWpWJdURSQBpVuqvX8HV-WdwsqrZxG8SD_G_fPDgh9RE7gSxDA1IOd" />
                    <div className="absolute inset-0 tech-grid pointer-events-none" />
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 opacity-40" viewBox="0 0 100 100">
                        <path d="M50 20 Q 85 50 50 80" fill="none" stroke="#3e7a63" strokeDasharray="2 2" strokeWidth="0.8" />
                        <circle cx="50" cy="20" fill="#3e7a63" r="1.2" />
                        <circle cx="50" cy="50" fill="#3e7a63" r="1.2" />
                        <circle cx="50" cy="80" fill="#3e7a63" r="1.2" />
                      </svg>
                    </div>
                    <button type="button" className="absolute bottom-3 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#3e7a63] text-white shadow-xl">
                      <span className="material-icons-outlined text-xl">play_arrow</span>
                    </button>
                  </section>
                  <section className="bg-[#1a1e21] px-4 py-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1 h-3 bg-[#3e7a63] rounded-full" />
                      <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#f0f2f0]/50">{t('module_technical_cues')}</h2>
                    </div>
                    <div className="space-y-2">
                      <details className="group bg-[#0f1214]/60 rounded-xl border border-white/5 overflow-hidden transition-all">
                        <summary className="p-4 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#3e7a63]/60 font-bold w-4">01</span>
                            <h4 className="text-xs font-semibold text-[#f0f2f0]/90">{t('module_cue_1_title')}</h4>
                          </div>
                          <span className="material-symbols-outlined expand-icon text-white/20 text-sm transition-transform select-none">expand_more</span>
                        </summary>
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <p className="text-[11px] text-[#f0f2f0]/50 leading-relaxed">
                            {t('module_cue_1_desc')}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <span className="text-[#3e7a63] mt-0.5">•</span>
                              <p className="text-[10px] text-[#f0f2f0]/40 italic">{t('module_cue_1_focus')}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#3e7a63] mt-0.5">•</span>
                              <p className="text-[10px] text-[#f0f2f0]/40 italic">{t('module_cue_1_protection')}</p>
                            </div>
                          </div>
                        </div>
                      </details>
                      <details className="group bg-[#0f1214]/60 rounded-xl border border-white/5 overflow-hidden transition-all">
                        <summary className="p-4 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#3e7a63]/60 font-bold w-4">02</span>
                            <h4 className="text-xs font-semibold text-[#f0f2f0]/90">{t('module_cue_2_title')}</h4>
                          </div>
                          <span className="material-symbols-outlined expand-icon text-white/20 text-sm transition-transform select-none">expand_more</span>
                        </summary>
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <p className="text-[11px] text-[#f0f2f0]/50 leading-relaxed">
                            {t('module_cue_2_desc')}
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="text-[#3e7a63] mt-0.5">•</span>
                            <p className="text-[10px] text-[#f0f2f0]/40 italic">{t('module_cue_2_focus')}</p>
                          </div>
                        </div>
                      </details>
                      <details className="group bg-[#0f1214]/60 rounded-xl border border-white/5 overflow-hidden transition-all">
                        <summary className="p-4 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#3e7a63]/60 font-bold w-4">03</span>
                            <h4 className="text-xs font-semibold text-[#f0f2f0]/90">{t('module_cue_3_title')}</h4>
                          </div>
                          <span className="material-symbols-outlined expand-icon text-white/20 text-sm transition-transform select-none">expand_more</span>
                        </summary>
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <p className="text-[11px] text-[#f0f2f0]/50 leading-relaxed">
                            {t('module_cue_3_desc')}
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="text-[#3e7a63] mt-0.5">•</span>
                            <p className="text-[10px] text-[#f0f2f0]/40 italic">{t('module_cue_3_focus')}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                    <div className="flex items-center justify-between pt-3 pb-6 px-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-[#f0f2f0]/30 tracking-widest">{t('module_intensity')}</span>
                        <span className="text-[10px] font-medium text-[#f0f2f0]/60">{t('module_moderate')}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] uppercase text-[#f0f2f0]/30 tracking-widest">{t('module_frequency')}</span>
                        <span className="text-[10px] font-medium text-[#f0f2f0]/60">{t('module_daily_routine')}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </main>
              <div className="flex-none p-4 bg-gradient-to-t from-[#0f1214] via-[#0f1214]/95 to-transparent border-t border-white/5">
                <div className="flex gap-2">
                  <button type="button" className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1a1e21] border border-white/10 text-[#f0f2f0]/40 hover:text-[#f0f2f0] transition-all">
                    <span className="material-symbols-outlined text-lg font-light">tune</span>
                  </button>
                  <button type="button" className="flex-1 h-12 bg-[#3e7a63] text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-1.5 text-xs transition-transform active:scale-95">
                    <span className="tracking-wide">{t('module_finish_btn')}</span>
                    <span className="material-symbols-outlined text-base">verified</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply-form" className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f7]'}`}>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          <div className="mb-12 text-center">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('form_title')}</h2>
            <p className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase font-mono">{t('form_subtitle')}</p>
            <p className="text-slate-500 mt-4 text-sm">{t('form_desc')}</p>
          </div>

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className={`space-y-10 p-8 md:p-12 rounded-sm border shadow-2xl relative ${
              theme === 'dark' ? 'bg-[#111] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* 錯誤訊息顯示區 */}
              {status === 'error' && (
                <div className="absolute top-0 left-0 w-full p-4 bg-red-500/10 border-b border-red-500/20 text-red-500 text-sm flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  {serverError}
                </div>
              )}
              
              {/* 1. Basic Info */}
              <div className="grid md:grid-cols-2 gap-8 mt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('label_name')}</label>
                  <input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    className={`w-full px-4 py-3 rounded-sm border bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${
                      theme === 'dark' ? 'border-slate-800 text-white placeholder-slate-700' : 'border-slate-300 text-black placeholder-slate-400'
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('label_email')}</label>
                  <input 
                    required 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    className={`w-full px-4 py-3 rounded-sm border bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${
                      theme === 'dark' ? 'border-slate-800 text-white placeholder-slate-700' : 'border-slate-300 text-black placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* 2. Desk hours */}
              <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('label_desk_hours')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {deskHourOptions.map((opt) => (
                    <label key={opt.val} className={`text-sm border rounded-sm py-3 px-4 cursor-pointer transition-all text-center ${
                      formData.deskHours === opt.val
                        ? (theme === 'dark' ? 'border-blue-600 text-blue-400 bg-blue-900/10' : 'border-black text-black bg-slate-100')
                        : (theme === 'dark' ? 'border-slate-800 text-slate-500 hover:border-slate-600' : 'border-slate-300 text-slate-500 hover:border-slate-400')
                    }`}>
                      <input type="radio" name="deskHours" value={opt.val} onChange={handleInputChange} className="hidden" />
                      {t(opt.labelKey)}
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Lifts stuck - text */}
              <div className={`space-y-3 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('label_lifts_stuck')}</label>
                <textarea
                  name="liftsStuck"
                  value={formData.liftsStuck}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={t('label_lifts_placeholder')}
                  className={`w-full px-4 py-3 rounded-sm border bg-transparent focus:outline-none focus:border-blue-500 transition-colors ${
                    theme === 'dark' ? 'border-slate-800 text-white placeholder-slate-600' : 'border-slate-300 text-black placeholder-slate-400'
                  }`}
                />
              </div>

              {/* 4. Pain / compensation (multi-select + Other) */}
              <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('label_pain')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {painOptionKeys.map((key) => (
                    <label key={key} className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-sm transition-all ${
                      formData.painCompensation.includes(t(key))
                        ? (theme === 'dark' ? 'border-blue-600 bg-blue-900/10' : 'border-black bg-slate-50')
                        : (theme === 'dark' ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                    }`}>
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                        formData.painCompensation.includes(t(key))
                          ? (theme === 'dark' ? 'bg-blue-600 border-blue-600' : 'bg-black border-black')
                          : (theme === 'dark' ? 'border-slate-600' : 'border-slate-300')
                      }`}>
                        {formData.painCompensation.includes(t(key)) && <Check size={10} className="text-white" />}
                      </div>
                      <input type="checkbox" value={t(key)} onChange={(e) => handleCheckboxChange(e, 'painCompensation')} className="hidden" />
                      <span className={`text-sm ${formData.painCompensation.includes(t(key)) ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-slate-500'}`}>{t(key)}</span>
                    </label>
                  ))}
                  <div className="sm:col-span-2 space-y-2">
                    <label className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-sm transition-all ${
                      formData.painCompensation.includes(t('pain_opt_other'))
                        ? (theme === 'dark' ? 'border-blue-600 bg-blue-900/10' : 'border-black bg-slate-50')
                        : (theme === 'dark' ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                    }`}>
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                        formData.painCompensation.includes(t('pain_opt_other'))
                          ? (theme === 'dark' ? 'bg-blue-600 border-blue-600' : 'bg-black border-black')
                          : (theme === 'dark' ? 'border-slate-600' : 'border-slate-300')
                      }`}>
                        {formData.painCompensation.includes(t('pain_opt_other')) && <Check size={10} className="text-white" />}
                      </div>
                      <input type="checkbox" value={t('pain_opt_other')} onChange={(e) => handleCheckboxChange(e, 'painCompensation')} className="hidden" />
                      <span className={`text-sm ${formData.painCompensation.includes(t('pain_opt_other')) ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-slate-500'}`}>{t('pain_opt_other')}</span>
                    </label>
                    {formData.painCompensation.includes(t('pain_opt_other')) && (
                      <input
                        type="text"
                        name="painOther"
                        value={formData.painOther}
                        onChange={handleInputChange}
                        placeholder={t('other_placeholder')}
                        className={`w-full text-sm px-3 py-2 rounded-sm border bg-transparent focus:outline-none focus:border-blue-500 ${
                          theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Paid to fix */}
              <div className={`space-y-4 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('label_paid_fix')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paidOptions.map((opt) => (
                    <label key={opt.val} className={`flex items-center space-x-3 cursor-pointer p-4 border rounded-sm transition-all ${
                      formData.paidToFix === opt.val
                        ? (theme === 'dark' ? 'border-blue-600 bg-blue-900/10' : 'border-black bg-slate-50')
                        : (theme === 'dark' ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300')
                    }`}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        formData.paidToFix === opt.val ? (theme === 'dark' ? 'border-blue-600' : 'border-black') : (theme === 'dark' ? 'border-slate-600' : 'border-slate-300')
                      }`}>
                        {formData.paidToFix === opt.val && <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-600' : 'bg-black'}`} />}
                      </div>
                      <input type="radio" name="paidToFix" value={opt.val} onChange={handleInputChange} className="hidden" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{t(opt.labelKey)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className={`w-full font-bold py-4 rounded-sm transition-all tracking-widest uppercase flex justify-center items-center gap-2 border ${
                    theme === 'dark' 
                    ? 'bg-white text-black border-white hover:bg-transparent hover:text-white disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-700' 
                    : 'bg-black text-white border-black hover:bg-transparent hover:text-black disabled:bg-slate-300 disabled:text-slate-500 disabled:border-slate-300'
                  }`}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      {t('btn_submitting')}
                    </>
                  ) : (
                    <>
                      {t('btn_submit')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] uppercase tracking-wider text-slate-500 mt-6 flex items-center justify-center gap-2">
                  <Lock size={10} />
                  {t('footer_encrypted')}
                </p>
              </div>

            </form>
          ) : (
            <div className={`p-16 rounded-sm border backdrop-blur-sm text-center ${
              theme === 'dark' ? 'bg-[#111] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 border ${
                theme === 'dark' ? 'border-green-500/30 text-green-500' : 'border-green-600/30 text-green-600'
              }`}>
                <Check size={20} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('success_title')}</h3>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">{t('success_desc')}</p>
              <div className={`py-3 px-6 rounded-sm border inline-block text-left ${
                theme === 'dark' ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest">{t('success_follow')}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t text-xs ${
        theme === 'dark' ? 'bg-[#0a0a0a] border-slate-900 text-slate-600' : 'bg-[#f5f5f7] border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono">
            &copy; 2026 POSTURE.AI. {t('footer_rights')}
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-blue-500 transition-colors">{t('footer_terms')}</a>
            <span className="flex items-center gap-1 cursor-not-allowed opacity-50">
               <Lock size={10} />
               {t('footer_login')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
