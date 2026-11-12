export type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const lastUpdated = "August 22, 2026";

export const policySections: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    paragraphs: [
      "We collect only what we need to run your account, process your course purchases, and personalize your learning experience.",
    ],
    bullets: [
      "Account information — your name, email address, and optional profile photo, managed through our authentication provider, Clerk. We never see or store your password.",
      "Purchase verification — the course you select, the KBZ Pay transaction reference number, and the payment screenshot you upload for manual confirmation.",
      "Learning activity — course progress, lesson completion, and quiz results tied to your account.",
      'Device-local data — your Flashcards "learned" status and Memo Space review schedule are stored only in your browser\'s local storage. This never leaves your device or reaches our servers.',
      "Technical data — your language preference (English/Myanmar) and general usage logs used for troubleshooting.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How We Use Your Information",
    bullets: [
      "Create, secure, and manage your account.",
      "Verify and process your course purchases.",
      "Track your learning progress and personalize your dashboard.",
      "Send optional push notifications, such as flashcard or review reminders.",
      "Respond to your support requests.",
      "Improve the platform and fix bugs.",
    ],
  },
  {
    id: "payments",
    title: "Payments & Purchase Verification",
    paragraphs: [
      "Hong Bao currently uses manual bank-app transfer (KBZ Pay) rather than an embedded card payment processor.",
      "We never ask for or store your banking password, PIN, or full card number. You transfer payment directly through your own banking app.",
      "To confirm your purchase, you submit the last 6 digits of your transaction number and a screenshot as proof of payment. Our team manually reviews this to activate your course.",
      "Please double-check your transaction number before submitting — as noted during checkout, we can't be responsible for issues caused by an incorrect number.",
    ],
  },
  {
    id: "notifications",
    title: "Push Notifications",
    paragraphs: [
      "If you install Hong Bao as an app on your device (as a PWA), we may ask permission to send push notifications through Firebase Cloud Messaging.",
      "We use this only for learning reminders — for example, letting you know when flashcards or a Memo Space review are due.",
    ],
    bullets: [
      "Notifications are always optional and require your explicit permission.",
      "You can turn them off anytime in your browser or device settings.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Local Storage",
    bullets: [
      "We use minimal, essential cookies for keeping you signed in (via Clerk) and remembering your language preference.",
      "We do not use third-party advertising or analytics trackers.",
      "Flashcards and Memo Space progress live in your browser's local storage, not on our servers, and clear automatically if you clear your browser data.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing Your Information",
    paragraphs: ["We do not sell your personal information — ever."],
    bullets: [
      "Clerk — handles authentication and account security.",
      "Firebase — delivers optional push notifications.",
      "We may disclose information if required to comply with the law.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    bullets: [
      "We keep your account and learning data for as long as your account stays active.",
      "Payment verification screenshots are kept only as long as needed to confirm and audit your purchase.",
      "You can request deletion of your account and associated data at any time.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    paragraphs: [
      "Hong Bao is intended for learners aged 13 and above. If you're under 13, please use the platform together with a parent or guardian.",
      "We do not knowingly collect personal information from children under 13 without a parent or guardian's consent. If you believe a child has provided us with personal information, please contact us and we'll remove it.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    bullets: [
      "Access the personal information we hold about you.",
      "Correct inaccurate details through your profile settings.",
      "Request deletion of your account and data.",
      "Opt out of push notifications at any time.",
      "Contact us anytime to exercise any of these rights.",
    ],
  },
  {
    id: "security",
    title: "Data Security",
    paragraphs: [
      "We rely on industry-standard practices to protect your information, including secure authentication through Clerk and encrypted (HTTPS) connections across the platform.",
      "Payment screenshots are stored securely and only accessed by authorized staff for verification.",
      "No method of transmission over the internet is 100% secure, but we work continuously to protect your information.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    paragraphs: [
      'We may update this policy from time to time as Hong Bao grows. Material changes will always be reflected by updating the "Last updated" date at the top of this page.',
      "Continuing to use Hong Bao after a change means you accept the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    paragraphs: [
      "Questions about this policy, or want to access, correct, or delete your data? Reach out and we'll help.",
    ],
    bullets: ["Phone — 0937605832", "Email — privacy@hongbaochinese.com"],
  },
];
