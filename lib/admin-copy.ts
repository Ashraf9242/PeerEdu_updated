import type { SupportedLanguage } from "@/lib/i18n"

type AutomationToggleKey = "autoApproveTrusted" | "escalateDormant" | "notifyQueueOverflow"
type BookingStatusKey = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
type RoleKey = "STUDENT" | "TEACHER" | "ADMIN"

type AuditSummaryArgs = {
  actor: string
  target?: string
  relativeTime: string
}

type AutomationToggleCopy = {
  key: AutomationToggleKey
  label: string
  description: string
}

export type AdminCopy = {
  hero: {
    badge: string
    title: string
    subtitle: string
    quickActionsTitle: string
    logoutLabel: string
  }
  stats: {
    totalUsers: string
    students: string
    teachers: string
    totalBookings: string
    totalRevenue: string
  }
  helpers: {
    adminsLabel: string
    pendingApprovals: string
    pendingTutorProfiles: string
    pendingSubjectChecks: string
    bookings: {
      pending: string
      confirmed: string
      completed: string
    }
    revenueNote: string
    separator: string
    notAvailable: string
    noSubjects: string
    optionalNote: string
    optionalNotePlaceholder: string
    noExperience: string
    emailUser: string
  }
  quickActions: {
    manageUsers: string
    manageTutors: string
    allBookings: string
    reports: string
    settings: string
  }
  sections: {
    pendingTeachers: {
      title: string
      description: string
      empty: string
    }
    pendingStudents: {
      title: string
      description: string
      empty: string
    }
    subjectApprovals: {
      title: string
      description: string
      empty: string
    }
    bookings: {
      title: string
      description: string
      empty: string
    }
    recentUsers: {
      title: string
      description: string
      empty: string
    }
  }
  tables: {
    teachers: {
      tutor: string
      university: string
      subjects: string
      rate: string
      registered: string
      actions: string
    }
    students: {
      student: string
      university: string
      joined: string
      actions: string
    }
    subjectApprovals: {
      teacher: string
      subjects: string
      experience: string
      note: string
      actions: string
    }
    bookings: {
      student: string
      tutor: string
      subject: string
      status: string
      date: string
    }
    users: {
      name: string
      email: string
      role: string
      joined: string
    }
  }
  buttons: {
    approve: string
    suspend: string
    reject: string
    returnForEdits: string
    exportUsers: string
    exportBookings: string
    announceCopy: string
    announceReset: string
  }
  filters: {
    teachers: {
      searchLabel: string
      searchPlaceholder: string
      universityLabel: string
      universityPlaceholder: string
      allOption: string
    }
    students: {
      searchLabel: string
      searchPlaceholder: string
      universityLabel: string
      universityPlaceholder: string
      allOption: string
    }
    bookings: {
      statusLabel: string
      allOption: string
      statuses: Record<BookingStatusKey, string>
    }
  }
  roleInsights: {
    subjectsTitle: string
    tutorsTitle: string
    studentsTitle: string
    emptyMessage: string
    badgeSuffix: string
    timeframe: string
  }
  charts: {
    userGrowthTitle: string
    userGrowthDescription: string
    bookingsTitle: string
    bookingsDescription: string
    revenueTitle: string
    revenueDescription: string
  }
  systemHealth: {
    title: string
    description: string
    queueLabel: string
    queueHelper: string
    statusLabels: {
      healthy: string
      attention: string
      warning: string
    }
    metrics: {
      completionRate: { label: string; helper: string }
      pendingBookings: { label: string; helper: string }
      teacherQueue: { label: string; helper: string }
      studentQueue: { label: string; helper: string }
    }
  }
  auditLog: {
    title: string
    description: string
    empty: string
    severity: {
      info: string
      warning: string
      critical: string
    }
    summary: (args: AuditSummaryArgs) => string
  }
  automation: {
    title: string
    description: string
    toggles: AutomationToggleCopy[]
    buttonLabel: string
    toastMessage: string
  }
  announcements: {
    title: string
    description: string
    fields: {
      headline: string
      body: string
      ctaLabel: string
      ctaUrl: { label: string; placeholder: string }
    }
    buttons: {
      copy: string
      reset: string
    }
    toastCopy: string
    toastError: string
  }
  copyEmail: {
    success: string
    error: string
    ariaLabel: string
  }
  bookingStatus: Record<BookingStatusKey, string>
  roles: Record<RoleKey, string>
  themePreview: {
    title: string
    description: string
    lightLabel: string
    darkLabel: string
    lightPreview: string
    darkPreview: string
  }
  mail: {
    teacherSubject: string
    studentSubject: string
  }
}

