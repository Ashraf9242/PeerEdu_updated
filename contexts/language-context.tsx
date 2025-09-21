"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Arabic strings were previously corrupted. Until proper Arabic
// translations are provided, we make Arabic fall back to English
// to avoid displaying garbled text to users.

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.login": "Login",
    "nav.register": "Register",

    // Hero Section
    "hero.subtitle":
      "PeerEdu connects university students with academic excellence. Find expert tutors or share your knowledge while earning - all within a trusted peer-to-peer learning community.",
    "hero.cta.primary": "Get Started",
    "hero.cta.secondary": "Learn More",

    // How It Works Section
    "works.title": "How PeerEdu Works",
    "works.subtitle": "Simple, secure, and effective peer-to-peer learning",
    "works.connect.title": "Connect",
    "works.connect.desc": "Find the perfect tutor or student match based on your academic needs and schedule",
    "works.learn.title": "Learn",
    "works.learn.desc": "Engage in personalized tutoring sessions designed to help you excel in your studies",
    "works.excel.title": "Excel",
    "works.excel.desc": "Achieve your academic goals while building lasting connections with fellow students",

    // Features Section
    "features.title": "Why Choose PeerEdu?",
    "features.subtitle": "Built by students, for students - with features that matter",
    "features.expert.title": "Expert Tutors",
    "features.expert.desc": "Connect with academically excellent students who excel in their subjects",
    "features.flexible.title": "Flexible Scheduling",
    "features.flexible.desc": "Book sessions that fit your schedule with easy-to-use booking system",
    "features.secure.title": "Safe & Secure",
    "features.secure.desc": "Verified student profiles and secure payment system for peace of mind",

    // Mission, Vision, Message
    "message.title": "Our Message",
    "message.content":
      "Education is most powerful when shared. We believe every student has something valuable to teach and learn. PeerEdu creates a community where knowledge flows freely, fostering academic excellence and meaningful connections.",
    "vision.title": "Our Vision",
    "vision.content":
      "To become the leading peer-to-peer learning platform in the Middle East, empowering students to achieve academic excellence through collaborative learning and knowledge sharing.",
    "mission.title": "Our Mission",
    "mission.content":
      "To connect university students across Oman, creating opportunities for peer-to-peer learning, academic support, and personal growth while fostering a culture of knowledge sharing and collaboration.",

    // CEO Section
    "ceo.title": "Meet Our CEO",
    "ceo.subtitle": "Leading the vision for peer-to-peer education in Oman",
    "ceo.name": "Mohammed Ashraf",
    "ceo.position": "Founder & CEO",
    "ceo.bio1":
      "Mohammed holds a Bachelor's degree in Software Application Development from UTAS Ibri College. With a passion for education technology and student empowerment, he founded PeerEdu to bridge the gap between students seeking academic support and those excelling in their studies.",
    "ceo.bio2":
      "His vision is to create a sustainable ecosystem where knowledge sharing becomes a natural part of university life, helping students not only achieve academic success but also develop leadership and mentoring skills that will serve them throughout their careers.",

    // CTA Section
    "cta.title": "Ready to Start Learning?",
    "cta.subtitle":
      "Join thousands of students already using PeerEdu to excel in their studies. Whether you need help or want to help others, we've got you covered.",
    "cta.student": "Join as Student",
    "cta.tutor": "Become a Tutor",

    // Login Page
    "login.title": "Sign In",
    "login.subtitle": "Access your PeerEdu account to continue your learning journey",
    "login.form.title": "Login to your account",
    "login.form.description": "Enter your email and password to access your account",
    "login.email": "University Email",
    "login.password": "Password",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.submit": "Sign In",
    "login.signup.prefix": "Don't have an account",
    "login.signup.link": "Sign up here",

    // Register Page
    "register.title": "Create Account",
    "register.subtitle": "Start your peer learning journey today",
    "register.form.title": "Sign up for PeerEdu",
    "register.form.description": "Create your account to connect with fellow students",
    "register.role.title": "Registering as",
    "register.role.student": "Student",
    "register.role.teacher": "Teacher",
    "register.firstName": "First Name",
    "register.middleName": "Middle Name",
    "register.familyName": "Family Name",
    "register.phone": "Phone Number",
    "register.email": "Educational Email",
    "register.university": "College/University",
    "register.yearOfStudy": "Year of Study",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.uploadId": "Upload Student/Staff ID (optional)",
    "register.terms": "I agree to the Terms and Privacy Policy",
    "register.submit": "Create Account",
    "register.signin.prefix": "Already have an account",
    "register.signin.link": "Sign in here",

    // Placeholders
    "register.placeholder.firstName": "Enter your first name",
    "register.placeholder.middleName": "Enter your middle name (optional)",
    "register.placeholder.familyName": "Enter your family name",
    "register.placeholder.phone": "e.g., +968 9xxxxxxx",
    "register.placeholder.email": "your.name@university.edu",
    "register.placeholder.university": "Select your college/university",
    "register.placeholder.yearOfStudy": "Select your year of study",
    "register.placeholder.password": "Create a strong password",
    "register.placeholder.confirmPassword": "Re-enter your password",

    // University options
    "register.university.squ": "Sultan Qaboos University",
    "register.university.dhofar": "Dhofar University",
    "register.university.german": "German University of Technology in Oman (GUtech)",
    "register.university.muscat": "Muscat University",
    "register.university.nizwa": "University of Nizwa",
    "register.university.oman": "University of Oman",
    "register.university.utas.ibri": "UTAS - Ibri",
    "register.university.utas.muscat": "UTAS - Muscat",
    "register.university.utas.nizwa": "UTAS - Nizwa",
    "register.university.utas.salalah": "UTAS - Salalah",
    "register.university.utas.sohar": "UTAS - Sohar",

    // Year options
    "register.year.foundation1": "Foundation Year 1",
    "register.year.foundation2": "Foundation Year 2",
    "register.year.foundation3": "Foundation Year 3",
    "register.year.foundation4": "Foundation Year 4",
    "register.year.study1": "Study Year 1",
    "register.year.study2": "Study Year 2",
    "register.year.study3": "Study Year 3",
    "register.year.study4": "Study Year 4",
    "register.year.graduate": "Graduate",

    // About page basics
    "about.title": "About PeerEdu",
    "about.subtitle": "Building a student-powered learning community across Oman",
    "about.story.title": "Our Story",
    "about.story.subtitle": "How PeerEdu started and where we're going",
    "about.story.p1": "PeerEdu was founded to make student-to-student tutoring accessible, safe, and effective.",
    "about.story.p2": "We connect learners with excellent peers and create opportunities for sharing knowledge.",
    "about.story.p3": "Our platform focuses on trust, flexibility, and real academic results.",
    "about.foundation.title": "Mission, Vision, and Values",
    "about.foundation.subtitle": "The principles that guide our work",
    "about.mission.title": "Our Mission",
    "about.mission.content": "To connect university students through safe, flexible, and effective peer learning.",
    "about.vision.title": "Our Vision",
    "about.vision.content": "To be the leading peer learning platform in the region.",
    "about.values.title": "Our Values",
    "about.values.content": "Trust, excellence, community, and growth.",
    "about.different.title": "What Makes Us Different",
    "about.different.subtitle": "Why students choose PeerEdu for peer learning",
    "about.peer.title": "Peer-to-Peer Learning",
    "about.peer.desc": "Learn from fellow students who excel in your subjects.",
    "about.flexible.title": "Flexible Scheduling",
    "about.flexible.desc": "Book sessions that fit your time and pace.",
    "about.safe.title": "Safe and Secure",
    "about.safe.desc": "Verified profiles and a trusted environment for learning.",
    "about.expertise.title": "Academic Expertise",
    "about.expertise.desc": "High standards and quality across subjects and levels.",
    "about.results.title": "Real Results",
    "about.results.desc": "Track progress with measurable academic outcomes.",
    "about.growth.title": "Continuous Growth",
    "about.growth.desc": "Build knowledge, confidence, and leadership skills.",
    "about.leadership.title": "Leadership",
    "about.leadership.subtitle": "Guided by a vision for better learning",
    "about.ceo.bio1": "Mohammed leads PeerEdu with a focus on technology, education, and impact.",
    "about.ceo.bio2": "He believes in empowering students to teach, learn, and grow together.",
    "about.ceo.bio3": "PeerEdu aims to make peer learning a natural part of university life.",
    "about.impact.title": "Growing Impact",
    "about.impact.subtitle": "Students, sessions, and subjects served through PeerEdu",
    "about.stats.students": "Students supported",
    "about.stats.sessions": "Tutoring sessions completed",
    "about.stats.subjects": "Subjects covered",
    "about.stats.satisfaction": "Satisfaction rate",
    "about.join.title": "Join the PeerEdu Community",
    "about.join.subtitle": "Become a learner or tutor and help others succeed.",
    "about.join.cta": "Get started",
    "about.join.back": "Back to Home",

    // Footer
    "footer.contact": "Contact",
    "footer.description": "PeerEdu connects students for trusted peer-to-peer learning across Oman.",
    "footer.support": "Support",
    "footer.faq": "FAQ & Help",
    "footer.policy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.rights": "© 2025 PeerEdu. All rights reserved.",
    "footer.followUs": "Follow Us",
  },
  ar: {
    // Navigation
    "nav.home": "الصفحة الرئيسية",
    "nav.about": "من نحن",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",

    // Hero Section
    "hero.subtitle":
      "PeerEdu تربط طلاب الجامعات بالتميز الأكاديمي. اعثر على مدرسين خبراء أو شارك معرفتك مقابل عائد ضمن مجتمع تعلّم موثوق بين الأقران.",
    "hero.cta.primary": "ابدأ الآن",
    "hero.cta.secondary": "اعرف المزيد",

    // How It Works Section
    "works.title": "كيف تعمل PeerEdu",
    "works.subtitle": "تعلّم بين الأقران ببساطة وأمان وفعالية",
    "works.connect.title": "تواصل",
    "works.connect.desc": "ابحث عن المدرّس أو الطالب المناسب حسب احتياجك الأكاديمي ووقتك",
    "works.learn.title": "تعلّم",
    "works.learn.desc": "جلسات خصوصية مخصصة لمساعدتك على التفوق في دراستك",
    "works.excel.title": "تميّز",
    "works.excel.desc": "حقق أهدافك الأكاديمية وابنِ علاقات مع زملائك الطلاب",

    // Features Section
    "features.title": "لماذا PeerEdu؟",
    "features.subtitle": "من الطلاب ولأجل الطلاب – بميزات تحدث فرقًا",
    "features.expert.title": "مدرسون خبراء",
    "features.expert.desc": "تواصل مع طلاب متميزين أكاديميًا في موادهم",
    "features.flexible.title": "جدولة مرنة",
    "features.flexible.desc": "احجز مواعيد تناسب وقتك بسهولة",
    "features.secure.title": "آمن وموثوق",
    "features.secure.desc": "حسابات موثقة ونظام موثوق يمنحك راحة البال",

    // Mission, Vision, Message
    "message.title": "رسالتنا",
    "message.content":
      "التعليم يكون أقوى عندما يُشارك. نؤمن أن لكل طالب قيمة ليعلمها ويتعلّمها. PeerEdu تبني مجتمعًا يشارك المعرفة ويعزز التميز الأكاديمي والروابط الهادفة.",
    "vision.title": "رؤيتنا",
    "vision.content":
      "أن نصبح المنصة الرائدة للتعلّم بين الأقران في الشرق الأوسط، لتمكين الطلاب من التفوق عبر التعلّم التعاوني.",
    "mission.title": "مهمتنا",
    "mission.content":
      "ربط طلاب الجامعات في عُمان وإتاحة فرص للتعلّم بين الأقران، والدعم الأكاديمي، والنمو الشخصي ضمن ثقافة مشاركة المعرفة.",

    // CEO Section
    "ceo.title": "تعرف على المدير التنفيذي",
    "ceo.subtitle": "قيادة رؤية التعلّم بين الأقران في عُمان",
    "ceo.name": "محمد أشرف",
    "ceo.position": "المؤسس والرئيس التنفيذي",
    "ceo.bio1":
      "يحمل محمد درجة البكالوريوس في تطوير تطبيقات البرمجيات من UTAS عبري. بدافع من شغفه بتقنية التعليم وتمكين الطلاب، أسس PeerEdu لردم الفجوة بين من يبحث عن دعم أكاديمي ومن يتفوقون.",
    "ceo.bio2":
      "رؤيته بناء منظومة مستدامة يصبح فيها تبادل المعرفة جزءًا طبيعيًا من الحياة الجامعية، لتنمية النجاح الأكاديمي والمهارات القيادية لدى الطلاب.",

    // CTA Section
    "cta.title": "جاهز للبدء؟",
    "cta.subtitle":
      "انضم إلى آلاف الطلاب الذين يستخدمون PeerEdu للتفوق في دراستهم. سواءً احتجت مساعدة أو رغبت في مساعدة الآخرين، فنحن هنا لأجلك.",
    "cta.student": "انضم كطالب",
    "cta.tutor": "انضم كمدرّس",

    // Login Page
    "login.title": "تسجيل الدخول",
    "login.subtitle": "ادخل إلى حسابك في PeerEdu لمتابعة رحلتك التعليمية",
    "login.form.title": "تسجيل الدخول إلى حسابك",
    "login.form.description": "أدخل بريدك الجامعي وكلمة المرور للوصول إلى حسابك",
    "login.email": "البريد الجامعي",
    "login.password": "كلمة المرور",
    "login.remember": "تذكّرني",
    "login.forgot": "هل نسيت كلمة المرور؟",
    "login.submit": "دخول",
    "login.signup.prefix": "ليس لديك حساب",
    "login.signup.link": "سجّل هنا",

    // Register Page
    "register.title": "إنشاء حساب",
    "register.subtitle": "ابدأ رحلتك في التعلّم بين الأقران",
    "register.form.title": "سجّل في PeerEdu",
    "register.form.description": "أنشئ حسابك للتواصل مع زملائك الطلاب",
    "register.role.title": "التسجيل كـ",
    "register.role.student": "طالب",
    "register.role.teacher": "مدرّس",
    "register.firstName": "الاسم الأول",
    "register.middleName": "الاسم الأوسط",
    "register.familyName": "اسم العائلة",
    "register.phone": "رقم الهاتف",
    "register.email": "البريد التعليمي",
    "register.university": "الجامعة/الكلية",
    "register.yearOfStudy": "السنة الدراسية",
    "register.password": "كلمة المرور",
    "register.confirmPassword": "تأكيد كلمة المرور",
    "register.uploadId": "رفع بطاقة الطالب/الهيئة التدريسية (اختياري)",
    "register.terms": "أوافق على الشروط وسياسة الخصوصية",
    "register.submit": "إنشاء حساب",
    "register.signin.prefix": "لديك حساب بالفعل",
    "register.signin.link": "سجّل الدخول من هنا",

    // Placeholders
    "register.placeholder.firstName": "اكتب الاسم الأول",
    "register.placeholder.middleName": "اكتب الاسم الأوسط (اختياري)",
    "register.placeholder.familyName": "اكتب اسم العائلة",
    "register.placeholder.phone": "مثال: ‎+968 9xxxxxxx",
    "register.placeholder.email": "your.name@university.edu",
    "register.placeholder.university": "اختر الجامعة/الكلية",
    "register.placeholder.yearOfStudy": "اختر السنة الدراسية",
    "register.placeholder.password": "أنشئ كلمة مرور قوية",
    "register.placeholder.confirmPassword": "أعد إدخال كلمة المرور",

    // Universities
    "register.university.squ": "جامعة السلطان قابوس",
    "register.university.dhofar": "جامعة ظفار",
    "register.university.german": "الجامعة الألمانية للتكنولوجيا في عُمان",
    "register.university.muscat": "جامعة مسقط",
    "register.university.nizwa": "جامعة نزوى",
    "register.university.oman": "جامعة عُمان",
    "register.university.utas.ibri": "جامعة التقنية والعلوم التطبيقية - عبري",
    "register.university.utas.muscat": "جامعة التقنية والعلوم التطبيقية - مسقط",
    "register.university.utas.nizwa": "جامعة التقنية والعلوم التطبيقية - نزوى",
    "register.university.utas.salalah": "جامعة التقنية والعلوم التطبيقية - صلالة",
    "register.university.utas.sohar": "جامعة التقنية والعلوم التطبيقية - صحار",

    // Years
    "register.year.foundation1": "السنة التأسيسية 1",
    "register.year.foundation2": "السنة التأسيسية 2",
    "register.year.foundation3": "السنة التأسيسية 3",
    "register.year.foundation4": "السنة التأسيسية 4",
    "register.year.study1": "السنة الدراسية 1",
    "register.year.study2": "السنة الدراسية 2",
    "register.year.study3": "السنة الدراسية 3",
    "register.year.study4": "السنة الدراسية 4",
    "register.year.graduate": "خريج",

    // About page
    "about.title": "عن PeerEdu",
    "about.subtitle": "نُكوّن مجتمع تعلّم يقوده الطلاب عبر عُمان",
    "about.story.title": "قصتنا",
    "about.story.subtitle": "كيف بدأنا وإلى أين نتجه",
    "about.story.p1": "أُسست PeerEdu لجعل الدروس الخصوصية بين الطلاب متاحة وآمنة وفعّالة.",
    "about.story.p2": "نربط المتعلمين بالزملاء المتفوقين ونخلق فرصًا لتبادل المعرفة.",
    "about.story.p3": "تركّز منصتنا على الثقة والمرونة والنتائج الأكاديمية الحقيقية.",
    "about.foundation.title": "المهمة والرؤية والقيم",
    "about.foundation.subtitle": "المبادئ التي توجه عملنا",
    "about.mission.title": "مهمتنا",
    "about.mission.content": "ربط الطلاب في بيئة آمنة ومرنة وفعّالة للتعلّم بين الأقران.",
    "about.vision.title": "رؤيتنا",
    "about.vision.content": "أن نكون المنصة الرائدة للتعلّم بين الأقران في المنطقة.",
    "about.values.title": "قيمنا",
    "about.values.content": "الثقة، التميز، المجتمع، والنمو.",
    "about.different.title": "ما الذي يميزنا",
    "about.different.subtitle": "لماذا يختارنا الطلاب للتعلّم بين الأقران",
    "about.peer.title": "التعلّم بين الأقران",
    "about.peer.desc": "تعلّم من زملاء متفوقين في موادك الدراسية.",
    "about.flexible.title": "مرونة في المواعيد",
    "about.flexible.desc": "احجز جلسات تناسب وقتك وإيقاعك.",
    "about.safe.title": "آمن وموثوق",
    "about.safe.desc": "حسابات موثّقة وبيئة تعلّم موثوقة.",
    "about.expertise.title": "خبرة أكاديمية",
    "about.expertise.desc": "معايير عالية وجودة عبر المواد والمستويات.",
    "about.results.title": "نتائج ملموسة",
    "about.results.desc": "تقدّم قابل للقياس نحو أهدافك الأكاديمية.",
    "about.growth.title": "نمو مستمر",
    "about.growth.desc": "ابنِ المعرفة والثقة ومهارات القيادة.",
    "about.leadership.title": "القيادة",
    "about.leadership.subtitle": "نُقاد برؤية لتعلّم أفضل",
    "about.ceo.bio1": "يقود محمد PeerEdu بركائز التقنية والتعليم والأثر.",
    "about.ceo.bio2": "يؤمن بتمكين الطلاب ليعلّموا ويتعلّموا وينموا معًا.",
    "about.ceo.bio3": "نسعى لأن يصبح التعلّم بين الأقران جزءًا طبيعيًا من الحياة الجامعية.",
    "about.impact.title": "أثرٌ يتوسع",
    "about.impact.subtitle": "طلاب وجلسات ومواد خدمتها PeerEdu",
    "about.stats.students": "طلاب مدعومون",
    "about.stats.sessions": "جلسات دراسية مُنجزة",
    "about.stats.subjects": "مواد دراسية",
    "about.stats.satisfaction": "معدل الرضا",
    "about.join.title": "انضم إلى مجتمع PeerEdu",
    "about.join.subtitle": "كن متعلمًا أو مدرّسًا وساعد الآخرين على النجاح.",
    "about.join.cta": "ابدأ الآن",
    "about.join.back": "العودة للصفحة الرئيسية",

    // Footer
    "footer.contact": "تواصل معنا",
    "footer.description": "PeerEdu تربط الطلاب لتعلّم موثوق بين الأقران في جميع أنحاء عُمان.",
    "footer.support": "الدعم",
    "footer.faq": "الأسئلة الشائعة والدعم",
    "footer.policy": "سياسة الخصوصية",
    "footer.terms": "الشروط والأحكام",
    "footer.rights": "© 2025 PeerEdu. جميع الحقوق محفوظة.",
    "footer.followUs": "تابعنا",
  },
} as const

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("peeredu-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("peeredu-language", lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  const t = (key: string): string => {
    // Prefer selected language; if missing, gracefully fall back to English
    // @ts-expect-error: runtime lookup by key string
    const primary = translations[language][key]
    if (primary != null) return primary
    // @ts-expect-error: runtime lookup by key string
    return translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
