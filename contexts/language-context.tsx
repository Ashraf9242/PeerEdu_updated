"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

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
    "login.email": "Email",
    "login.password": "Password",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.submit": "Sign In",
    "login.signup": "Don't have an account? Sign up here",

    // Register Page
    "register.badge": "Join PeerEdu",
    "register.title": "Create Account",
    "register.subtitle": "Start your peer learning journey today",
    "register.form.title": "Sign up for PeerEdu",
    "register.form.description": "Create your account to connect with fellow students",
    "register.firstName": "First Name",
    "register.lastName": "Last Name",
    "register.email": "Email",
    "register.university": "University",
    "register.major": "Major/Field of Study",
    "register.accountType": "I want to",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.terms": "I agree to the Terms of Service and Privacy Policy",
    "register.submit": "Create Account",
    "register.signin": "Already have an account? Sign in here",
    "register.continue": "Or continue with",
    "register.google": "Google",
    "register.twitter": "Twitter",
    "register.placeholder.firstName": "First name",
    "register.placeholder.lastName": "Last name",
    "register.placeholder.email": "Enter your email",
    "register.placeholder.university": "Select your university",
    "register.placeholder.major": "e.g., Computer Science, Engineering",
    "register.placeholder.accountType": "Choose your primary goal",
    "register.placeholder.password": "Create a password",
    "register.placeholder.confirmPassword": "Confirm your password",
    "register.option.student": "Find tutors and get help",
    "register.option.tutor": "Offer tutoring services",
    "register.option.both": "Both - learn and teach",
    "register.university.utas": "UTAS Ibri College",
    "register.university.squ": "Sultan Qaboos University",
    "register.university.german": "German University of Technology",
    "register.university.nizwa": "University of Nizwa",
    "register.university.dhofar": "Dhofar University",
    "register.university.other": "Other",

    // About Page
    "about.badge": "About PeerEdu",
    "about.title": "Empowering Students Through Peer Learning",
    "about.subtitle":
      "Founded with the belief that the best learning happens when students teach students, PeerEdu is revolutionizing education in Oman by creating meaningful connections between university students.",
    "about.story.title": "Our Story",
    "about.story.subtitle": "How PeerEdu came to life",
    "about.story.p1":
      "PeerEdu was born from a simple observation: university students often struggle to find the right academic support, while many talented students have knowledge to share but lack the platform to do so effectively.",
    "about.story.p2":
      "Our founder, Mohammed Ashraf, experienced this firsthand during his studies in Software Application Development at UTAS Ibri College. He noticed that peer-to-peer learning was not only more relatable and accessible but often more effective than traditional tutoring methods.",
    "about.story.p3":
      "Today, PeerEdu serves as a bridge connecting students across Oman, fostering a community where academic excellence is achieved through collaboration, mutual support, and shared knowledge.",
    "about.foundation.title": "Our Foundation",
    "about.foundation.subtitle": "The principles that guide everything we do",
    "about.mission.title": "Mission",
    "about.mission.content":
      "To connect university students across Oman, creating opportunities for peer-to-peer learning, academic support, and personal growth while fostering a culture of knowledge sharing and collaboration.",
    "about.vision.title": "Vision",
    "about.vision.content":
      "To become the leading peer-to-peer learning platform in the Middle East, empowering students to achieve academic excellence through collaborative learning and knowledge sharing.",
    "about.values.title": "Values",
    "about.values.content":
      "Excellence, collaboration, integrity, and accessibility. We believe education should be inclusive, supportive, and driven by genuine care for student success.",
    "about.different.title": "What Makes Us Different",
    "about.different.subtitle": "Why students choose PeerEdu over traditional tutoring",
    "about.peer.title": "Peer-to-Peer Connection",
    "about.peer.desc": "Learn from fellow students who recently mastered the same concepts you're struggling with",
    "about.flexible.title": "Flexible & Affordable",
    "about.flexible.desc": "More affordable than professional tutoring with scheduling that works around student life",
    "about.safe.title": "Safe & Verified",
    "about.safe.desc": "All tutors are verified university students with proven academic excellence",
    "about.expertise.title": "Subject Expertise",
    "about.expertise.desc": "Find tutors who excel in your specific courses and understand your curriculum",
    "about.results.title": "Proven Results",
    "about.results.desc": "Students report improved grades and better understanding through peer learning",
    "about.growth.title": "Mutual Growth",
    "about.growth.desc": "Both tutors and students benefit - learn while earning, teach while reinforcing knowledge",
    "about.leadership.title": "Leadership",
    "about.leadership.subtitle": "Meet the team behind PeerEdu",
    "about.ceo.bio1":
      "Mohammed holds a Bachelor's degree in Software Application Development from UTAS Ibri College. His academic journey sparked the idea for PeerEdu when he realized the untapped potential of peer-to-peer learning in university settings.",
    "about.ceo.bio2":
      "With a deep understanding of both technology and education, Mohammed combines his technical expertise with his passion for student empowerment to create innovative solutions that make learning more accessible and effective.",
    "about.ceo.bio3":
      "His vision extends beyond just connecting students - he aims to build a sustainable ecosystem where knowledge sharing becomes an integral part of university culture, preparing students not just for academic success but for lifelong learning and leadership.",
    "about.impact.title": "Our Impact",
    "about.impact.subtitle": "Growing community of students helping students succeed",
    "about.stats.students": "Active Students",
    "about.stats.sessions": "Sessions Completed",
    "about.stats.subjects": "Subjects Covered",
    "about.stats.satisfaction": "Satisfaction Rate",
    "about.join.title": "Join Our Community",
    "about.join.subtitle":
      "Be part of the peer learning revolution. Whether you need help or want to help others, PeerEdu is your platform for academic success.",
    "about.join.cta": "Get Started Today",
    "about.join.back": "Back to Home",

    // Footer
    "footer.contact": "Contact Us",
    "footer.support": "Support",
    "footer.faq": "FAQ",
    "footer.policy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "© 2025 PeerEdu. All rights reserved.",
    "footer.followUs": "Follow Us",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",

    // Hero Section
    "hero.subtitle":
      "بير إيدو يربط طلاب الجامعات مع بعضهم البعض للتعلم من الأقران والتميز الأكاديمي. ابحث عن مدرسين خبراء أو شارك معرفتك مع الكسب - كل ذلك ضمن مجتمع تعليمي موثوق بين الأقران.",
    "hero.cta.primary": "ابدأ الآن",
    "hero.cta.secondary": "اعرف المزيد",

    // How It Works Section
    "works.title": "كيف يعمل بير إيدو",
    "works.subtitle": "بسيط وآمن وفعال للتعلم بين الأقران",
    "works.connect.title": "تواصل",
    "works.connect.desc": "ابحث عن المدرس أو الطالب المثالي بناءً على احتياجاتك الأكاديمية وجدولك الزمني",
    "works.learn.title": "تعلم",
    "works.learn.desc": "شارك في جلسات تدريس شخصية مصممة لمساعدتك على التفوق في دراستك",
    "works.excel.title": "تفوق",
    "works.excel.desc": "حقق أهدافك الأكاديمية مع بناء علاقات دائمة مع زملائك الطلاب",

    // Features Section
    "features.title": "لماذا تختار بير إيدو؟",
    "features.subtitle": "مبني من قبل الطلاب، للطلاب - بميزات مهمة",
    "features.expert.title": "مدرسون خبراء",
    "features.expert.desc": "تواصل مع الطلاب المتميزين أكاديمياً والذين يتفوقون في مواضيعهم",
    "features.flexible.title": "جدولة مرنة",
    "features.flexible.desc": "احجز جلسات تناسب جدولك الزمني مع نظام حجز سهل الاستخدام",
    "features.secure.title": "آمن ومحمي",
    "features.secure.desc": "ملفات طلابية موثقة ونظام دفع آمن لراحة البال",

    // Mission, Vision, Message
    "message.title": "رسالتنا",
    "message.content":
      "التعليم أقوى عندما يُشارك. نؤمن أن كل طالب لديه شيء قيم ليعلمه ويتعلمه. بير إيدو ينشئ مجتمعاً حيث تتدفق المعرفة بحرية، مما يعزز التميز الأكاديمي والروابط المعنوية.",
    "vision.title": "رؤيتنا",
    "vision.content":
      "أن نصبح منصة التعلم الرائدة بين الأقران في الشرق الأوسط، نمكن الطلاب من تحقيق التميز الأكاديمي من خلال التعلم التعاوني ومشاركة المعرفة.",
    "mission.title": "مهمتنا",
    "mission.content":
      "ربط طلاب الجامعات في جميع أنحاء عُمان، وخلق فرص للتعلم بين الأقران والدعم الأكاديمي والنمو الشخصي مع تعزيز ثقافة مشاركة المعرفة والتعاون.",

    // CEO Section
    "ceo.title": "تعرف على الرئيس التنفيذي",
    "ceo.subtitle": "قيادة الرؤية للتعليم بين الأقران في عُمان",
    "ceo.name": "محمد أشرف",
    "ceo.position": "المؤسس والرئيس التنفيذي",
    "ceo.bio1":
      "محمد حاصل على درجة البكالوريوس في تطوير تطبيقات البرمجيات من كلية يوتاس عبري. بشغف لتكنولوجيا التعليم وتمكين الطلاب، أسس بير إيدو لسد الفجوة بين الطلاب الذين يسعون للدعم الأكاديمي وأولئك المتفوقين في دراستهم.",
    "ceo.bio2":
      "رؤيته هي إنشاء نظام بيئي مستدام حيث تصبح مشاركة المعرفة جزءاً طبيعياً من الحياة الجامعية، مما يساعد الطلاب ليس فقط على تحقيق النجاح الأكاديمي ولكن أيضاً تطوير مهارات القيادة والإرشاد التي ستخدمهم طوال حياتهم المهنية.",

    // CTA Section
    "cta.title": "مستعد لبدء التعلم؟",
    "cta.subtitle":
      "انضم إلى آلاف الطلاب الذين يستخدمون بير إيدو بالفعل للتفوق في دراستهم. سواء كنت تحتاج مساعدة أو تريد مساعدة الآخرين، نحن نغطيك.",
    "cta.student": "انضم كطالب",
    "cta.tutor": "كن مدرساً",

    // Login Page
    "login.title": "تسجيل الدخول",
    "login.subtitle": "ادخل إلى حسابك في بير إيدو لمتابعة رحلة التعلم",
    "login.form.title": "تسجيل الدخول إلى حسابك",
    "login.form.description": "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.remember": "تذكرني",
    "login.forgot": "نسيت كلمة المرور؟",
    "login.submit": "تسجيل الدخول",
    "login.signup": "ليس لديك حساب؟ أنشئ حساباً هنا",

    // Register Page
    "register.badge": "انضم إلى بير إيدو",
    "register.title": "إنشاء حساب",
    "register.subtitle": "ابدأ رحلة التعلم بين الأقران اليوم",
    "register.form.title": "التسجيل في بير إيدو",
    "register.form.description": "أنشئ حسابك للتواصل مع زملائك الطلاب",
    "register.firstName": "الاسم الأول",
    "register.lastName": "اسم العائلة",
    "register.email": "البريد الإلكتروني",
    "register.university": "الجامعة",
    "register.major": "التخصص/مجال الدراسة",
    "register.accountType": "أريد أن",
    "register.password": "كلمة المرور",
    "register.confirmPassword": "تأكيد كلمة المرور",
    "register.terms": "أوافق على شروط الخدمة وسياسة الخصوصية",
    "register.submit": "إنشاء حساب",
    "register.signin": "لديك حساب بالفعل؟ سجل دخولك هنا",
    "register.continue": "أو تابع مع",
    "register.google": "جوجل",
    "register.twitter": "تويتر",
    "register.placeholder.firstName": "الاسم الأول",
    "register.placeholder.lastName": "اسم العائلة",
    "register.placeholder.email": "أدخل بريدك الإلكتروني",
    "register.placeholder.university": "اختر جامعتك",
    "register.placeholder.major": "مثال: علوم الحاسوب، الهندسة",
    "register.placeholder.accountType": "اختر هدفك الأساسي",
    "register.placeholder.password": "أنشئ كلمة مرور",
    "register.placeholder.confirmPassword": "أكد كلمة المرور",
    "register.option.student": "العثور على مدرسين والحصول على المساعدة",
    "register.option.tutor": "تقديم خدمات التدريس",
    "register.option.both": "كلاهما - تعلم وعلم",
    "register.university.utas": "كلية يوتاس عبري",
    "register.university.squ": "جامعة السلطان قابوس",
    "register.university.german": "الجامعة الألمانية للتكنولوجيا",
    "register.university.nizwa": "جامعة نزوى",
    "register.university.dhofar": "جامعة ظفار",
    "register.university.other": "أخرى",

    // About Page
    "about.badge": "حول بير إيدو",
    "about.title": "تمكين الطلاب من خلال التعلم بين الأقران",
    "about.subtitle":
      "تأسست بالإيمان أن أفضل تعلم يحدث عندما يعلم الطلاب الطلاب، بير إيدو تثور التعليم في عُمان من خلال إنشاء روابط معنوية بين طلاب الجامعات.",
    "about.story.title": "قصتنا",
    "about.story.subtitle": "كيف وُلد بير إيدو",
    "about.story.p1":
      "وُلد بير إيدو من ملاحظة بسيطة: طلاب الجامعات غالباً ما يكافحون للعثور على الدعم الأكاديمي المناسب، بينما العديد من الطلاب الموهوبين لديهم معرفة لمشاركتها لكن يفتقرون إلى المنصة للقيام بذلك بفعالية.",
    "about.story.p2":
      "مؤسسنا، محمد أشرف، عاش هذا بنفسه خلال دراسته في تطوير تطبيقات البرمجيات في كلية يوتاس عبري. لاحظ أن التعلم بين الأقران لم يكن فقط أكثر قابلية للفهم وإمكانية الوصول ولكن غالباً أكثر فعالية من طرق التدريس التقليدية.",
    "about.story.p3":
      "اليوم، بير إيدو يعمل كجسر يربط الطلاب في جميع أنحاء عُمان، مما يعزز مجتمعاً حيث يتحقق التميز الأكاديمي من خلال التعاون والدعم المتبادل والمعرفة المشتركة.",
    "about.foundation.title": "أساسنا",
    "about.foundation.subtitle": "المبادئ التي توجه كل ما نقوم به",
    "about.mission.title": "المهمة",
    "about.mission.content":
      "ربط طلاب الجامعات في جميع أنحاء عُمان، وخلق فرص للتعلم بين الأقران والدعم الأكاديمي والنمو الشخصي مع تعزيز ثقافة مشاركة المعرفة والتعاون.",
    "about.vision.title": "الرؤية",
    "about.vision.content":
      "أن نصبح منصة التعلم الرائدة بين الأقران في الشرق الأوسط، نمكن الطلاب من تحقيق التميز الأكاديمي من خلال التعلم التعاوني ومشاركة المعرفة.",
    "about.values.title": "القيم",
    "about.values.content":
      "التميز والتعاون والنزاهة وإمكانية الوصول. نؤمن أن التعليم يجب أن يكون شاملاً وداعماً ومدفوعاً بالاهتمام الحقيقي بنجاح الطلاب.",
    "about.different.title": "ما يجعلنا مختلفين",
    "about.different.subtitle": "لماذا يختار الطلاب بير إيدو على التدريس التقليدي",
    "about.peer.title": "التواصل بين الأقران",
    "about.peer.desc": "تعلم من زملائك الطلاب الذين أتقنوا مؤخراً نفس المفاهيم التي تكافح معها",
    "about.flexible.title": "مرن وبأسعار معقولة",
    "about.flexible.desc": "أكثر بأسعار معقولة من التدريس المهني مع جدولة تعمل حول حياة الطلاب",
    "about.safe.title": "آمن وموثق",
    "about.safe.desc": "جميع المدرسين طلاب جامعيون موثقون بتميز أكاديمي مثبت",
    "about.expertise.title": "خبرة في المواضيع",
    "about.expertise.desc": "ابحث عن مدرسين يتفوقون في مقرراتك المحددة ويفهمون منهجك",
    "about.results.title": "نتائج مثبتة",
    "about.results.desc": "الطلاب يبلغون عن تحسن في الدرجات وفهم أفضل من خلال التعلم بين الأقران",
    "about.growth.title": "نمو متبادل",
    "about.growth.desc": "كل من المدرسين والطلاب يستفيدون - تعلم مع الكسب، علم مع تعزيز المعرفة",
    "about.leadership.title": "القيادة",
    "about.leadership.subtitle": "تعرف على الفريق وراء بير إيدو",
    "about.ceo.bio1":
      "محمد حاصل على درجة البكالوريوس في تطوير تطبيقات البرمجيات من كلية يوتاس عبري. رحلته الأكاديمية أشعلت فكرة بير إيدو عندما أدرك الإمكانات غير المستغلة للتعلم بين الأقران في البيئات الجامعية.",
    "about.ceo.bio2":
      "بفهم عميق لكل من التكنولوجيا والتعليم، محمد يجمع خبرته التقنية مع شغفه لتمكين الطلاب لإنشاء حلول مبتكرة تجعل التعلم أكثر إمكانية وفعالية.",
    "about.ceo.bio3":
      "رؤيته تمتد إلى ما هو أبعد من مجرد ربط الطلاب - يهدف إلى بناء نظام بيئي مستدام حيث تصبح مشاركة المعرفة جزءاً لا يتجزأ من الثقافة الجامعية، إعداد الطلاب ليس فقط للنجاح الأكاديمي ولكن للتعلم مدى الحياة والقيادة.",
    "about.impact.title": "تأثيرنا",
    "about.impact.subtitle": "مجتمع متنامي من الطلاب يساعدون الطلاب على النجاح",
    "about.stats.students": "طلاب نشطون",
    "about.stats.sessions": "جلسات مكتملة",
    "about.stats.subjects": "مواضيع مغطاة",
    "about.stats.satisfaction": "معدل الرضا",
    "about.join.title": "انضم إلى مجتمعنا",
    "about.join.subtitle":
      "كن جزءاً من ثورة التعلم بين الأقران. سواء كنت تحتاج مساعدة أو تريد مساعدة الآخرين، بير إيدو هو منصتك للنجاح الأكاديمي.",
    "about.join.cta": "ابدأ اليوم",
    "about.join.back": "العودة للرئيسية",

    // Footer
    "footer.contact": "اتصل بنا",
    "footer.support": "الدعم",
    "footer.faq": "الأسئلة الشائعة",
    "footer.policy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.rights": "© 2025 بير إيدو. جميع الحقوق محفوظة.",
    "footer.followUs": "تابعنا",
  },
}

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
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
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
