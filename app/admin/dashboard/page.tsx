"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Bell,
  Users,
  GraduationCap,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  FileText,
  LogOut,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Edit2,
  Upload,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Globe,
  Clock,
  MapPin,
  Save,
  Image as ImageIcon,
  GripVertical,
  Eye,
  EyeOff,
  Mail,
  History,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toNepaliNumerals } from "@/lib/dateConverter";
import FacultyManager from "@/components/admin/FacultyManager";
import GalleryManager from "@/components/admin/GalleryManager";
import EventManager from "@/components/admin/EventManager";
import MessageManager from "@/components/admin/MessageManager";
import AcademicProgramsManager from "@/components/admin/AcademicProgramsManager";

type Tab = "overview" | "notices" | "milestones" | "admissions" | "results" | "settings" | "hero" | "faculty" | "gallery" | "events" | "messages" | "academicPrograms";

interface Notice {
  id: string;
  titleEn: string;
  titleNp: string;
  date: string;
  category: "Exam" | "Holiday" | "Event" | "Admission" | "Results";
  isPinned: boolean;
  contentEn: string;
  contentNp: string;
}

interface AdmissionInquiry {
  id: string;
  studentName: string;
  parentName: string;
  gradeApplied: string;
  contactPhone: string;
  email: string;
  previousSchool: string;
  gpaScore: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface StudentResult {
  rollNo: string;
  studentName: string;
  fatherName: string;
  academicYear: string;
  classGrade: string;
  percentage: number;
  divisionEn: string;
  divisionNp: string;
  passStatus: boolean;
  subjects: {
    code: string;
    nameEn: string;
    nameNp: string;
    fullMarks: number;
    passMarks: number;
    marksObtained: number;
    grade: string;
    remarksEn: string;
    remarksNp: string;
  }[];
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [role, setRole] = useState("Editor");

  // Dynamic CMS States
  const [notices, setNotices] = useState<Notice[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);

  // --- ADMISSIONS: real DB state ---
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);
  const [admissionsUpdating, setAdmissionsUpdating] = useState<number | null>(null);

