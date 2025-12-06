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
    "hero.title": "Connect. Learn. Excel.",
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
    "login.loading": "Signing you in...",
    "login.signup": "Don't have an account? Sign up here",

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
    "register.terms": "I agree to the Terms of Service and Privacy Policy",
    "register.submit": "Register",
    "register.loading": "Creating your account...",
    "register.signin": "Already have an account? Sign in here",
    "register.continue": "Or continue with",
    "register.google": "Google",
    "register.twitter": "Twitter",
    "register.placeholder.firstName": "First name",
    "register.placeholder.middleName": "Middle name",
    "register.placeholder.familyName": "Family name",
    "register.placeholder.phone": "+968",
    "register.placeholder.email": "Enter your educational email",
    "register.placeholder.university": "Select your college/university",
    "register.placeholder.yearOfStudy": "Select your year of study",
    "register.placeholder.password": "Create a password",
    "register.placeholder.confirmPassword": "Confirm your password",
    "register.university.utas": "UTAS Ibri",
    "register.university.squ": "Sultan Qaboos University",
    "register.university.german": "German University of Technology",
    "register.university.nizwa": "University of Nizwa",
    "register.university.dhofar": "Dhofar University",
    "register.university.muscat": "Muscat University",
    "register.university.utas.muscat": "UTAS Muscat",
    "register.university.utas.sohar": "UTAS Sohar",
    "register.university.utas.salalah": "UTAS Salalah",
    "register.university.utas.nizwa": "UTAS Nizwa",
    "register.university.other": "Other",
    "register.year.foundation1": "Foundation Level 1",
    "register.year.foundation2": "Foundation Level 2",
    "register.year.foundation3": "Foundation Level 3",
    "register.year.foundation4": "Foundation Level 4",
    "register.year.study1": "Year 1",
    "register.year.study2": "Year 2",
    "register.year.study3": "Year 3",
    "register.year.study4": "Year 4",
    "register.year.graduate": "Fresh Graduate",

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
    "footer.description": "Connecting university students for peer-to-peer learning and academic excellence.",
    "footer.support": "Support",
    "footer.faq": "FAQ",
    "footer.policy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "© 2025 PeerEdu. All rights reserved.",
    "footer.followUs": "Follow Us",

    // Forgot Password Page
    "forgotPassword.title": "Forgot Password",
    "forgotPassword.subtitle": "Enter your email to receive a reset link",
    "forgotPassword.email": "Email",
    "forgotPassword.submit": "Send Reset Link",
    "forgotPassword.loading": "Sending...",
    "forgotPassword.success.title": "Check Your Email",
    "forgotPassword.success.message":
      "A password reset link has been sent to your email address. Please check your inbox.",
    "forgotPassword.backToLogin": "Back to Login",

    // Reset Password Page
    "resetPassword.title": "Reset Your Password",
    "resetPassword.subtitle": "Create a new, strong password for your account.",
    "resetPassword.password": "New Password",
    "resetPassword.confirmPassword": "Confirm New Password",
    "resetPassword.submit": "Set New Password",
    "resetPassword.loading": "Resetting...",
    "resetPassword.success.title": "Password Reset!",
    "resetPassword.success.message":
      "Your password has been changed successfully. You can now log in.",
    "resetPassword.goToLogin": "Go to Login",
    "resetPassword.invalid.title": "Invalid Link",
    "resetPassword.invalid.message":
      "This password reset link is invalid or has expired. Please request a new one.",
    "resetPassword.invalid.requestNew": "Request New Link",
    "resetPassword.strength.weak": "Weak",
    "resetPassword.strength.medium": "Medium",
    "resetPassword.strength.strong": "Strong",
    "resetPassword.error.mismatch": "Passwords do not match",
    "resetPassword.error.length": "Password must be at least 8 characters",
    "resetPassword.error.case": "Must contain an uppercase letter",
    "resetPassword.error.number": "Must contain a number",
    "resetPassword.error.special": "Must contain a special character",

    // Password Changed Email
    "passwordChanged.subject": "Your PeerEdu Password Has Been Changed",
    "passwordChanged.title": "Password Changed Successfully",
    "passwordChanged.greeting": "Hi {name},",
    "passwordChanged.message":
      "This email confirms that the password for your PeerEdu account has been successfully changed.",
    "passwordChanged.warning":
      "If you were not the one who made this change, please contact our support team immediately to secure your account.",
    "passwordChanged.contactSupport": "Contact Support",

    // Admin Dashboard
    "admin.dashboard.title": "Admin Dashboard",
    "admin.dashboard.subtitle": "Overview of the PeerEdu platform.",
    "admin.stats.totalUsers": "Total Users",
    "admin.stats.students": "Students",
    "admin.stats.teachers": "Teachers",
    "admin.stats.admins": "Admins",
    "admin.stats.approvedTutors": "Approved Tutors",
    "admin.stats.pendingTutors": "Pending Tutors",
    "admin.stats.totalBookings": "Total Bookings",
    "admin.stats.pending": "Pending",
    "admin.stats.confirmed": "Confirmed",
    "admin.stats.completed": "Completed",
    "admin.stats.cancelled": "Cancelled",
    "admin.stats.totalRevenue": "Total Revenue",
    "admin.stats.userGrowth": "User Growth (30d)",
    "admin.pendingApprovals.title": "Pending Teacher Approvals",
    "admin.pendingApprovals.tutor": "Tutor",
    "admin.pendingApprovals.university": "University",
    "admin.pendingApprovals.subjects": "Subjects",
    "admin.pendingApprovals.rate": "Rate",
    "admin.pendingApprovals.registered": "Registered",
    "admin.pendingApprovals.actions": "Actions",
    "admin.pendingApprovals.viewProfile": "View Full Profile",
    "admin.pendingApprovals.approve": "Approve",
    "admin.pendingApprovals.reject": "Reject",
    "admin.recentUsers.title": "Recent Users",
    "admin.recentUsers.name": "Name",
    "admin.recentUsers.email": "Email",
    "admin.recentUsers.role": "Role",
    "admin.recentUsers.joined": "Joined",
    "admin.recentBookings.title": "Recent Bookings",
    "admin.recentBookings.student": "Student",
    "admin.recentBookings.tutor": "Tutor",
    "admin.recentBookings.status": "Status",
    "admin.recentBookings.date": "Date",
    "admin.charts.userGrowthTitle": "New Users (Last 30 Days)",
    "admin.charts.bookingsStatusTitle": "Bookings by Status",
    "admin.charts.revenueTitle": "Revenue (Last 7 Days)",
    "admin.quickActions.title": "Quick Actions",
    "admin.quickActions.manageUsers": "Manage Users",
    "admin.quickActions.manageTutors": "Manage Tutors",
    "admin.quickActions.allBookings": "All Bookings",
    "admin.quickActions.reports": "Reports",
    "admin.quickActions.settings": "Settings",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",

    // Hero Section
    "hero.subtitle":
      "PeerEdu يربط طلاب الجامعات مع بعضهم البعض للتعلم من الأقران والتميز الأكاديمي. ابحث عن مدرسين خبراء أو شارك معرفتك مع الكسب - كل ذلك ضمن مجتمع تعليمي موثوق بين الأقران.",
    "hero.cta.primary": "ابدأ الآن",
    "hero.cta.secondary": "اعرف المزيد",

    // How It Works Section
    "works.title": "كيف يعمل PeerEdu",
    "works.subtitle": "بسيط وآمن وفعال للتعلم بين الأقران",
    "works.connect.title": "تواصل",
    "works.connect.desc": "ابحث عن المدرس أو الطالب المثالي بناءً على احتياجاتك الأكاديمية وجدولك الزمني",
    "works.learn.title": "تعلم",
    "works.learn.desc": "شارك في جلسات تدريس شخصية مصممة لمساعدتك على التفوق في دراستك",
    "works.excel.title": "تفوق",
    "works.excel.desc": "حقق أهدافك الأكاديمية مع بناء علاقات دائمة مع زملائك الطلاب",

    // Features Section
    "features.title": "لماذا تختار PeerEdu؟",
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
      "التعليم أقوى عندما يُشارك. نؤمن أن كل طالب لديه شيء قيم ليعلمه ويتعلمه. PeerEdu ينشئ مجتمعاً حيث تتدفق المعرفة بحرية، مما يعزز التميز الأكاديمي والروابط المعنوية.",
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
      "محمد حاصل على درجة البكالوريوس في تطوير تطبيقات البرمجيات من كلية يوتاس عبري. بشغف لتكنولوجيا التعليم وتمكين الطلاب، أسس PeerEdu لسد الفجوة بين الطلاب الذين يسعون للدعم الأكاديمي وأولئك المتفوقين في دراستهم.",
    "ceo.bio2":
      "رؤيته هي إنشاء نظام بيئي مستدام حيث تصبح مشاركة المعرفة جزءاً طبيعياً من الحياة الجامعية، مما يساعد الطلاب ليس فقط على تحقيق النجاح الأكاديمي ولكن أيضاً تطوير مهارات القيادة والإرشاد التي ستخدمهم طوال حياتهم المهنية.",

    // CTA Section
    "cta.title": "مستعد لبدء التعلم؟",
    "cta.subtitle":
      "انضم إلى آلاف الطلاب الذين يستخدمون PeerEdu بالفعل للتفوق في دراستهم. سواء كنت تحتاج مساعدة أو تريد مساعدة الآخرين، نحن نغطيك.",
    "cta.student": "انضم كطالب",
    "cta.tutor": "كن مدرساً",

    // Login Page
    "login.title": "تسجيل الدخول",
    "login.subtitle": "ادخل إلى حسابك في PeerEdu لمتابعة رحلة التعلم",
    "login.form.title": "تسجيل الدخول إلى حسابك",
    "login.form.description": "أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك",
    "login.email": "البريد الجامعي",
    "login.password": "كلمة المرور",
    "login.remember": "تذكرني",
    "login.forgot": "نسيت كلمة المرور؟",
    "login.submit": "تسجيل الدخول",
    "login.loading": "جارٍ تسجيل الدخول...",
    "login.signup": "ليس لديك حساب؟ أنشئ حساباً هنا",

    // Register Page
    "register.title": "إنشاء حساب",
    "register.subtitle": "ابدأ رحلة التعلم بين الأقران اليوم",
    "register.form.title": "التسجيل في PeerEdu",
    "register.form.description": "أنشئ حسابك للتواصل مع زملائك الطلاب",
    "register.role.title": "التسجيل كـ",
    "register.role.student": "طالب",
    "register.role.teacher": "مدرس",
    "register.firstName": "الاسم الأول",
    "register.middleName": "الاسم الأوسط",
    "register.familyName": "اسم العائلة",
    "register.phone": "رقم الهاتف",
    "register.email": "البريد الإلكتروني التعليمي",
    "register.university": "الكلية/الجامعة",
    "register.yearOfStudy": "سنة الدراسة",
    "register.password": "كلمة المرور",
    "register.confirmPassword": "تأكيد كلمة المرور",
    "register.terms": "أوافق على شروط الخدمة وسياسة الخصوصية",
    "register.submit": "تسجيل",
    "register.loading": "جارٍ إنشاء الحساب...",
    "register.signin": "لديك حساب بالفعل؟ سجل دخولك هنا",
    "register.continue": "أو تابع مع",
    "register.google": "جوجل",
    "register.twitter": "تويتر",
    "register.placeholder.firstName": "الاسم الأول",
    "register.placeholder.middleName": "الاسم الأوسط",
    "register.placeholder.familyName": "اسم العائلة",
    "register.placeholder.phone": "+968",
    "register.placeholder.email": "أدخل بريدك الإلكتروني التعليمي",
    "register.placeholder.university": "اختر كليتك/جامعتك",
    "register.placeholder.yearOfStudy": "اختر سنة دراستك",
    "register.placeholder.password": "أنشئ كلمة مرور",
    "register.placeholder.confirmPassword": "أكد كلمة المرور",
    "register.university.utas": "يوتاس عبري",
    "register.university.squ": "جامعة السلطان قابوس",
    "register.university.german": "الجامعة الألمانية للتكنولوجيا",
    "register.university.nizwa": "جامعة نزوى",
    "register.university.dhofar": "جامعة ظفار",
    "register.university.muscat": "جامعة مسقط",
    "register.university.utas.muscat": "يوتاس مسقط",
    "register.university.utas.sohar": "يوتاس صحار",
    "register.university.utas.salalah": "يوتاس صلالة",
    "register.university.utas.nizwa": "يوتاس نزوى",
    "register.year.foundation1": "المستوى التأسيسي الأول",
    "register.year.foundation2": "المستوى التأسيسي الثاني",
    "register.year.foundation3": "المستوى التأسيسي الثالث",
    "register.year.foundation4": "المستوى التأسيسي الرابع",
    "register.year.study1": "السنة الأولى",
    "register.year.study2": "السنة الثانية",
    "register.year.study3": "السنة الثالثة",
    "register.year.study4": "السنة الرابعة",
    "register.year.graduate": "خريج جديد",

    // About Page
    "about.title": "تمكين الطلاب من خلال التعلم بين الأقران",
    "about.subtitle":
      "تأسست بالإيمان أن أفضل تعلم يحدث عندما يعلم الطلاب الطلاب، PeerEdu تثور التعليم في عُمان من خلال إنشاء روابط معنوية بين طلاب الجامعات.",
    "about.story.title": "قصتنا",
    "about.story.subtitle": "كيف وُلد PeerEdu",
    "about.story.p1":
      "وُلد PeerEdu من ملاحظة بسيطة: طلاب الجامعات غالباً ما يكافحون للعثور على الدعم الأكاديمي المناسب، بينما العديد من الطلاب الموهوبين لديهم معرفة لمشاركتها لكن يفتقرون إلى المنصة للقيام بذلك بفعالية.",
    "about.story.p2":
      "مؤسسنا، محمد أشرف، عاش هذا بنفسه خلال دراسته في تطوير تطبيقات البرمجيات في كلية يوتاس عبري. لاحظ أن التعلم بين الأقران لم يكن فقط أكثر قابلية للفهم وإمكانية الوصول ولكن غالباً أكثر فعالية من طرق التدريس التقليدية.",
    "about.story.p3":
      "اليوم، PeerEdu يعمل كجسر يربط الطلاب في جميع أنحاء عُمان، مما يعزز مجتمعاً حيث يتحقق التميز الأكاديمي من خلال التعاون والدعم المتبادل والمعرفة المشتركة.",
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
    "about.different.subtitle": "لماذا يختار الطلاب PeerEdu على التدريس التقليدي",
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
    "about.leadership.subtitle": "تعرف على الفريق وراء PeerEdu",
    "about.ceo.bio1":
      "محمد حاصل على درجة البكالوريوس في تطوير تطبيقات البرمجيات من كلية يوتاس عبري. رحلته الأكاديمية أشعلت فكرة PeerEdu عندما أدرك الإمكانات غير المستغلة للتعلم بين الأقران في البيئات الجامعية.",
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
      "كن جزءاً من ثورة التعلم بين الأقران. سواء كنت تحتاج مساعدة أو تريد مساعدة الآخرين، PeerEdu هو منصتك للنجاح الأكاديمي.",
    "about.join.cta": "ابدأ اليوم",
    "about.join.back": "العودة للرئيسية",

    // Footer
    "footer.contact": "اتصل بنا",
    "footer.description": "ربط طلاب الجامعات للتعلم بين الأقران والتميز الأكاديمي.",
    "footer.support": "الدعم",
    "footer.faq": "الأسئلة الشائعة",
    "footer.policy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.rights": "© 2025 PeerEdu. جميع الحقوق محفوظة.",
    "footer.followUs": "تابعنا",

    // Forgot Password Page
    "forgotPassword.title": "نسيت كلمة المرور",
    "forgotPassword.subtitle": "أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين",
    "forgotPassword.email": "البريد الإلكتروني",
    "forgotPassword.submit": "إرسال رابط إعادة التعيين",
    "forgotPassword.loading": "جار الإرسال...",
    "forgotPassword.success.title": "تحقق من بريدك الإلكتروني",
    "forgotPassword.success.message":
      "تم إرسال رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.",
    "forgotPassword.backToLogin": "العودة إلى تسجيل الدخول",

    // Reset Password Page
    "resetPassword.title": "إعادة تعيين كلمة المرور",
    "resetPassword.subtitle": "أنشئ كلمة مرور جديدة وقوية لحسابك.",
    "resetPassword.password": "كلمة المرور الجديدة",
    "resetPassword.confirmPassword": "تأكيد كلمة المرور الجديدة",
    "resetPassword.submit": "تعيين كلمة المرور الجديدة",
    "resetPassword.loading": "جار الإعادة...",
    "resetPassword.success.title": "تم إعادة تعيين كلمة المرور!",
    "resetPassword.success.message":
      "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
    "resetPassword.goToLogin": "الذهاب إلى تسجيل الدخول",
    "resetPassword.invalid.title": "رابط غير صالح",
    "resetPassword.invalid.message":
      "رابط إعادة تعيين كلمة المرور هذا غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.",
    "resetPassword.invalid.requestNew": "طلب رابط جديد",
    "resetPassword.strength.weak": "ضعيف",
    "resetPassword.strength.medium": "متوسط",
    "resetPassword.strength.strong": "قوي",
    "resetPassword.error.mismatch": "كلمتا المرور غير متطابقتين",
    "resetPassword.error.length": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    "resetPassword.error.case": "يجب أن تحتوي على حرف كبير واحد على الأقل",
    "resetPassword.error.number": "يجب أن تحتوي على رقم واحد على الأقل",
    "resetPassword.error.special": "يجب أن تحتوي على رمز خاص واحد على الأقل",

    // Password Changed Email
    "passwordChanged.subject": "تم تغيير كلمة المرور الخاصة بك في PeerEdu",
    "passwordChanged.title": "تم تغيير كلمة المرور بنجاح",
    "passwordChanged.greeting": "مرحباً {name}،",
    "passwordChanged.message":
      "هذا البريد الإلكتروني يؤكد أنه تم تغيير كلمة المرور لحسابك في PeerEdu بنجاح.",
    "passwordChanged.warning":
      "إذا لم تكن أنت من قام بهذا التغيير، يرجى الاتصال بفريق الدعم لدينا على الفور لتأمين حسابك.",
    "passwordChanged.contactSupport": "اتصل بالدعم",

    // Admin Dashboard
    "admin.dashboard.title": "لوحة تحكم المشرف",
    "admin.dashboard.subtitle": "نظرة عامة على منصة PeerEdu.",
    "admin.stats.totalUsers": "إجمالي المستخدمين",
    "admin.stats.students": "طلاب",
    "admin.stats.teachers": "معلمون",
    "admin.stats.admins": "مشرفون",
    "admin.stats.approvedTutors": "المعلمون المعتمدون",
    "admin.stats.pendingTutors": "المعلمون المعلقون",
    "admin.stats.totalBookings": "إجمالي الحجوزات",
    "admin.stats.pending": "معلقة",
    "admin.stats.confirmed": "مؤكدة",
    "admin.stats.completed": "مكتملة",
    "admin.stats.cancelled": "ملغاة",
    "admin.stats.totalRevenue": "إجمالي الإيرادات",
    "admin.stats.userGrowth": "نمو المستخدمين (30 يوم)",
    "admin.pendingApprovals.title": "طلبات المعلمين المعلقة",
    "admin.pendingApprovals.tutor": "المعلم",
    "admin.pendingApprovals.university": "الجامعة",
    "admin.pendingApprovals.subjects": "التخصصات",
    "admin.pendingApprovals.rate": "السعر",
    "admin.pendingApprovals.registered": "تاريخ التسجيل",
    "admin.pendingApprovals.actions": "الإجراءات",
    "admin.pendingApprovals.viewProfile": "عرض الملف الكامل",
    "admin.pendingApprovals.approve": "قبول",
    "admin.pendingApprovals.reject": "رفض",
    "admin.recentUsers.title": "المستخدمون الجدد",
    "admin.recentUsers.name": "الاسم",
    "admin.recentUsers.email": "البريد الإلكتروني",
    "admin.recentUsers.role": "الدور",
    "admin.recentUsers.joined": "تاريخ الانضمام",
    "admin.recentBookings.title": "الحجوزات الأخيرة",
    "admin.recentBookings.student": "الطالب",
    "admin.recentBookings.tutor": "المعلم",
    "admin.recentBookings.status": "الحالة",
    "admin.recentBookings.date": "التاريخ",
    "admin.charts.userGrowthTitle": "المستخدمون الجدد (آخر 30 يومًا)",
    "admin.charts.bookingsStatusTitle": "الحجوزات حسب الحالة",
    "admin.charts.revenueTitle": "الإيرادات (آخر 7 أيام)",
    "admin.quickActions.title": "إجراءات سريعة",
    "admin.quickActions.manageUsers": "إدارة المستخدمين",
    "admin.quickActions.manageTutors": "إدارة المعلمين",
    "admin.quickActions.allBookings": "كل الحجوزات",
    "admin.quickActions.reports": "التقارير",
    "admin.quickActions.settings": "الإعدادات",
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