const adminCopyData: Record<SupportedLanguage, AdminCopy> = {
  en: {
    hero: {
      badge: "Administrator workspace",
      title: "PeerEdu control center",
      subtitle: "Approve accounts, monitor learning activity, and keep operations steady.",
      quickActionsTitle: "Quick actions",
      logoutLabel: "Logout",
    },
    stats: {
      totalUsers: "Total users",
      students: "Students",
      teachers: "Tutors",
      totalBookings: "Session bookings",
      totalRevenue: "Collected revenue",
    },
    helpers: {
      adminsLabel: "admins",
      pendingApprovals: "pending approvals",
      pendingTutorProfiles: "pending tutor profiles",
      pendingSubjectChecks: "subject reviews",
      bookings: {
        pending: "pending",
        confirmed: "confirmed",
        completed: "completed",
      },
      revenueNote: "Confirmed and completed sessions",
      separator: "•",
      notAvailable: "Not provided",
      noSubjects: "No subjects submitted",
      optionalNote: "Optional note",
      optionalNotePlaceholder: "Add guidance for the tutor (optional)",
      noExperience: "No experience details",
      emailUser: "Email user",
    },
    quickActions: {
      manageUsers: "Manage students",
      manageTutors: "Review tutors",
      allBookings: "All bookings",
      reports: "Reports",
      settings: "Automation & settings",
    },
    sections: {
      pendingTeachers: {
        title: "Pending tutor approvals",
        description: "Review tutor applications submitted from the teacher portal.",
        empty: "No tutor applications awaiting review.",
      },
      pendingStudents: {
        title: "Pending student accounts",
        description: "Activate student sign-ups coming from the public website.",
        empty: "No student accounts are waiting for approval.",
      },
      subjectApprovals: {
        title: "Subject registrations",
        description: "Teachers waiting for their submitted subjects to be validated.",
        empty: "No subject requests are pending right now.",
      },
      bookings: {
        title: "Recent bookings",
        description: "Latest student-tutor interactions across the platform.",
        empty: "No bookings match the selected filters.",
      },
      recentUsers: {
        title: "Recent users",
        description: "Latest sign-ups across students, tutors, and admins.",
        empty: "Nothing to review here yet.",
      },
    },
    tables: {
      teachers: {
        tutor: "Tutor",
        university: "University",
        subjects: "Subjects",
        rate: "Rate",
        registered: "Registered",
        actions: "Actions",
      },
      students: {
        student: "Student",
        university: "University",
        joined: "Joined",
        actions: "Actions",
      },
      subjectApprovals: {
        teacher: "Teacher",
        subjects: "Subjects",
        experience: "Experience",
        note: "Note",
        actions: "Actions",
      },
      bookings: {
        student: "Student",
        tutor: "Tutor",
        subject: "Subject",
        status: "Status",
        date: "Date",
      },
      users: {
        name: "Name",
        email: "Email",
        role: "Role",
        joined: "Joined",
      },
    },
    buttons: {
      approve: "Approve",
      suspend: "Suspend",
      reject: "Reject",
      returnForEdits: "Return for edits",
      exportUsers: "Export users CSV",
      exportBookings: "Export bookings CSV",
      announceCopy: "Copy JSON draft",
      announceReset: "Reset draft",
    },
    filters: {
      teachers: {
        searchLabel: "Search",
        searchPlaceholder: "Name or email",
        universityLabel: "University",
        universityPlaceholder: "All universities",
        allOption: "All",
      },
      students: {
        searchLabel: "Search",
        searchPlaceholder: "Name or email",
        universityLabel: "University",
        universityPlaceholder: "All universities",
        allOption: "All",
      },
      bookings: {
        statusLabel: "Status",
        allOption: "All statuses",
        statuses: {
          PENDING: "Pending",
          CONFIRMED: "Confirmed",
          COMPLETED: "Completed",
          CANCELLED: "Cancelled",
        },
      },
    },
    roleInsights: {
      subjectsTitle: "Most requested subjects",
      tutorsTitle: "Top tutors",
      studentsTitle: "Top learners",
      emptyMessage: "Data will appear once bookings roll in.",
      badgeSuffix: "sessions",
      timeframe: "Last 30 days",
    },
    charts: {
      userGrowthTitle: "User growth",
      userGrowthDescription: "Net new accounts created in the last 30 days.",
      bookingsTitle: "Booking status mix",
      bookingsDescription: "Distribution for the past month.",
      revenueTitle: "Revenue trend",
      revenueDescription: "Gross OMR from confirmed and completed bookings.",
    },
    systemHealth: {
      title: "Operational health",
      description: "Queues across approvals and bookings.",
      queueLabel: "Total queue depth",
      queueHelper: "Students + tutors + subjects + pending bookings",
      statusLabels: {
        healthy: "Healthy",
        attention: "Look closer",
        warning: "Action needed",
      },
      metrics: {
        completionRate: {
          label: "Completion rate",
          helper: "Completed bookings / total",
        },
        pendingBookings: {
          label: "Pending bookings",
          helper: "Awaiting tutor confirmation",
        },
        teacherQueue: {
          label: "Teacher queue",
          helper: "Profiles awaiting review",
        },
        studentQueue: {
          label: "Student queue",
          helper: "Registrations awaiting approval",
        },
      },
    },
    auditLog: {
      title: "Audit log",
      description: "Trace key admin & user events.",
      empty: "No recent events.",
      severity: {
        info: "info",
        warning: "warning",
        critical: "critical",
      },
      summary: ({ actor, target, relativeTime }) => {
        const pieces = [actor]
        if (target) pieces.push(target)
        pieces.push(relativeTime)
        return pieces.join(" • ")
      },
    },
    automation: {
      title: "Automation guardrails",
      description: "Fine-tune how the platform escalates work.",
      toggles: [
        {
          key: "autoApproveTrusted",
          label: "Auto-approve trusted tutors",
          description: "Fast-track tutors who passed manual checks.",
        },
        {
          key: "escalateDormant",
          label: "Escalate dormant tickets",
          description: "Ping the admin team when reviews sit idle for 48h.",
        },
        {
          key: "notifyQueueOverflow",
          label: "Notify queue overflow",
          description: "Send alerts when any queue exceeds its threshold.",
        },
      ],
      buttonLabel: "Send test alert",
      toastMessage: "Alert sent to the on-call channel.",
    },
    announcements: {
      title: "Announcement composer",
      description: "Draft copy for the student or tutor dashboards.",
      fields: {
        headline: "Headline",
        body: "Body",
        ctaLabel: "CTA label",
        ctaUrl: {
          label: "CTA link",
          placeholder: "https://example.com",
        },
      },
      buttons: {
        copy: "Copy JSON",
        reset: "Reset draft",
      },
      toastCopy: "Draft copied to clipboard.",
      toastError: "Unable to copy draft. Please try again.",
    },
    copyEmail: {
      success: "Email copied",
      error: "Unable to copy email",
      ariaLabel: "Copy email address",
    },
    bookingStatus: {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    },
    roles: {
      STUDENT: "student",
      TEACHER: "tutor",
      ADMIN: "admin",
    },
    themePreview: {
      title: "Theme preview",
      description: "Toggle how the admin UI appears for light and dark mode.",
      lightLabel: "Light",
      darkLabel: "Dark",
      lightPreview: "Light mode keeps cards bright and surfaces pending work quickly.",
      darkPreview: "Dark mode reduces eye strain for long review sessions.",
    },
    mail: {
      teacherSubject: "PeerEdu admin update",
      studentSubject: "PeerEdu enrollment",
    },
  },
  ar: {
    hero: {
      badge: "مساحة عمل المشرفين",
      title: "لوحة تحكم PeerEdu",
      subtitle: "اعتمد الحسابات وراقب الحجوزات وسير التعلّم من مكان واحد.",
      quickActionsTitle: "إجراءات سريعة",
      logoutLabel: "تسجيل الخروج",
    },
    stats: {
      totalUsers: "إجمالي المستخدمين",
      students: "الطلاب",
      teachers: "المعلمون",
      totalBookings: "حجوزات الجلسات",
      totalRevenue: "الإيرادات المحصّلة",
    },
    helpers: {
      adminsLabel: "مشرفين",
      pendingApprovals: "بانتظار الاعتماد",
      pendingTutorProfiles: "ملفات معلمين قيد المراجعة",
      pendingSubjectChecks: "مواد بحاجة للتدقيق",
      bookings: {
        pending: "قيد الانتظار",
        confirmed: "مؤكدة",
        completed: "مكتملة",
      },
      revenueNote: "جلسات مؤكدة ومكتملة",
      separator: "•",
      notAvailable: "غير متوفر",
      noSubjects: "لا توجد مواد مسجلة",
      optionalNote: "ملاحظة اختيارية",
      optionalNotePlaceholder: "أضف توجيهات للمعلم (اختياري)",
      noExperience: "لا يوجد وصف للخبرة",
      emailUser: "إرسال بريد للمستخدم",
    },
    quickActions: {
      manageUsers: "إدارة الطلاب",
      manageTutors: "مراجعة المعلمين",
      allBookings: "كل الحجوزات",
      reports: "التقارير",
      settings: "الأتمتة والإعدادات",
    },
    sections: {
      pendingTeachers: {
        title: "طلبات اعتماد المعلمين",
        description: "راجع طلبات الانضمام القادمة من بوابة المعلم.",
        empty: "لا توجد طلبات معلّقة حاليًا.",
      },
      pendingStudents: {
        title: "حسابات الطلاب قيد الاعتماد",
        description: "فعّل تسجيلات الطلاب القادمة من الموقع العام.",
        empty: "لا توجد حسابات طلاب تنتظر الاعتماد.",
      },
      subjectApprovals: {
        title: "تسجيل المواد",
        description: "معلمون في انتظار التحقق من المواد التي أضافوها.",
        empty: "لا توجد طلبات مواد قيد الانتظار.",
      },
      bookings: {
        title: "أحدث الحجوزات",
        description: "آخر تفاعلات الطالب والمعلم داخل المنصة.",
        empty: "لا توجد حجوزات مطابقة للمرشّحات المحددة.",
      },
      recentUsers: {
        title: "أحدث المستخدمين",
        description: "أحدث المنضمين من الطلاب والمعلمين والمشرفين.",
        empty: "لا توجد بيانات للمراجعة الآن.",
      },
    },
    tables: {
      teachers: {
        tutor: "المعلم",
        university: "الجامعة",
        subjects: "المواد",
        rate: "التسعيرة",
        registered: "تاريخ التسجيل",
        actions: "إجراءات",
      },
      students: {
        student: "الطالب",
        university: "الجامعة",
        joined: "تاريخ الانضمام",
        actions: "إجراءات",
      },
      subjectApprovals: {
        teacher: "المعلم",
        subjects: "المواد",
        experience: "الخبرة",
        note: "ملاحظة",
        actions: "إجراءات",
      },
      bookings: {
        student: "الطالب",
        tutor: "المعلم",
        subject: "المادة",
        status: "الحالة",
        date: "التاريخ",
      },
      users: {
        name: "الاسم",
        email: "البريد",
        role: "الدور",
        joined: "تاريخ الانضمام",
      },
    },
    buttons: {
      approve: "اعتماد",
      suspend: "إيقاف",
      reject: "رفض",
      returnForEdits: "إرجاع للتعديل",
      exportUsers: "تصدير المستخدمين CSV",
      exportBookings: "تصدير الحجوزات CSV",
      announceCopy: "نسخ JSON",
      announceReset: "إعادة الضبط",
    },
    filters: {
      teachers: {
        searchLabel: "بحث",
        searchPlaceholder: "الاسم أو البريد",
        universityLabel: "الجامعة",
        universityPlaceholder: "كل الجامعات",
        allOption: "الكل",
      },
      students: {
        searchLabel: "بحث",
        searchPlaceholder: "الاسم أو البريد",
        universityLabel: "الجامعة",
        universityPlaceholder: "كل الجامعات",
        allOption: "الكل",
      },
      bookings: {
        statusLabel: "الحالة",
        allOption: "كل الحالات",
        statuses: {
          PENDING: "قيد الانتظار",
          CONFIRMED: "مؤكدة",
          COMPLETED: "مكتملة",
          CANCELLED: "ملغاة",
        },
      },
    },
    roleInsights: {
      subjectsTitle: "أكثر المواد طلبًا",
      tutorsTitle: "أفضل المعلمين",
      studentsTitle: "أبرز الطلاب",
      emptyMessage: "ستظهر البيانات عند توفر حجوزات.",
      badgeSuffix: "جلسات",
      timeframe: "آخر 30 يومًا",
    },
    charts: {
      userGrowthTitle: "نمو المستخدمين",
      userGrowthDescription: "عدد الحسابات الجديدة خلال آخر 30 يومًا.",
      bookingsTitle: "حالات الحجوزات",
      bookingsDescription: "توزيع الحالات خلال الشهر الماضي.",
      revenueTitle: "اتجاه الإيرادات",
      revenueDescription: "إجمالي الريال العُماني من الحجوزات المؤكدة والمكتملة.",
    },
    systemHealth: {
      title: "صحة التشغيل",
      description: "حالة طوابير الاعتماد والحجوزات.",
      queueLabel: "عمق الطابور الكلي",
      queueHelper: "طلاب + معلمون + مواد + حجوزات معلّقة",
      statusLabels: {
        healthy: "مستقر",
        attention: "يحتاج متابعة",
        warning: "يحتاج تدخلاً",
      },
      metrics: {
        completionRate: {
          label: "نسبة الإكمال",
          helper: "الحجوزات المكتملة ÷ الإجمالي",
        },
        pendingBookings: {
          label: "حجوزات معلّقة",
          helper: "بانتظار تأكيد المعلم",
        },
        teacherQueue: {
          label: "طابور المعلمين",
          helper: "ملفات تنتظر المراجعة",
        },
        studentQueue: {
          label: "طابور الطلاب",
          helper: "تسجيلات تنتظر الاعتماد",
        },
      },
    },
    auditLog: {
      title: "سجل التدقيق",
      description: "تابع أهم الأحداث للمشرفين والمستخدمين.",
      empty: "لا توجد أحداث حديثة.",
      severity: {
        info: "معلومة",
        warning: "تحذير",
        critical: "حرج",
      },
      summary: ({ actor, target, relativeTime }) => {
        const pieces = [actor]
        if (target) pieces.push(target)
        pieces.push(relativeTime)
        return pieces.join(" • ")
      },
    },
    automation: {
      title: "إعدادات الأتمتة",
      description: "اضبط كيفية تصعيد المهام وتنبيهات الطوابير.",
      toggles: [
        {
          key: "autoApproveTrusted",
          label: "اعتماد تلقائي للمعلمين الموثوقين",
          description: "تسريع الموافقة لمن اجتاز التحقق اليدوي.",
        },
        {
          key: "escalateDormant",
          label: "تصعيد الطلبات المتأخرة",
          description: "أرسل تنبيهًا إذا بقيت المراجعة دون حركة 48 ساعة.",
        },
        {
          key: "notifyQueueOverflow",
          label: "تنبيه ازدحام الطوابير",
          description: "أبلغ الفريق عند تجاوز أي طابور للحد المسموح.",
        },
      ],
      buttonLabel: "إرسال تنبيه تجريبي",
      toastMessage: "تم إرسال التنبيه إلى قناة المناوبة.",
    },
    announcements: {
      title: "منشئ الإعلانات",
      description: "اكتب رسائل مخصصة لواجهات الطلاب أو المعلمين.",
      fields: {
        headline: "العنوان",
        body: "النص",
        ctaLabel: "زر الدعوة",
        ctaUrl: {
          label: "رابط الدعوة",
          placeholder: "https://example.com",
        },
      },
      buttons: {
        copy: "نسخ JSON",
        reset: "إعادة الضبط",
      },
      toastCopy: "تم نسخ المسودة إلى الحافظة.",
      toastError: "تعذّر نسخ المسودة، يرجى المحاولة مرة أخرى.",
    },
    copyEmail: {
      success: "تم نسخ البريد",
      error: "تعذّر نسخ البريد",
      ariaLabel: "نسخ البريد الإلكتروني",
    },
    bookingStatus: {
      PENDING: "قيد الانتظار",
      CONFIRMED: "مؤكدة",
      COMPLETED: "مكتملة",
      CANCELLED: "ملغاة",
    },
    roles: {
      STUDENT: "طالب",
      TEACHER: "معلم",
      ADMIN: "مشرف",
    },
    themePreview: {
      title: "معاينة السمة",
      description: "بدّل بين الوضعين الفاتح والداكن لواجهة المشرف.",
      lightLabel: "وضع فاتح",
      darkLabel: "وضع داكن",
      lightPreview: "الوضع الفاتح يبرز البطاقات ويسرّع اكتشاف المهام العاجلة.",
      darkPreview: "الوضع الداكن يقلل إجهاد العين في جلسات المراجعة الطويلة.",
    },
    mail: {
      teacherSubject: "تحديث من إدارة PeerEdu",
      studentSubject: "متابعة تسجيلك في PeerEdu",
    },
  },
}

export function getAdminCopy(language: SupportedLanguage): AdminCopy {
  return adminCopyData[language] ?? adminCopyData.en
}