  const fetchAdmissions = async () => {
    try {
      setAdmissionsLoading(true);
      const res = await fetch('/api/admissions');
      if (res.ok) {
        const json = await res.json();
        setInquiries(json.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch admissions:', error);
    } finally {
      setAdmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admissions') {
      fetchAdmissions();
    }
  }, [activeTab]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [heroLoading, setHeroLoading] = useState(false);
  const [newHeroFile, setNewHeroFile] = useState<File | null>(null);
  const [newHeroCaption, setNewHeroCaption] = useState("");

  const fetchHeroSlides = async () => {
    try {
      setHeroLoading(true);
      const res = await fetch('/api/hero-slides');
      if (res.ok) {
        const json = await res.json();
        setHeroSlides(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setHeroLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "hero") {
      fetchHeroSlides();
    }
  }, [activeTab]);

  const [siteSettings, setSiteSettings] = useState({
    mottoEn: "Lead us from darkness to the light of knowledge.",
    mottoNp: "अन्धकारबाट उज्यालोतर्फ डोर्याउनुहोस्",
    principalMessageEn: `Dear Students, Parents, Guardians, and Well-wishers,

It is my extreme privilege and honor to serve as the Principal of Shree Jiveen Shakti Secondary School, Sitabasti, Kanchanpur. Ever since our inception in 2037 BS, our school has undergone massive shifts from a modest rural basic school to a full-fledged government secondary educational institution supporting diverse curriculums in Science, Humanities, and Education.

In alignment with the directives of the Ministry of Education, Nepal, our school has consistently achieved highly competitive results in the Secondary Education Examination (SEE). We recognize that textbook learning alone is incomplete. Hence, we prioritize an active integration of digital literacy, library exercises, physical sports, and cultural festivals which draws inspiration from our rich Nepalese identity.

We are highly grateful to the local government authorities of Punarbas-9, our hard-working faculty members, and the collaborative School Management Committee (SMC) who support our operations. We welcome all parents to maintain open communicative relationships with us to ensure our pupils reach their highest academic heights.

Thank you. Wishing everyone a highly productive and fulfilling academic year.`,
    principalMessageNp: `आदरणीय अभिभावक, शिक्षक, सरोकारवाला तथा प्यारा विद्यार्थी भाइबहिनीहरू,

कञ्चनपुर जिल्लाको पुनर्वास नगरपालिकास्थित श्री जिविन शक्ति माध्यमिक विद्यालयको प्रधानाध्यापकका रूपमा यहाँहरूसँग जोडिन पाउँदा म अत्यन्तै गौरवान्वित छु। वि.सं. २०३७ सालमा सामान्य प्राथमिक पाठशालाको रूपमा स्थापना भएको यो विद्यालय आज क्षेत्रकै उत्कृष्ट सामुदायिक माध्यमिक विद्यालय बन्न सफल भएको छ।

नेपाल सरकारको राष्ट्रिय शिक्षा प्रणाली अनुरूप हामीले माध्यमिक शिक्षा परीक्षा (SEE) मा निरन्तर उत्कृष्ट नतिजा हासिल गर्दै आएका छौँ। हामी केवल परीक्षा उत्तीर्ण गर्ने शैक्षिक कारखाना होइनौँ, अपितु विद्यार्थीमा अन्तरनिहित प्रतिभा प्रस्फुटन गरी देश र समाजप्रति जिम्मेवार नागरिक उत्पादन गर्न समर्पित छौँ।

हामी पुनर्वास नगरपालिका, विद्यालय व्यवस्थापन समिति, शिक्षक अभिभावक संघ, लगनशील शिक्षक-कर्मचारी र सहयोगी हातहरू प्रति हार्दिक आभार प्रकट गर्दछौँ। यहाँहरूको साथ र सहयोग नै हाम्रो उत्प्रेरणाको स्रोत हो। आगामी दिनहरूमा पनि यस्तै सहकार्य र शुभेच्छाको अपेक्षा गर्दछौँ।

धन्यवाद। यहाँहरू सबैको शैक्षिक यात्रा सुखद र सफल रहोस्।`,
    announcementTextEn: "SEE Examination Results 2081 are out! Check your scores in the Results tab. | Admissions for Academic Year 2083 are now open!",
    announcementTextNp: "एस.ई.ई. परीक्षा नतिजा २०८१ प्रकाशित भएको छ! नतिजा ट्याबमा हेर्नुहोस्। | शैक्षिक वर्ष २०८३ को लागि भर्ना खुला गरिएको छ!",
    announcementVisible: true,
    maintenanceMode: false,
    emis: "EMIS-00000",
    schoolCode: "SC-0000",
    logoUrl: "",
    phoneEn: "+977-99-XXXXXX",
    phoneNp: "+९७७-९९-XXXXXX",
    email: "info@sjss.edu.np",
    addressEn: "Punarbas-9, Sitabasti, Kanchanpur, Nepal",
    addressNp: "पुनर्वास-९, सिताबस्ती, कञ्चनपुर, नेपाल",
    calendar_year: "२०८३",
    totalStudents: "847+",
    totalStaff: "42",
    establishedYearBS: "2037",
    schoolClasses: "1–10",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Logged-in session verification
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedRole = localStorage.getItem("admin_role");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (savedRole) setRole(savedRole);

    // Load data from localStorage or seed defaults
    const localNotices = localStorage.getItem("sjss_notices");
    if (localNotices) {
      setNotices(JSON.parse(localNotices));
    } else {
      const defaults: Notice[] = [
        {
          id: "1",
          titleEn: "Admissions Open for Grade 11 Science & Commerce (Academic Year 2083)",
          titleNp: "कक्षा ११ विज्ञान तथा व्यवस्थापन संकायमा भर्ना खुला सम्बन्धी सूचना (शैक्षिक वर्ष २०८३)",
          date: "2083-05-10",
          category: "Admission",
          isPinned: true,
          contentEn: "Application forms for Grade 11 Science and Commerce streams are available at the administration desk. Submit completed inquiries by Ashadh 20, 2083.",
          contentNp: "शैक्षिक वर्ष २०८३ का लागि कक्षा ११ विज्ञान र व्यवस्थापन संकायमा भर्ना आवेदन फारम वितरण सुरु भएको छ। आवेदन फारम २०८३ असार २० गतेभित्र बुझाउनुहोला।"
        },
        {
          id: "2",
          titleEn: "First Terminal Examination Schedule - Grades 1 to 10",
          titleNp: "प्रथम त्रैमासिक परीक्षा तालिका प्रकाशन - कक्षा १ देखि १०",
          date: "2083-05-20",
          category: "Exam",
          isPinned: true,
          contentEn: "The First Terminal Examinations for Grades 1 to 10 will commence on Jestha 25, 2083. Daily routine and roll schedules have been pinned.",
          contentNp: "कक्षा १ देखि १० सम्मको प्रथम त्रैमासिक परीक्षा यही २०८३ जेठ २५ गतेदेखि सुरु हुने भएकाले विस्तृत परीक्षा तालिका टाँस गरिएको ब्यहोरा जानकारी गराइन्छ।"
        }
      ];
      setNotices(defaults);
      localStorage.setItem("sjss_notices", JSON.stringify(defaults));
    }



    const localResults = localStorage.getItem("sjss_results");
    if (localResults) {
      setResults(JSON.parse(localResults));
    } else {
      const defaultResults: StudentResult[] = [
        {
          rollNo: "101",
          studentName: "Siddharth Upadhyaya",
          fatherName: "Prayag Raj Upadhyaya",
          academicYear: "2081",
          classGrade: "10",
          percentage: 84.16,
          divisionEn: "Distinction",
          divisionNp: "विशिष्ट श्रेणी",
          passStatus: true,
          subjects: [
            { code: "101", nameEn: "English", nameNp: "अंग्रेजी", fullMarks: 100, passMarks: 35, marksObtained: 84, grade: "A", remarksEn: "Excellent", remarksNp: "अति उत्तम" },
            { code: "102", nameEn: "Nepali", nameNp: "नेपाली", fullMarks: 100, passMarks: 35, marksObtained: 76, grade: "B+", remarksEn: "Very Good", remarksNp: "उत्तम" },
            { code: "103", nameEn: "Compulsory Mathematics", nameNp: "गणित", fullMarks: 100, passMarks: 35, marksObtained: 92, grade: "A+", remarksEn: "Outstanding", remarksNp: "सर्वोत्कृष्ट" },
            { code: "104", nameEn: "Science & Technology", nameNp: "विज्ञान तथा प्रविधि", fullMarks: 100, passMarks: 35, marksObtained: 85, grade: "A", remarksEn: "Excellent", remarksNp: "अति उत्तम" },
            { code: "105", nameEn: "Social Studies", nameNp: "सामाजिक अध्ययन", fullMarks: 100, passMarks: 35, marksObtained: 78, grade: "B+", remarksEn: "Very Good", remarksNp: "उत्तम" },
            { code: "106", nameEn: "Optional Mathematics", nameNp: "ऐच्छिक गणित", fullMarks: 100, passMarks: 35, marksObtained: 90, grade: "A+", remarksEn: "Outstanding", remarksNp: "सर्वोत्कृष्ट" }
          ]
        }
      ];
      setResults(defaultResults);
      localStorage.setItem("sjss_results", JSON.stringify(defaultResults));
    }

    const localSettings = localStorage.getItem("sjss_settings");
    if (localSettings) {
      const parsed = JSON.parse(localSettings);
      setSiteSettings((prev) => ({ ...prev, ...parsed }));
    } else {
      localStorage.setItem("sjss_settings", JSON.stringify(siteSettings));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    router.push("/admin/login");
  };

  // --- NOTICE MANAGER CRUD LOGIC ---
  const [noticeForm, setNoticeForm] = useState<Omit<Notice, "id">>({
    titleEn: "",
    titleNp: "",
    date: "2083-05-23",
    category: "Exam",
    isPinned: false,
    contentEn: "",
    contentNp: ""
  });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const saveNoticesToStorage = (updated: Notice[]) => {
    setNotices(updated);
    localStorage.setItem("sjss_notices", JSON.stringify(updated));
    // Trigger storage event to alert other tabs
    window.dispatchEvent(new Event("storage"));
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.titleEn.trim() || !noticeForm.titleNp.trim()) return;

    if (editingNoticeId) {
      const updated = notices.map((n) =>
        n.id === editingNoticeId ? { ...n, ...noticeForm } : n
      );
      saveNoticesToStorage(updated);
      setEditingNoticeId(null);
    } else {
      const newNotice: Notice = {
        id: String(Date.now()),
        ...noticeForm
      };
      saveNoticesToStorage([newNotice, ...notices]);
    }

    // Reset Form
    setNoticeForm({
      titleEn: "",
      titleNp: "",
      date: "2083-05-23",
      category: "Exam",
      isPinned: false,
      contentEn: "",
      contentNp: ""
    });
  };

  const handleEditNotice = (n: Notice) => {
    setEditingNoticeId(n.id);
    setNoticeForm({
      titleEn: n.titleEn,
      titleNp: n.titleNp,
      date: n.date,
      category: n.category,
      isPinned: n.isPinned,
      contentEn: n.contentEn,
      contentNp: n.contentNp
    });
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm(t("Delete this notice?", "के तपाईं यो सूचना हटाउन चाहनुहुन्छ?"))) {
      const filtered = notices.filter((n) => n.id !== id);
      saveNoticesToStorage(filtered);
    }
  };


  // --- ADMISSIONS MANAGER LOGIC (real API) ---
  const handleInquiryStatus = async (id: number, status: "approved" | "rejected" | "pending") => {
    try {
      setAdmissionsUpdating(id);
      const res = await fetch(`/api/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status } : inq));
      }
    } catch (error) {
      console.error('Failed to update admission status:', error);
    } finally {
      setAdmissionsUpdating(null);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm(t("Delete this application inquiry record?", "के तपाईं यो सोधपुछ रेकर्ड हटाउन चाहनुहुन्छ?"))) return;
    try {
      setAdmissionsUpdating(id);
      // Use PUT to mark as rejected (soft delete) or remove from UI
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (error) {
      console.error('Failed to delete admission:', error);
    } finally {
      setAdmissionsUpdating(null);
    }
  };

  const handleExportCSV = () => {
    const headers = "Application ID,Student Name,Guardian Name,Grade,Phone,Email,Address,Status,Submitted At\n";
    const rows = inquiries
      .map((inq) => `JSSS-2083-${String(inq.id).padStart(2,'0')},"${inq.student_name}","${inq.guardian_name}",${inq.grade_applying},${inq.phone},${inq.email || ''},"${inq.address || ''}",${inq.status},${new Date(inq.submitted_at).toLocaleDateString()}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JSSS_Admissions_2083.csv`;
    link.click();
  };


  // --- RESULTS UPLOADER LOGIC ---
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [resultRollNo, setResultRollNo] = useState("");
  const [resultName, setResultName] = useState("");
  const [resultClass, setResultClass] = useState("10");
  const [manualMarks, setManualMarks] = useState({
    english: "80",
    nepali: "75",
    maths: "90",
    science: "85",
    social: "78"
  });

  const saveResultsToStorage = (updated: StudentResult[]) => {
    setResults(updated);
    localStorage.setItem("sjss_results", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleManualResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultRollNo.trim() || !resultName.trim()) return;

    const eng = parseInt(manualMarks.english) || 0;
    const nep = parseInt(manualMarks.nepali) || 0;
    const mat = parseInt(manualMarks.maths) || 0;
    const sci = parseInt(manualMarks.science) || 0;
    const soc = parseInt(manualMarks.social) || 0;
    const total = eng + nep + mat + sci + soc;
    const percentage = Math.round((total / 500) * 100 * 100) / 100;
    
    const passStatus = eng >= 35 && nep >= 35 && mat >= 35 && sci >= 35 && soc >= 35;
    const division = percentage >= 80 ? "Distinction" : percentage >= 60 ? "First Division" : percentage >= 45 ? "Second Division" : "Third Division";
    const divisionNp = percentage >= 80 ? "विशिष्ट श्रेणी" : percentage >= 60 ? "प्रथम श्रेणी" : percentage >= 45 ? "द्वितीय श्रेणी" : "तृतीय श्रेणी";

    const newResult: StudentResult = {
      rollNo: resultRollNo,
      studentName: resultName,
      fatherName: "Guardian Representative",
      academicYear: "2081",
      classGrade: resultClass,
      percentage,
      divisionEn: division,
      divisionNp,
      passStatus,
      subjects: [
        { code: "101", nameEn: "English", nameNp: "अंग्रेजी", fullMarks: 100, passMarks: 35, marksObtained: eng, grade: eng >= 90 ? "A+" : eng >= 80 ? "A" : eng >= 70 ? "B+" : "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
        { code: "102", nameEn: "Nepali", nameNp: "नेपाली", fullMarks: 100, passMarks: 35, marksObtained: nep, grade: nep >= 90 ? "A+" : nep >= 80 ? "A" : nep >= 70 ? "B+" : "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
        { code: "103", nameEn: "Mathematics", nameNp: "गणित", fullMarks: 100, passMarks: 35, marksObtained: mat, grade: mat >= 90 ? "A+" : mat >= 80 ? "A" : mat >= 70 ? "B+" : "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
        { code: "104", nameEn: "Science", nameNp: "विज्ञान", fullMarks: 100, passMarks: 35, marksObtained: sci, grade: sci >= 90 ? "A+" : sci >= 80 ? "A" : sci >= 70 ? "B+" : "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
        { code: "105", nameEn: "Social Studies", nameNp: "सामाजिक", fullMarks: 100, passMarks: 35, marksObtained: soc, grade: soc >= 90 ? "A+" : soc >= 80 ? "A" : soc >= 70 ? "B+" : "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" }
      ]
    };

    saveResultsToStorage([newResult, ...results]);
    setResultRollNo("");
    setResultName("");
    alert("Student report generated successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setFileContent(evt.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  };

  const processSpreadsheet = () => {
    if (!fileContent) return;

    const wb = XLSX.read(fileContent, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Skip header row, find data rows with at least 7 columns
    const parsedResults: StudentResult[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 7) continue;

      const roll = String(cols[0] ?? "").trim();
      const name = String(cols[1] ?? "").trim();
      if (!roll || !name) continue;

      const eng = parseInt(cols[2]) || 0;
      const nep = parseInt(cols[3]) || 0;
      const mat = parseInt(cols[4]) || 0;
      const sci = parseInt(cols[5]) || 0;
      const soc = parseInt(cols[6]) || 0;
      const total = eng + nep + mat + sci + soc;
      const percentage = Math.round((total / 500) * 100 * 100) / 100;
      const pass = eng >= 35 && nep >= 35 && mat >= 35 && sci >= 35 && soc >= 35;

      parsedResults.push({
        rollNo: roll,
        studentName: name,
        fatherName: "Guardian Representative",
        academicYear: "2081",
        classGrade: "10",
        percentage,
        divisionEn: percentage >= 80 ? "Distinction" : "First Division",
        divisionNp: percentage >= 80 ? "विशिष्ट श्रेणी" : "प्रथम श्रेणी",
        passStatus: pass,
        subjects: [
          { code: "101", nameEn: "English", nameNp: "अंग्रेजी", fullMarks: 100, passMarks: 35, marksObtained: eng, grade: "A", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
          { code: "102", nameEn: "Nepali", nameNp: "नेपाली", fullMarks: 100, passMarks: 35, marksObtained: nep, grade: "B", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
          { code: "103", nameEn: "Mathematics", nameNp: "गणित", fullMarks: 100, passMarks: 35, marksObtained: mat, grade: "A+", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
          { code: "104", nameEn: "Science", nameNp: "विज्ञान", fullMarks: 100, passMarks: 35, marksObtained: sci, grade: "A", remarksEn: "Passed", remarksNp: "उत्तीर्ण" },
          { code: "105", nameEn: "Social Studies", nameNp: "सामाजिक", fullMarks: 100, passMarks: 35, marksObtained: soc, grade: "B+", remarksEn: "Passed", remarksNp: "उत्तीर्ण" }
        ]
      });
    }

    if (parsedResults.length > 0) {
      saveResultsToStorage([...parsedResults, ...results]);
      setFileContent(null);
      setFileName("");
      alert(`Imported ${parsedResults.length} records successfully!`);
    } else {
      alert("No valid data found. Check that columns are: roll, name, english, nepali, math, science, social");
    }
  };

  const handleDeleteResult = (roll: string) => {
    if (confirm("Delete this marksheet?")) {
      const filtered = results.filter((r) => r.rollNo !== roll);
      saveResultsToStorage(filtered);
    }
  };


  // --- GLOBAL SETTINGS LOGIC ---
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Persist to server-side settings table via API
    try {
      // Map local keys to DB keys
      const payload: Record<string, string> = {
        school_motto_en: siteSettings.mottoEn || "",
        school_motto_np: siteSettings.mottoNp || "",
        principal_message_en: siteSettings.principalMessageEn || "",
        principal_message_np: siteSettings.principalMessageNp || "",
        announcement_text_en: siteSettings.announcementTextEn || "",
        announcement_text_np: siteSettings.announcementTextNp || "",
        total_students: siteSettings.totalStudents || "",
        total_staff: siteSettings.totalStaff || "",
        established_year_bs: siteSettings.establishedYearBS || "",
        school_classes: siteSettings.schoolClasses || "",
        phone: siteSettings.phoneEn || "",
        email: siteSettings.email || "",
        address_en: siteSettings.addressEn || "",
        address_np: siteSettings.addressNp || "",
        emis: siteSettings.emis || "",
        school_code: siteSettings.schoolCode || "",
        logo_url: siteSettings.logoUrl || "",
        calendar_year: siteSettings.calendar_year,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      // Update local state/storage too
      localStorage.setItem('sjss_settings', JSON.stringify(siteSettings));
      window.dispatchEvent(new Event('storage'));
      alert('Global site configurations updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings to server. Changes saved locally.');
      localStorage.setItem('sjss_settings', JSON.stringify(siteSettings));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) {
      alert('Please select a logo file first');
      return;
    }

    try {
      const form = new FormData();
      form.append('file', logoFile);

      const res = await fetch('/api/settings', {
        method: 'POST',
        body: form,
      });

      const json = await res.json();

      if (!json.success) {
        alert('Upload failed: ' + (json.error || 'Unknown'));
        return;
      }

      setSiteSettings((prev) => ({ ...prev, logoUrl: json.url }));
      localStorage.setItem('sjss_settings', JSON.stringify({ ...siteSettings, logoUrl: json.url }));
      alert('Logo uploaded');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  // --- HERO SLIDER LOGIC ---
  const addHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroFile) return;
    try {
      const form = new FormData();
      form.append('file', newHeroFile);
      form.append('folder', 'hero');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        alert('Upload failed: ' + (uploadJson.error || 'Unknown'));
        return;
      }

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: uploadJson.url,
          caption: newHeroCaption || null,
          display_order: heroSlides.length,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setHeroSlides([...heroSlides, json.data]);
        setNewHeroFile(null);
        setNewHeroCaption('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleHeroVisibility = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHeroSlide = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHeroSlides(heroSlides.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- MILESTONES LOGIC ---
  const [milestones, setMilestones] = useState<any[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title_en: '', title_np: '', date_label: '', year_ad: '',
    description_en: '', description_np: '',
  });
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null);

  const fetchMilestones = async () => {
    try {
      setMilestonesLoading(true);
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const json = await res.json();
        setMilestones(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMilestonesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "milestones") {
      fetchMilestones();
    }
  }, [activeTab]);

  const resetMilestoneForm = () => {
    setMilestoneForm({ title_en: '', title_np: '', date_label: '', year_ad: '', description_en: '', description_np: '' });
    setEditingMilestoneId(null);
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title_en, title_np, date_label, description_en, description_np } = milestoneForm;
    if (!title_en.trim() || !title_np.trim() || !date_label.trim() || !description_en.trim() || !description_np.trim()) return;

    try {
      if (editingMilestoneId) {
        const res = await fetch(`/api/milestones/${editingMilestoneId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestoneForm),
        });
        if (res.ok) {
          fetchMilestones();
          resetMilestoneForm();
        }
      } else {
        const res = await fetch('/api/milestones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestoneForm),
        });
        if (res.ok) {
          fetchMilestones();
          resetMilestoneForm();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editMilestone = (m: any) => {
    setMilestoneForm({
      title_en: m.title_en, title_np: m.title_np, date_label: m.date_label,
      year_ad: m.year_ad || '', description_en: m.description_en, description_np: m.description_np,
    });
    setEditingMilestoneId(m.id);
  };

  const deleteMilestone = async (id: number) => {
    if (!confirm('Delete this milestone?')) return;
    try {
      const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMilestones(milestones.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reorderMilestones = async (orderedIds: number[]) => {
    try {
      await fetch('/api/milestones/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      fetchMilestones();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#102419]/5 min-h-screen text-slate-800">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-full md:w-72 bg-[#1a3a2a] text-white flex flex-col border-r border-[#c9a227] shrink-0 no-print">
        {/* Monogram Seal Banner */}
        <div className="p-6 border-b border-[#c9a227]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#c9a227] flex items-center justify-center bg-[#102419] font-serif text-[#c9a227] font-extrabold text-sm shrink-0">
            JSSS
          </div>
          <div className="flex flex-col leading-none font-serif text-left">
            <span className="text-[#c9a227] text-xs font-bold uppercase tracking-wider">CMS CONTROL</span>
            <span className="text-white text-[10px] font-medium opacity-80 mt-0.5">Admin Dashboard</span>
            {/* EMIS & School Code */}
            {siteSettings?.emis && (
              <span className="text-[10px] text-[#c9a227] font-semibold mt-1">EMIS: {siteSettings.emis}</span>
            )}
            {siteSettings?.schoolCode && (
              <span className="text-[10px] text-white/70 font-semibold">Code: {siteSettings.schoolCode}</span>
            )}
          </div>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-[#c9a227]/20 flex items-center gap-3 bg-[#102419]/30">
          <div className="w-8 h-8 rounded bg-[#c9a227] text-[#1a3a2a] flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {role.substring(0, 2)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-sans">{role === "Super Admin" ? "Principal Upadhyaya" : "Teacher Panel"}</span>
            <span className="text-[10px] text-[#c9a227] font-semibold font-mono tracking-wider">{role}</span>
          </div>
        </div>

        {/* Sidebar Nav buttons with Active states */}
        <nav className="flex-grow py-6 px-4 flex flex-col gap-2 font-sans text-xs uppercase tracking-wider font-semibold text-left">
          
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "overview"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "notices"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Manage Notices (CRUD)</span>
          </button>

          <button
            onClick={() => setActiveTab("milestones")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "milestones"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "hero"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Hero Slider</span>
          </button>

          <button
            onClick={() => setActiveTab("admissions")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "admissions"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Admissions Manager</span>
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "results"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Results Uploader</span>
          </button>

          <button
            onClick={() => setActiveTab("faculty")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "faculty"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Faculty & Staff</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "gallery"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Photo Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "events"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Events & Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "messages"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Contact Messages</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full p-3.5 rounded flex items-center gap-3 cursor-pointer transition-all ${
              activeTab === "settings"
                ? "bg-[#c9a227]/20 text-[#c9a227] border-l-4 border-[#c9a227]"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Global Settings</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#c9a227]/30 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-[#8b1a1a] text-white font-bold rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#721515] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#c9a227]" />
            <span>{t("Logout Session", "सत्र अन्त्य गर्नुहोस्")}</span>
          </button>
        </div>
      </aside>

      {/* DASHBOARD WORKSPACE BODY */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1a3a2a]/10 pb-4 mb-8 text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1a3a2a] capitalize">
              {activeTab === "overview" ? "Dashboard Overview" : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Welcome back to JSSS Management Console. Here is your active database.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227] px-3.5 py-2 rounded shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>System Health: ACTIVE</span>
          </div>
        </div>

        {/* --- MODULE 1: OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 text-left">
            {/* Stats strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
              <div className="bg-white border border-[#c9a227]/20 p-5 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Visitors</span>
                  <span className="text-2xl font-bold text-[#1a3a2a] mt-1">1,024</span>
                  <span className="text-[9px] text-[#1a3a2a] font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#c9a227]" /> +12% this week
                  </span>
                </div>
                <Users className="w-10 h-10 text-[#c9a227] opacity-20" />
              </div>

              <div className="bg-white border border-[#c9a227]/20 p-5 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Published Notices</span>
                  <span className="text-2xl font-bold text-[#1a3a2a] mt-1">{notices.length}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-1">Synced to public board</span>
                </div>
                <Bell className="w-10 h-10 text-[#c9a227] opacity-20" />
              </div>

              <div className="bg-white border border-[#c9a227]/20 p-5 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pending Admissions</span>
                  <span className="text-2xl font-bold text-[#1a3a2a] mt-1">
                    {inquiries.filter((i) => i.status === "pending").length}
                  </span>
                  <span className="text-[9px] text-[#8b1a1a] font-bold mt-1 uppercase">Needs review</span>
                </div>
                <GraduationCap className="w-10 h-10 text-[#c9a227] opacity-20" />
              </div>

              <div className="bg-white border border-[#c9a227]/20 p-5 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Report Sheets</span>
                  <span className="text-2xl font-bold text-[#1a3a2a] mt-1">{results.length}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-1">Searchable marksheets</span>
                </div>
                <FileSpreadsheet className="w-10 h-10 text-[#c9a227] opacity-20" />
              </div>
            </div>

            {/* Quick overview panels */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Notices summary */}
              <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4">
                  Active Notice Tickers
                </h3>
                <div className="flex flex-col gap-3 font-sans text-xs">
                  {notices.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-3 border border-[#c9a227]/10 rounded bg-[#fdf6e3]/10 flex items-center justify-between">
                      <span className="font-serif font-bold text-slate-800 truncate max-w-[200px]">{n.titleEn}</span>
                      <span className="px-2 py-0.5 bg-[#8b1a1a]/10 text-[#8b1a1a] font-semibold rounded text-[9px] uppercase">{n.category}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab("notices")}
                    className="text-xs font-bold text-[#1a3a2a] hover:text-[#c9a227] text-left self-start mt-2"
                  >
                    Go to Notices Board &rarr;
                  </button>
                </div>
              </div>

              {/* Admissions summary */}
              <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4">
                  Recent Inquiries Feed
                </h3>
                <div className="flex flex-col gap-3 font-sans text-xs">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="p-3 border border-[#c9a227]/10 rounded bg-[#fdf6e3]/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold block text-slate-800">{inq.studentName}</span>
                        <span className="text-[10px] text-slate-400">{inq.previousSchool}</span>
                      </div>
                      <span className={`px-2 py-0.5 font-bold rounded text-[9px] uppercase ${inq.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-[#c9a227]/15 text-[#c9a227]"}`}>
                        {inq.status}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab("admissions")}
                    className="text-xs font-bold text-[#1a3a2a] hover:text-[#c9a227] text-left self-start mt-2"
                  >
                    Go to Admissions Hub &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 2: NOTICES CRUD TAB --- */}
        {activeTab === "notices" && (
          <div className="grid lg:grid-cols-5 gap-6 text-left items-start">
            {/* Form column */}
            <div className="lg:col-span-2 bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4 flex items-center justify-between">
                <span>{editingNoticeId ? "Edit Notice Record" : "Create Notice Broadcaster"}</span>
                {editingNoticeId && (
                  <button
                    onClick={() => {
                      setEditingNoticeId(null);
                      setNoticeForm({ titleEn: "", titleNp: "", date: "2083-05-23", category: "Exam", isPinned: false, contentEn: "", contentNp: "" });
                    }}
                    className="text-xs font-bold text-[#8b1a1a] hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </h3>

              <form onSubmit={handleNoticeSubmit} className="flex flex-col gap-4 font-sans text-xs sm:text-sm">
                
                {/* Title EN */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[#1a3a2a]">Notice Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.titleEn}
                    onChange={(e) => setNoticeForm({ ...noticeForm, titleEn: e.target.value })}
                    placeholder="e.g. SEE Registration 2083 Form Guidelines"
                    className="p-2 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none focus:border-[#1a3a2a]"
                  />
                </div>

                {/* Title NP */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[#1a3a2a]">Notice Title (Nepali) *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.titleNp}
                    onChange={(e) => setNoticeForm({ ...noticeForm, titleNp: e.target.value })}
                    placeholder="उदा: एस.ई.ई. परीक्षा फारम भर्ने सम्बन्धी सूचना"
                    className="p-2 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none focus:border-[#1a3a2a]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#1a3a2a]">Category Badge</label>
                    <select
                      value={noticeForm.category}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none text-[#1a3a2a] font-bold"
                    >
                      {["Exam", "Holiday", "Event", "Admission", "Results"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pinned Switch */}
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="cmsPinToggle"
                      checked={noticeForm.isPinned}
                      onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                      className="w-4 h-4 accent-[#1a3a2a] cursor-pointer"
                    />
                    <label htmlFor="cmsPinToggle" className="font-semibold text-[#1a3a2a] cursor-pointer">
                      Pin to top
                    </label>
                  </div>
                </div>

                {/* Content EN */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[#1a3a2a]">Notice Content (English)</label>
                  <textarea
                    rows={4}
                    value={noticeForm.contentEn}
                    onChange={(e) => setNoticeForm({ ...noticeForm, contentEn: e.target.value })}
                    placeholder="Enter English notice description details..."
                    className="p-2 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none focus:border-[#1a3a2a]"
                  />
                </div>

                {/* Content NP */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[#1a3a2a]">Notice Content (Nepali)</label>
                  <textarea
                    rows={4}
                    value={noticeForm.contentNp}
                    onChange={(e) => setNoticeForm({ ...noticeForm, contentNp: e.target.value })}
                    placeholder="नेपाली भाषामा सूचनाको विस्तृत विवरण राख्नुहोस्..."
                    className="p-2 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none focus:border-[#1a3a2a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold uppercase rounded cursor-pointer hover:bg-[#102419] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#c9a227]" />
                  <span>{editingNoticeId ? "Save Changes" : "Broadcast Notice"}</span>
                </button>
              </form>
            </div>

            {/* List column */}
            <div className="lg:col-span-3 bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm overflow-hidden">
              <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4">
                Active Notices List ({notices.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-[#1a3a2a]/10 font-bold uppercase text-slate-400">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5 text-center">Category</th>
                      <th className="py-2.5 text-center">Status</th>
                      <th className="py-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {notices.map((n) => (
                      <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pr-4 max-w-xs truncate font-serif font-bold text-slate-800">{n.titleEn}</td>
                        <td className="py-3 text-center">
                          <span className="px-2.5 py-0.5 bg-[#8b1a1a]/10 text-[#8b1a1a] text-[9px] font-bold rounded-full">
                            {n.category}
                          </span>
                        </td>
                        <td className="py-3 text-center text-[#c9a227] font-bold">
                          {n.isPinned ? "★ PINNED" : "NORMAL"}
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditNotice(n)}
                              className="p-1 text-[#1a3a2a] hover:bg-[#1a3a2a]/10 rounded cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(n.id)}
                              className="p-1 text-[#8b1a1a] hover:bg-[#8b1a1a]/10 rounded cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 3: ADMISSIONS MANAGER TAB --- */}
        {activeTab === "admissions" && (
          <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm text-left">
            <div className="flex justify-between items-center border-b border-[#1a3a2a]/10 pb-3 mb-6">
              <h3 className="font-serif font-bold text-lg text-[#1a3a2a] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#c9a227]" />
                <span>Admissions Inquiries Hub</span>
                {admissionsLoading && (
                  <span className="text-xs font-sans font-normal text-slate-400 ml-2">Loading...</span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAdmissions}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-200 cursor-pointer"
                >
                  Refresh
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#102419] cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#c9a227]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {admissionsLoading ? (
              <div className="py-16 text-center text-slate-400 font-sans text-sm">Loading applications from database...</div>
            ) : inquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-sans text-sm">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No admission inquiries yet. They will appear here once students submit the form.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-[#1a3a2a]/10 font-bold uppercase text-slate-400 text-[10px]">
                      <th className="py-2.5 pr-3">App ID</th>
                      <th className="py-2.5 pr-3">Student</th>
                      <th className="py-2.5 pr-3">Guardian</th>
                      <th className="py-2.5 pr-3">Grade</th>
                      <th className="py-2.5 pr-3">Phone</th>
                      <th className="py-2.5 pr-3">Address</th>
                      <th className="py-2.5 pr-3">Prev. School</th>
                      <th className="py-2.5 text-center">Status</th>
                      <th className="py-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {inquiries.map((inq) => {
                      const appId = `JSSS-2083-${String(inq.id).padStart(2, '0')}`;
                      const isUpdating = admissionsUpdating === inq.id;
                      return (
                        <tr key={inq.id} className={`hover:bg-slate-50 transition-colors ${isUpdating ? 'opacity-50' : ''}`}>
                          <td className="py-3 pr-3 font-mono font-bold text-[#8b1a1a] text-[10px]">{appId}</td>
                          <td className="py-3 pr-3">
                            <div className="font-bold text-[#1a3a2a]">{inq.student_name}</div>
                            <div className="text-[10px] text-slate-400">{inq.dob}</div>
                          </td>
                          <td className="py-3 pr-3 font-semibold">{inq.guardian_name}</td>
                          <td className="py-3 pr-3 text-center font-bold">Gr. {inq.grade_applying}</td>
                          <td className="py-3 pr-3 font-mono text-[10px]">{inq.phone}</td>
                          <td className="py-3 pr-3 max-w-[120px] truncate" title={inq.address}>{inq.address || '—'}</td>
                          <td className="py-3 pr-3 max-w-[120px] truncate text-slate-500" title={inq.previous_school || ''}>{inq.previous_school || '—'}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase whitespace-nowrap ${
                              inq.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inq.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex gap-1 justify-center">
                              {inq.status !== 'approved' && (
                                <button
                                  onClick={() => handleInquiryStatus(inq.id, 'approved')}
                                  disabled={isUpdating}
                                  className="px-2 py-1 bg-[#1a3a2a] text-white border border-[#c9a227] rounded text-[9px] uppercase font-bold hover:bg-[#102419] cursor-pointer disabled:opacity-50"
                                >
                                  ✓ Approve
                                </button>
                              )}
                              {inq.status !== 'rejected' && (
                                <button
                                  onClick={() => handleInquiryStatus(inq.id, 'rejected')}
                                  disabled={isUpdating}
                                  className="px-2 py-1 bg-white border border-[#8b1a1a] text-[#8b1a1a] rounded text-[9px] uppercase font-bold hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                                >
                                  ✕ Reject
                                </button>
                              )}
                              {inq.status !== 'pending' && (
                                <button
                                  onClick={() => handleInquiryStatus(inq.id, 'pending')}
                                  disabled={isUpdating}
                                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] uppercase font-bold hover:bg-slate-200 cursor-pointer disabled:opacity-50"
                                >
                                  Reset
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                disabled={isUpdating}
                                className="p-1 text-rose-400 hover:bg-rose-50 rounded cursor-pointer disabled:opacity-50"
                                title="Remove from list"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- MODULE 4: RESULTS UPLOADER TAB --- */}
        {activeTab === "results" && (
          <div className="grid lg:grid-cols-5 gap-6 text-left items-start">
            
            {/* CSV Uploader & Manual Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Spreadsheet Upload */}
              <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#c9a227]" />
                  <span>Upload Results Spreadsheet</span>
                </h3>
                
                <div className="flex flex-col gap-4 font-sans text-xs">
                  <p className="text-slate-500">
                    Upload a class results file (.xlsx or .csv) with columns:
                    <strong className="block font-mono text-[9px] mt-1 bg-slate-100 p-1.5 rounded">
                      roll, name, english, nepali, math, science, social
                    </strong>
                  </p>

                  <div className="border-2 border-dashed border-[#c9a227]/30 rounded-lg p-4 text-center hover:bg-[#c9a227]/5 cursor-pointer relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FileSpreadsheet className="w-8 h-8 text-[#c9a227] mx-auto opacity-70 mb-2" />
                    <span className="font-bold text-[#1a3a2a] block">{fileName || "Choose File"}</span>
                    <span className="text-[10px] text-slate-400 mt-1">Supports .xlsx, .xls, .csv</span>
                  </div>

                  {fileContent && (
                    <button
                      onClick={processSpreadsheet}
                      className="w-full py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold uppercase rounded cursor-pointer hover:bg-[#102419]"
                    >
                      Process & Save Uploaded Data
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4">
                  Manual Result Sheet Entry
                </h3>

                <form onSubmit={handleManualResultSubmit} className="flex flex-col gap-3 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#1a3a2a]">Roll Number *</label>
                      <input
                        type="text"
                        required
                        value={resultRollNo}
                        onChange={(e) => setResultRollNo(e.target.value)}
                        placeholder="e.g. 102"
                        className="p-2 border border-[#c9a227]/30 rounded bg-[#fdf6e3]/30 font-mono font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#1a3a2a]">Class Grade</label>
                      <select
                        value={resultClass}
                        onChange={(e) => setResultClass(e.target.value)}
                        className="p-2 border border-[#c9a227]/30 bg-white rounded font-bold text-[#1a3a2a]"
                      >
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map((c) => (
                          <option key={c} value={String(c)}>Grade {c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#1a3a2a]">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={resultName}
                      onChange={(e) => setResultName(e.target.value)}
                      placeholder="e.g. Ritika Chaudhary"
                      className="p-2 border border-[#c9a227]/30 rounded bg-[#fdf6e3]/30"
                    />
                  </div>

                  {/* Marks */}
                  <div className="border-t border-[#c9a227]/20 pt-3">
                    <span className="font-bold text-[10px] text-[#8b1a1a] block uppercase mb-2">Subject Marks (Max 100)</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="font-semibold text-[10px]">English</label>
                        <input
                          type="number"
                          value={manualMarks.english}
                          onChange={(e) => setManualMarks({ ...manualMarks, english: e.target.value })}
                          className="p-1 border border-[#c9a227]/30 rounded text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="font-semibold text-[10px]">Nepali</label>
                        <input
                          type="number"
                          value={manualMarks.nepali}
                          onChange={(e) => setManualMarks({ ...manualMarks, nepali: e.target.value })}
                          className="p-1 border border-[#c9a227]/30 rounded text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="font-semibold text-[10px]">Mathematics</label>
                        <input
                          type="number"
                          value={manualMarks.maths}
                          onChange={(e) => setManualMarks({ ...manualMarks, maths: e.target.value })}
                          className="p-1 border border-[#c9a227]/30 rounded text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="font-semibold text-[10px]">Science</label>
                        <input
                          type="number"
                          value={manualMarks.science}
                          onChange={(e) => setManualMarks({ ...manualMarks, science: e.target.value })}
                          className="p-1 border border-[#c9a227]/30 rounded text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="font-semibold text-[10px]">Social</label>
                        <input
                          type="number"
                          value={manualMarks.social}
                          onChange={(e) => setManualMarks({ ...manualMarks, social: e.target.value })}
                          className="p-1 border border-[#c9a227]/30 rounded text-center font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold uppercase rounded cursor-pointer hover:bg-[#102419] mt-2"
                  >
                    Generate Marksheet
                  </button>
                </form>
              </div>

            </div>

            {/* List column */}
            <div className="lg:col-span-3 bg-white border border-[#c9a227]/20 rounded-lg p-5 shadow-sm overflow-hidden">
              <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-4">
                Uploaded Marksheets Database ({results.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-[#1a3a2a]/10 font-bold uppercase text-slate-400">
                      <th className="py-2.5 text-center">Roll</th>
                      <th className="py-2.5">Student Name</th>
                      <th className="py-2.5 text-center">Class / Year</th>
                      <th className="py-2.5 text-center">Avg %</th>
                      <th className="py-2.5 text-center">Division</th>
                      <th className="py-2.5 text-center">Status</th>
                      <th className="py-2.5 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {results.map((r) => (
                      <tr key={r.rollNo} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 text-center font-mono font-bold text-[#8b1a1a]">{r.rollNo}</td>
                        <td className="py-3 font-serif font-bold text-slate-800">{r.studentName}</td>
                        <td className="py-3 text-center font-mono">Grade {r.classGrade} ({r.academicYear} BS)</td>
                        <td className="py-3 text-center font-mono text-[#1a3a2a]">{r.percentage}%</td>
                        <td className="py-3 text-center text-[#c9a227]">{r.divisionEn}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${r.passStatus ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {r.passStatus ? "PASS" : "FAIL"}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleDeleteResult(r.rollNo)}
                            className="p-1 text-[#8b1a1a] hover:bg-[#8b1a1a]/10 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- MILESTONES TAB --- */}
        {activeTab === "milestones" && (
          <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 md:p-8 shadow-sm text-left">
            <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-[#c9a227]" />
              <span>Historical Milestones Management</span>
            </h3>

            {/* Add / Edit Form */}
            <div className="mb-8 p-5 border border-[#c9a227]/20 rounded-lg bg-[#fdf6e3]/20">
              <h4 className="text-sm font-bold text-[#1a3a2a] mb-4">
                {editingMilestoneId ? 'Edit Milestone' : 'Add New Milestone'}
              </h4>
              <form onSubmit={handleMilestoneSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Title (English)</label>
                    <input type="text" value={milestoneForm.title_en} required
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title_en: e.target.value })}
                      placeholder="e.g. Establishment"
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Title (Nepali)</label>
                    <input type="text" value={milestoneForm.title_np} required
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title_np: e.target.value })}
                      placeholder="e.g. विद्यालयको स्थापना"
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a]" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Date Label <span className="text-rose-500">*</span></label>
                    <input type="text" value={milestoneForm.date_label} required
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, date_label: e.target.value })}
                      placeholder="e.g. 2037 BS"
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Year (AD) <span className="text-slate-400">(optional)</span></label>
                    <input type="text" value={milestoneForm.year_ad}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, year_ad: e.target.value })}
                      placeholder="e.g. 1980 AD"
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a]" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Description (English)</label>
                    <textarea rows={3} value={milestoneForm.description_en} required
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description_en: e.target.value })}
                      placeholder="Describe this milestone..."
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a] resize-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Description (Nepali)</label>
                    <textarea rows={3} value={milestoneForm.description_np} required
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description_np: e.target.value })}
                      placeholder="विवरण..."
                      className="p-2.5 border border-[#c9a227]/30 bg-white rounded focus:outline-none focus:border-[#1a3a2a] resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  {editingMilestoneId && (
                    <button type="button" onClick={resetMilestoneForm}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-xs font-bold uppercase cursor-pointer hover:bg-slate-50">
                      <X className="w-3.5 h-3.5 inline mr-1" /> Cancel
                    </button>
                  )}
                  <button type="submit"
                    className="px-6 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] text-xs font-bold uppercase rounded cursor-pointer hover:bg-[#102419] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {editingMilestoneId ? 'Update' : 'Add'} Milestone
                  </button>
                </div>
              </form>
            </div>

            {/* Milestones List with Drag & Drop */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <div className="col-span-1 text-center">Order</div>
                <div className="col-span-3">Title (EN) / (NP)</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {milestonesLoading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Loading milestones...</div>
              ) : milestones.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No milestones yet. Add one above.</div>
              ) : (
                <div className="divide-y divide-slate-100" id="milestone-list">
                  {milestones.map((m, i) => (
                    <div key={m.id} className="grid grid-cols-12 gap-4 p-3 items-center group hover:bg-slate-50 transition-colors"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', String(m.id));
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
                        if (!draggedId || draggedId === m.id) return;
                        const ids = milestones.map(x => x.id);
                        const fromIdx = ids.indexOf(draggedId);
                        const toIdx = ids.indexOf(m.id);
                        if (fromIdx === -1 || toIdx === -1) return;
                        ids.splice(fromIdx, 1);
                        ids.splice(toIdx, 0, draggedId);
                        reorderMilestones(ids);
                      }}>
                      <div className="col-span-1 flex justify-center text-slate-400">
                        <GripVertical className="w-4 h-4 cursor-grab" />
                      </div>
                      <div className="col-span-3">
                        <div className="text-xs font-bold text-slate-800 truncate">{m.title_en}</div>
                        <div className="text-[10px] text-slate-500 truncate">{m.title_np}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 bg-[#8b1a1a]/10 text-[#8b1a1a] text-[10px] font-bold rounded-full">
                          {m.date_label}{m.year_ad ? ` (${m.year_ad})` : ''}
                        </span>
                      </div>
                      <div className="col-span-4 truncate text-xs text-slate-600">
                        <div className="truncate">{m.description_en}</div>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${m.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                          {m.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-center gap-1">
                        <button onClick={() => editMilestone(m)}
                          className="p-1.5 text-slate-400 hover:text-[#1a3a2a] hover:bg-slate-100 rounded cursor-pointer"
                          title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteMilestone(m.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MODULE 6: HERO SLIDER TAB --- */}
        {activeTab === "hero" && (
          <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 md:p-8 shadow-sm text-left">
            <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#c9a227]" />
              <span>Hero Slider Management</span>
            </h3>

            {/* Add New Slide Form */}
            <div className="mb-8 p-5 border border-[#c9a227]/20 rounded-lg bg-[#fdf6e3]/20">
              <h2 className="text-sm font-semibold mb-4 text-slate-700">Add New Slide</h2>
              <form onSubmit={addHeroSlide} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewHeroFile(e.target.files?.[0] || null)}
                    className="p-2 border border-[#c9a227]/30 bg-white rounded text-sm focus:outline-none focus:border-[#1a3a2a]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Caption <span className="text-slate-400">(optional)</span></label>
                  <input
                    type="text"
                    value={newHeroCaption}
                    onChange={(e) => setNewHeroCaption(e.target.value)}
                    placeholder="e.g. School Annual Day 2081"
                    className="p-2 border border-[#c9a227]/30 bg-white rounded text-sm focus:outline-none focus:border-[#1a3a2a]"
                  />
                </div>
                <button
                  type="submit"
                  className="self-start px-6 py-2 bg-[#1a3a2a] text-white border border-[#c9a227] text-xs font-bold uppercase rounded cursor-pointer hover:bg-[#102419] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </form>
            </div>

            {/* Slides List */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-3 font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <div className="col-span-1 text-center">Order</div>
                <div className="col-span-2">Preview</div>
                <div className="col-span-3">Image URL</div>
                <div className="col-span-3">Caption</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {heroLoading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Loading slides...</div>
              ) : heroSlides.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No slides found. Add one above.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {heroSlides.map((slide, index) => (
                    <div key={slide.id} className="grid grid-cols-12 gap-4 p-3 items-center group hover:bg-slate-50 transition-colors">
                      <div className="col-span-1 flex justify-center text-slate-400">
                        <GripVertical className="w-4 h-4 cursor-grab" />
                      </div>
                      
                      <div className="col-span-2">
                        <div className="aspect-[16/9] bg-slate-100 rounded overflow-hidden border border-slate-200">
                          <img src={slide.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="col-span-3 truncate text-xs text-slate-600 font-mono">
                        {slide.image_url}
                      </div>

                      <div className="col-span-3 truncate text-xs text-slate-700">
                        {slide.caption || <span className="italic text-slate-400">No caption</span>}
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleHeroVisibility(slide.id, slide.is_active)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            slide.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {slide.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          {slide.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => deleteHeroSlide(slide.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MODULE 5: GLOBAL SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="bg-white border border-[#c9a227]/20 rounded-lg p-5 md:p-8 shadow-sm text-left">
            <h3 className="font-serif font-bold text-lg text-[#1a3a2a] border-b border-[#1a3a2a]/10 pb-3 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#c9a227]" />
              <span>Global School configurations & Editorial Content</span>
            </h3>

            <form onSubmit={handleSettingsSave} className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
              {/* Motto */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">School Motto (English)</label>
                  <input
                    type="text"
                    value={siteSettings.mottoEn}
                    onChange={(e) => setSiteSettings({ ...siteSettings, mottoEn: e.target.value })}
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">School Motto (Nepali Devanagari)</label>
                  <input
                    type="text"
                    value={siteSettings.mottoNp}
                    onChange={(e) => setSiteSettings({ ...siteSettings, mottoNp: e.target.value })}
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* EMIS & Announcement text */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">EMIS Code</label>
                  <input
                    type="text"
                    value={siteSettings.emis}
                    onChange={(e) => setSiteSettings({ ...siteSettings, emis: e.target.value })}
                    placeholder="e.g. EMIS-12345"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">School Code</label>
                  <input
                    type="text"
                    value={siteSettings.schoolCode}
                    onChange={(e) => setSiteSettings({ ...siteSettings, schoolCode: e.target.value })}
                    placeholder="e.g. SC-123"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Academic Year (BS)</label>
                  <input
                    type="text"
                    value={siteSettings.calendar_year}
                    onChange={(e) => setSiteSettings({ ...siteSettings, calendar_year: e.target.value })}
                    placeholder="e.g. २०८३"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Stats counters */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Total Students</label>
                  <input
                    type="text"
                    value={siteSettings.totalStudents}
                    onChange={(e) => setSiteSettings({ ...siteSettings, totalStudents: e.target.value })}
                    placeholder="e.g. 847+"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Total Staff</label>
                  <input
                    type="text"
                    value={siteSettings.totalStaff}
                    onChange={(e) => setSiteSettings({ ...siteSettings, totalStaff: e.target.value })}
                    placeholder="e.g. 42"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Established Year (BS)</label>
                  <input
                    type="text"
                    value={siteSettings.establishedYearBS}
                    onChange={(e) => setSiteSettings({ ...siteSettings, establishedYearBS: e.target.value })}
                    placeholder="e.g. 2037"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Classes Range</label>
                  <input
                    type="text"
                    value={siteSettings.schoolClasses}
                    onChange={(e) => setSiteSettings({ ...siteSettings, schoolClasses: e.target.value })}
                    placeholder="e.g. 1–10"
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">School Logo</label>
                <div className="flex gap-4 items-center">
                  {siteSettings.logoUrl && (
                    <div className="w-12 h-12 rounded-full border-2 border-[#c9a227] overflow-hidden shrink-0 bg-[#1a3a2a]">
                      <img src={siteSettings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setLogoFile(f);
                    }}
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={uploadLogo}
                    className="ml-2 px-3 py-2 bg-[#1a3a2a] text-white rounded"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Announcement text */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Announcement Ticker Text (Nepali)</label>
                  <textarea
                    rows={2}
                    value={siteSettings.announcementTextNp}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcementTextNp: e.target.value })}
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[#1a3a2a]">Announcement Ticker Text (English)</label>
                  <textarea
                    rows={2}
                    value={siteSettings.announcementTextEn}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcementTextEn: e.target.value })}
                    className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Principal Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">Principal Welcome Address (English)</label>
                <textarea
                  rows={4}
                  value={siteSettings.principalMessageEn}
                  onChange={(e) => setSiteSettings({ ...siteSettings, principalMessageEn: e.target.value })}
                  className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[#1a3a2a]">Principal Welcome Address (Nepali)</label>
                <textarea
                  rows={4}
                  value={siteSettings.principalMessageNp}
                  onChange={(e) => setSiteSettings({ ...siteSettings, principalMessageNp: e.target.value })}
                  className="p-2.5 border border-[#c9a227]/30 bg-[#fdf6e3]/30 rounded focus:outline-none font-bold"
                />
              </div>

              {/* Switches */}
              <div className="grid sm:grid-cols-2 gap-4 border-t border-[#c9a227]/20 pt-4 font-bold text-xs text-[#1a3a2a]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="announceSwitch"
                    checked={siteSettings.announcementVisible}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcementVisible: e.target.checked })}
                    className="w-4 h-4 accent-[#1a3a2a] cursor-pointer"
                  />
                  <label htmlFor="announceSwitch" className="cursor-pointer">Enable Top Announcement Bar</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="maintenanceSwitch"
                    checked={siteSettings.maintenanceMode}
                    onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 accent-[#1a3a2a] cursor-pointer"
                  />
                  <label htmlFor="maintenanceSwitch" className="cursor-pointer text-[#8b1a1a]">Enable System Maintenance Mode</label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1a3a2a] text-white border border-[#c9a227] font-bold uppercase rounded cursor-pointer hover:bg-[#102419] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#c9a227]" />
                <span>Save Config Options</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === "faculty" && <FacultyManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "events" && <EventManager />}
        {activeTab === "messages" && <MessageManager />}
        {activeTab === "academicPrograms" && <AcademicProgramsManager />}

      </main>
    </div>
  );
}
